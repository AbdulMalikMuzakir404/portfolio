import { gsap } from "gsap";
import type { CursorSpec, Guide, Pt, Rect, Scene, Step, Tool } from "./types";

type Sel = { el: HTMLElement; r: Rect; drop?: HTMLElement };
type Agent = {
  spec: CursorSpec;
  el: HTMLElement; // driven by the scroll timeline
  inner: HTMLElement; // free for the time-based intro drift
  svg: SVGElement;
  ring: HTMLElement;
  pos: Pt; // advances as steps compile; ends wherever the timeline leaves the cursor
  home: Pt; // where the cursor sits at progress 0
  t: number;
  side: 1 | -1;
  sel?: Sel;
};

const ICONS: Record<Tool, string> = {
  move: '<path d="M5 3l11 5.2-4.7 1.6L9.6 14.5z"/>',
  frame: '<path d="M7 3v14M13 3v14M3 7h14M3 13h14"/>',
  rect: '<rect x="3.5" y="5" width="13" height="10" rx="1.5"/>',
  text: '<path d="M4.5 6V4h11v2M10 4v12M7.5 16h5"/>',
  image: '<rect x="3.5" y="4" width="13" height="12" rx="1.5"/><circle cx="8" cy="8.5" r="1.4"/><path d="M4 14.5l4-3.5 3 2.5 2-1.5 3.5 2.5"/>',
};
const svgIcon = (body: string) =>
  `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const div = (cls: string, parent: HTMLElement, html = "") => {
  const el = document.createElement("div");
  el.className = cls;
  el.innerHTML = html;
  parent.appendChild(el);
  return el;
};
const dims = (r: Rect) => `${Math.round(r.w)} × ${Math.round(r.h)}`;
const clamp = gsap.utils.clamp;

/**
 * Compiles a Scene into one paused GSAP timeline. Every element is measured once up front,
 * then each step appends tweens at an absolute time on its cursor's own clock, so cursors
 * work in parallel while each one stays sequential. The timeline is pure function of
 * progress: scrubbing backwards un-builds the page exactly.
 */
export class Director {
  readonly tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
  readonly overlay: HTMLElement;
  readonly agents = new Map<string, Agent>();
  private ends = new Map<string, number>();
  private rects = new Map<Element, Rect>();
  private xf = new Map<Element, { dx: number; dy: number; s: number }>();
  private tools = new Map<Tool, HTMLElement>();
  private chrome: HTMLElement[] = [];
  private publishChip?: { chip: HTMLElement; done: HTMLElement; toast: HTMLElement };
  private progressBar?: HTMLElement;
  private cue?: HTMLElement;
  private base: DOMRect;

  constructor(
    readonly root: HTMLElement,
    private scene: Scene,
    cursors: CursorSpec[],
    private alias: Record<string, string>,
    private mode: "desktop" | "tablet",
  ) {
    this.base = root.getBoundingClientRect();
    root.querySelectorAll("[data-build], [data-ch]").forEach((el) => this.rects.set(el, this.measure(el)));

    this.overlay = div("sw-overlay", root);
    this.overlay.setAttribute("aria-hidden", "true");
    this.overlay.inert = true;

    if (scene.chrome === "editor") this.editorChrome();
    if (scene.chrome === "publish") this.publishChrome();

    const used = new Set(scene.steps.map((s) => this.who(s.who)).filter((id) => id !== "*"));
    cursors
      .filter((c) => used.has(c.id))
      .forEach((spec, i) => this.agents.set(spec.id, this.cursor(spec, i)));
  }

  get size() {
    return { w: this.base.width, h: this.base.height };
  }

  /** Offset from each cursor's start to its off-canvas exit point; the intro flies in along it. */
  enterOffsets() {
    return [...this.agents.values()].map((a) => {
      const e = this.frac(a.spec.exit);
      return { x: e.x - a.home.x, y: e.y - a.home.y };
    });
  }

  build() {
    for (const s of this.scene.steps) {
      const after = s.after ? (this.ends.get(s.after) ?? 0) : 0;
      if (s.who === "*") {
        const t0 = Math.max(after, s.at ?? 0, ...[...this.agents.values()].map((a) => a.t)) + 0.15;
        const end = s.do === "publish" ? this.publish(t0) : this.exit(t0);
        this.agents.forEach((a) => (a.t = end));
        if (s.id) this.ends.set(s.id, end);
        continue;
      }
      const a = this.agents.get(this.who(s.who));
      if (!a) continue;
      const start = Math.max(a.t, s.at ?? 0, after);
      // A short beat before each action reads as intent rather than a mechanical chain.
      const t0 = start > 0 ? start + 0.12 : 0;
      const end = this.task(a, s, t0);
      if (s.say) this.say(a, s.say, t0, end);
      a.t = end;
      if (s.id) this.ends.set(s.id, end);
    }
    if (this.cue) this.tl.to(this.cue, { autoAlpha: 0, duration: 0.25, ease: "none" }, 0);
    if (this.progressBar) this.tl.fromTo(this.progressBar, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: this.tl.duration() }, 0);
    return this.tl;
  }

  // ---------------------------------------------------------------- tasks

  private task(a: Agent, s: Step, t: number): number {
    switch (s.do) {
      case "tool":
        return this.tool(a, s.tool, t);
      case "type":
        return this.type(a, s.target, t);
      case "draw":
        return this.draw(a, s.target, t, s.until ?? 1, !!s.drop);
      case "place":
        return this.place(a, s.target, t);
      case "resize":
        return this.resize(a, s.target, t, s.from);
      case "appear":
        return this.appear(a, s.target, t, s.offset, s.scale);
      case "scale":
        return this.scale(a, s.target, t);
      case "drag":
        return this.drag(a, s.target, t, s.guides);
      case "duplicate":
        return this.duplicate(a, s.source, s.target, t, s.guides);
      case "fill":
        return this.fill(a, s.target, t);
      case "line":
        return this.line(a, s.target, t);
      case "select":
        return this.select(a, s.target, t);
      case "stamp":
        return this.stamp(a, s.target, t);
      case "highlight":
        return this.highlight(a, s.target, t);
      case "import":
        return this.import(a, s.target, t, s.from, s.guides);
      case "comment":
        return this.comment(a, s.target, s.text, t);
      case "deselect":
        return this.deselect(a, t);
      case "wait":
        return t + s.dur;
      case "rest":
        return this.move(a, this.frac(s.to), t, "power2.out");
      default:
        return t;
    }
  }

  private move(a: Agent, p: Pt, t: number, ease = "power2.inOut"): number {
    const f = a.pos;
    const dx = p.x - f.x;
    const dy = p.y - f.y;
    const d = Math.hypot(dx, dy);
    if (d < 1) return t;
    const dur = clamp(0.3, 0.95, 0.28 + d / 1500);
    // Hands move in arcs, not rulers: bow the path sideways, more for longer trips.
    const bend = a.side * Math.min(70, d * 0.16);
    const mid = { x: f.x + dx / 2 - (dy / d) * bend, y: f.y + dy / 2 + (dx / d) * bend };
    this.tl.to(a.el, { motionPath: { path: [f, mid, p], curviness: 1.1 }, duration: dur, ease }, t);
    a.pos = p;
    return t + dur;
  }

  private press(a: Agent, t: number): number {
    this.tl.fromTo(a.ring, { scale: 0.3, autoAlpha: 0.9 }, { scale: 1.6, autoAlpha: 0, duration: 0.32, ease: "power1.out", immediateRender: false }, t);
    this.tl.to(a.svg, { scale: 0.84, duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" }, t);
    return t + 0.14;
  }

  private dragTo(a: Agent, p: Pt, t: number, dur: number, ease = "power2.inOut") {
    this.tl.to(a.el, { x: p.x, y: p.y, duration: dur, ease }, t);
    a.pos = p;
  }

  private tool(a: Agent, tool: Tool, t: number): number {
    const btn = this.tools.get(tool);
    if (!btn) return t;
    const r = this.rects.get(btn)!;
    t = this.move(a, { x: r.x + r.w / 2, y: r.y + r.h / 2 }, t);
    t = this.press(a, t);
    this.tl.set([...this.tools.values()], { backgroundColor: "rgba(0,0,0,0)", color: "#8B8B92" }, t);
    this.tl.set(btn, { backgroundColor: a.spec.color, color: "#0A0A0B" }, t);
    return t + 0.1;
  }

  private type(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    const caret = div("sw-caret", this.overlay);
    caret.style.background = a.spec.color;
    gsap.set(caret, { x: r.x, y: r.y + r.h * 0.12, height: r.h * 0.76, autoAlpha: 0 });

    t = this.move(a, { x: r.x - 2, y: r.y + r.h * 0.6 }, t);
    t = this.press(a, t);
    // The pointer steps aside so the words stay readable while they're typed.
    this.dragTo(a, { x: r.x - 22, y: r.y + r.h + 18 }, t, 0.35, "power2.out");
    this.tl.set(caret, { autoAlpha: 1 }, t);

    const chars = [...el.querySelectorAll<HTMLElement>("[data-ch]")];
    let dur: number;
    if (chars.length) {
      const step = 0.055;
      dur = chars.length * step;
      gsap.set(chars, { opacity: 0 });
      this.tl.to(chars, { opacity: 1, duration: 0.001, stagger: step, ease: "none" }, t);
      // Keyframes start one step early so the caret lands on each glyph's edge as it appears.
      const edges = chars.map((c) => {
        const cr = this.rect(c);
        return cr.x + cr.w;
      });
      this.tl.to(caret, { keyframes: edges.map((x) => ({ x, duration: step, ease: "steps(1)" })) }, t - step);
    } else {
      // Monospaced text: a stepped clip reveals whole characters, the caret rides its edge.
      const n = Math.max(1, (el.textContent ?? "").trim().length);
      const step = 0.035;
      dur = n * step;
      gsap.set(el, { clipPath: "inset(0% 100% 0% 0%)" });
      this.tl.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: `steps(${n})` }, t);
      this.tl.to(caret, { x: r.x + r.w, duration: dur, ease: `steps(${n})` }, t);
      this.unclip(el, t + dur);
    }
    this.tl.set(caret, { autoAlpha: 0 }, t + dur + 0.2);
    return t + dur;
  }

  private draw(a: Agent, target: string, t: number, until: number, drop: boolean): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    gsap.set(el, { clipPath: "inset(0% 100% 100% 0%)" });

    t = this.move(a, { x: r.x, y: r.y }, t);
    t = this.press(a, t);
    const sel = this.sel(a, { x: r.x, y: r.y, w: 0, h: 0 }, t, r);
    const boxes: HTMLElement[] = [sel.el];
    if (drop) {
      sel.drop = div("sw-drop", this.overlay, `${svgIcon(ICONS.image)}<span>Drop image</span>`);
      gsap.set(sel.drop, { x: r.x, y: r.y, width: 0, height: 0, autoAlpha: 0 });
      this.tl.set(sel.drop, { autoAlpha: 1 }, t);
      boxes.push(sel.drop);
    }
    const dur = clamp(0.5, 1.1, 0.4 + (r.w + r.h) / 2000);
    const w = r.w * until;
    const h = r.h * until;
    const cut = `${(1 - until) * 100}%`;
    this.dragTo(a, { x: r.x + w, y: r.y + h }, t, dur);
    this.tl.to(el, { clipPath: `inset(0% ${cut} ${cut} 0%)`, duration: dur }, t);
    this.tl.to(boxes, { width: w, height: h, duration: dur }, t);
    sel.r = { x: r.x, y: r.y, w, h };
    if (until >= 1) this.unclip(el, t + dur);
    return t + dur;
  }

  private place(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    const media = el?.querySelector<HTMLElement>("[data-build-part='media'], img");
    if (!el || !media) return t;
    gsap.set(media, { autoAlpha: 0, scale: 1.08 });
    const r = a.sel?.r ?? this.rect(el);
    t = this.move(a, { x: r.x + r.w * 0.55, y: r.y + r.h * 0.5 }, t);
    t = this.press(a, t);
    this.tl.to(media, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power3.out" }, t);
    if (a.sel?.drop) this.tl.to(a.sel.drop, { autoAlpha: 0, duration: 0.25 }, t);
    return t + 0.55;
  }

  private resize(a: Agent, target: string, t: number, from: number): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    t = this.move(a, { x: r.x + r.w * from, y: r.y + r.h * from }, t);
    t = this.press(a, t);
    const dur = 0.65;
    this.dragTo(a, { x: r.x + r.w, y: r.y + r.h }, t, dur, "power3.inOut");
    this.tl.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: "power3.inOut" }, t);
    this.unclip(el, t + dur);
    if (a.sel) {
      this.tl.to(a.sel.el, { width: r.w, height: r.h, duration: dur, ease: "power3.inOut" }, t);
      a.sel.r = r;
    }
    return t + dur;
  }

  private appear(a: Agent, target: string, t: number, offset: Pt, s: number): number {
    const el = this.el(target);
    if (!el) return t;
    this.xf.set(el, { dx: offset.x, dy: offset.y, s });
    gsap.set(el, { autoAlpha: 0, x: offset.x, y: offset.y, scale: s, transformOrigin: "0 0" });
    const v = this.vis(el);
    t = this.move(a, { x: v.x, y: v.y + 4 }, t);
    t = this.press(a, t);
    this.tl.to(el, { autoAlpha: 1, duration: 0.2, ease: "none" }, t);
    this.sel(a, v, t, this.rect(el));
    return t + 0.3;
  }

  private scale(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    const x = el && this.xf.get(el);
    if (!el || !x) return t;
    const r = this.rect(el);
    const v = this.vis(el);
    t = this.move(a, { x: v.x + v.w, y: v.y + v.h }, t);
    t = this.press(a, t);
    const dur = 0.9;
    this.tl.to(el, { scale: 1, duration: dur, ease: "power3.inOut" }, t);
    this.dragTo(a, { x: v.x + r.w, y: v.y + r.h }, t, dur, "power3.inOut");
    if (a.sel) this.tl.to(a.sel.el, { width: r.w, height: r.h, duration: dur, ease: "power3.inOut" }, t);
    x.s = 1;
    return t + dur;
  }

  private drag(a: Agent, target: string, t: number, guides: Guide[] = []): number {
    const el = this.el(target);
    const x = el && this.xf.get(el);
    if (!el || !x) return t;
    const v = this.vis(el);
    const grab = { x: v.x + Math.min(v.w * 0.35, 180), y: v.y + v.h * 0.4 };
    t = this.move(a, grab, t);
    t = this.press(a, t);
    const dur = 0.8;
    // Overshoot-free settle; the guides flashing on arrival read as the snap.
    this.tl.to(el, { x: 0, y: 0, duration: dur, ease: "power3.inOut" }, t);
    this.dragTo(a, { x: grab.x - x.dx, y: grab.y - x.dy }, t, dur, "power3.inOut");
    if (a.sel) this.tl.to(a.sel.el, { x: v.x - x.dx, y: v.y - x.dy, duration: dur, ease: "power3.inOut" }, t);
    this.guides(el, guides, t + dur * 0.6, t + dur + 0.35);
    x.dx = 0;
    x.dy = 0;
    return t + dur;
  }

  private duplicate(a: Agent, source: string, target: string, t: number, guides: Guide[] = []): number {
    const src = this.el(source);
    const dst = this.el(target);
    if (!src || !dst) return t;
    const rs = this.rect(src);
    const rd = this.rect(dst);
    gsap.set(dst, { autoAlpha: 0 });

    // The ghost is a snapshot of the source as it looks once built (labels may still be empty).
    const ghost = src.cloneNode(true) as HTMLElement;
    [ghost, ...ghost.querySelectorAll<HTMLElement>("[id], [data-build], [data-build-part], [data-ch]")].forEach((n) => {
      n.removeAttribute("id");
      n.removeAttribute("data-build");
      n.removeAttribute("data-build-part");
      n.removeAttribute("data-ch");
    });
    ghost.style.cssText = "";
    ghost.classList.add("sw-ghost");
    this.overlay.appendChild(ghost);
    gsap.set(ghost, { x: rs.x, y: rs.y, width: rs.w, height: rs.h, autoAlpha: 0 });

    const grab = { x: rs.x + rs.w * 0.5, y: rs.y + rs.h * 0.5 };
    t = this.move(a, grab, t);
    t = this.press(a, t);
    const sel = this.sel(a, rs, t, rd);
    this.tl.set(ghost, { autoAlpha: 0.92 }, t);
    const dur = clamp(0.55, 1, 0.45 + Math.hypot(rd.x - rs.x, rd.y - rs.y) / 1600);
    this.dragTo(a, { x: rd.x + rs.w * 0.5, y: rd.y + rs.h * 0.5 }, t, dur, "power3.inOut");
    this.tl.to([ghost, sel.el], { x: rd.x, y: rd.y, duration: dur, ease: "power3.inOut" }, t);
    this.guides(dst, guides, t + dur * 0.6, t + dur + 0.35);
    // On drop the instance adopts its own size, then the real element takes over.
    const t2 = t + dur;
    this.tl.to([ghost, sel.el], { width: rd.w, height: rd.h, duration: 0.2 }, t2);
    this.tl.set(dst, { autoAlpha: 1 }, t2 + 0.2);
    this.tl.to(ghost, { autoAlpha: 0, duration: 0.12 }, t2 + 0.2);
    sel.r = rd;
    return t2 + 0.32;
  }

  private fill(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    const parts = el ? [...el.querySelectorAll<HTMLElement>("[data-build-part='label']")] : [];
    if (!el || !parts.length) return t;
    gsap.set(parts, { opacity: 0 });
    const r = this.rect(el);
    t = this.move(a, { x: r.x + Math.min(r.w * 0.5, 120), y: r.y + r.h * 0.55 }, t);
    t = this.press(a, t);
    t = this.press(a, t);
    const step = 0.12;
    this.tl.to(parts, { opacity: 1, duration: 0.18, stagger: step, ease: "none" }, t);
    return t + 0.18 + step * (parts.length - 1);
  }

  private line(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    gsap.set(el, { scaleX: 0, transformOrigin: "0 50%" });
    t = this.move(a, { x: r.x, y: r.y }, t);
    t = this.press(a, t);
    const dur = 0.4 + r.w / 2400;
    this.tl.to(el, { scaleX: 1, duration: dur }, t);
    this.dragTo(a, { x: r.x + r.w, y: r.y }, t, dur);
    return t + dur;
  }

  private select(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const v = this.vis(el);
    t = this.move(a, { x: v.x + v.w * 0.3, y: v.y + v.h * 0.55 }, t);
    t = this.press(a, t);
    this.sel(a, v, t, this.rect(el));
    return t + 0.35;
  }

  /** Once fully revealed, drop the clip so shadows and overhanging labels render as in the static page. */
  private unclip(el: HTMLElement, t: number) {
    this.tl.set(el, { clipPath: "none" }, t);
  }

  private stamp(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    const items = el ? [...el.querySelectorAll<HTMLElement>("[data-build-part='item']")] : [];
    if (!items.length) return t;
    gsap.set(items, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" });
    const center = (it: HTMLElement) => {
      const r = this.rect(it);
      return { x: r.x + r.w * 0.5, y: r.y + r.h * 0.65 };
    };
    // The cursor hops across roughly five stops; items in between pop on the same beat.
    const step = 0.15;
    const every = Math.max(1, Math.ceil(items.length / 5));
    t = this.move(a, center(items[0]), t);
    let prev = 0;
    items.forEach((it, i) => {
      const ti = t + i * step;
      if (i > 0 && i % every === 0) {
        this.dragTo(a, center(it), t + prev * step, (i - prev) * step, "power1.inOut");
        prev = i;
      }
      if (i % every === 0) this.press(a, ti);
      this.tl.to(it, { autoAlpha: 1, scale: 1, duration: 0.28, ease: "back.out(2.2)" }, ti);
    });
    return t + items.length * step + 0.2;
  }

  private highlight(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    const hl = div("sw-hl", this.overlay);
    hl.style.background = `color-mix(in srgb, ${a.spec.color} 32%, transparent)`;
    gsap.set(hl, { x: r.x, y: r.y, width: 0, height: r.h, autoAlpha: 0 });
    t = this.move(a, { x: r.x, y: r.y + r.h * 0.55 }, t);
    t = this.press(a, t);
    const dur = clamp(0.45, 0.95, r.w / 900);
    this.tl.set(hl, { autoAlpha: 1 }, t);
    this.tl.to(hl, { width: r.w, duration: dur, ease: "power1.inOut" }, t);
    this.dragTo(a, { x: r.x + r.w, y: r.y + r.h * 0.55 }, t, dur, "power1.inOut");
    this.tl.to(hl, { autoAlpha: 0, duration: 0.3 }, t + dur + 0.5);
    return t + dur;
  }

  private import(a: Agent, target: string, t: number, from: Pt, guides: Guide[] = []): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    gsap.set(el, { autoAlpha: 0, x: from.x, y: from.y });
    const grab = { x: r.x + from.x + r.w * 0.5, y: r.y + from.y + r.h * 0.5 };
    t = this.move(a, grab, t);
    t = this.press(a, t);
    this.tl.to(el, { autoAlpha: 1, duration: 0.15, ease: "none" }, t);
    const sel = this.sel(a, { x: r.x + from.x, y: r.y + from.y, w: r.w, h: r.h }, t, r);
    const dur = 0.75;
    this.tl.to(el, { x: 0, y: 0, duration: dur, ease: "power3.inOut" }, t);
    this.tl.to(sel.el, { x: r.x, y: r.y, duration: dur, ease: "power3.inOut" }, t);
    this.dragTo(a, { x: grab.x - from.x, y: grab.y - from.y }, t, dur, "power3.inOut");
    this.guides(el, guides, t + dur * 0.6, t + dur + 0.35);
    sel.r = r;
    return t + dur;
  }

  private comment(a: Agent, target: string, text: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    const p = { x: r.x + r.w * 0.82, y: r.y + Math.min(r.h * 0.2, 24) };
    t = this.move(a, p, t);
    t = this.press(a, t);
    const pin = div("sw-pin", this.overlay, a.spec.label[0]);
    pin.style.background = a.spec.color;
    const note = div("sw-note", this.overlay, `<b>${a.spec.label}</b>${text}`);
    note.style.setProperty("--c", a.spec.color);
    gsap.set(pin, { x: p.x - 12, y: p.y - 30, scale: 0, autoAlpha: 0, transformOrigin: "0% 100%" });
    // Open the note to the left of the pin when it would run off the right edge.
    const flip = p.x + 18 + note.offsetWidth > this.size.w - 16;
    const nx = flip ? p.x - 20 - note.offsetWidth : p.x + 18;
    gsap.set(note, { x: nx, y: p.y - 34, autoAlpha: 0 });
    this.tl.to(pin, { scale: 1, autoAlpha: 1, duration: 0.25, ease: "back.out(2)" }, t);
    this.tl.fromTo(note, { autoAlpha: 0, x: nx + (flip ? 8 : -8) }, { autoAlpha: 1, x: nx, duration: 0.25, ease: "power2.out", immediateRender: false }, t + 0.1);
    // The note collapses after a read; the pin stays until the swarm leaves.
    this.tl.to(note, { autoAlpha: 0, duration: 0.2 }, t + 1.6);
    this.chrome.push(pin);
    this.dragTo(a, { x: p.x + 26, y: p.y + 30 }, t + 0.3, 0.4, "power2.out");
    return t + 0.7;
  }

  /** Figma-style cursor chat: rides along with the cursor for the length of a step. */
  private say(a: Agent, text: string, from: number, to: number) {
    const bubble = div("sw-say", a.inner, text);
    bubble.style.background = a.spec.color;
    gsap.set(bubble, { autoAlpha: 0 });
    this.tl.set(bubble, { autoAlpha: 1 }, from);
    this.tl.set(bubble, { autoAlpha: 0 }, to + 0.25);
  }

  private deselect(a: Agent, t: number): number {
    if (!a.sel) return t;
    this.tl.set(a.sel.el, { autoAlpha: 0 }, t);
    a.sel = undefined;
    return t + 0.05;
  }

  // ---------------------------------------------------------------- swarm-wide

  private exit(t: number): number {
    let end = t;
    [...this.agents.values()].forEach((a, i) => {
      if (a.sel) this.tl.set(a.sel.el, { autoAlpha: 0 }, t);
      end = Math.max(end, this.move(a, this.frac(a.spec.exit), t + i * 0.07, "power2.in"));
    });
    if (this.chrome.length) this.tl.to(this.chrome, { autoAlpha: 0, duration: 0.4, ease: "none" }, t + 0.1);
    return Math.max(end, t + 0.5);
  }

  private publish(t: number): number {
    const p = this.publishChip;
    if (!p) return t;
    const r = this.rects.get(p.chip)!;
    const center = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
    const list = [...this.agents.values()];
    // Everyone gathers round the button; the last cursor in the list clicks it.
    let gathered = t;
    // Everyone but the clicker lines up in two rows under the toast, right-aligned to the button.
    const crew = list.slice(0, -1);
    const cols = Math.ceil(crew.length / 2);
    crew.forEach((a, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const spot = { x: r.x + r.w - 60 - (cols - 1 - col) * 88 + row * 44, y: r.y + r.h + 64 + row * 46 };
      gathered = Math.max(gathered, this.move(a, spot, t + i * 0.05));
    });
    this.tl.to(p.chip, { autoAlpha: 1, duration: 0.2 }, t);
    const clicker = list[list.length - 1];
    let c = this.move(clicker, { x: center.x + 6, y: center.y + 4 }, gathered + 0.1);
    c = this.press(clicker, c);
    this.tl.to(p.done, { autoAlpha: 1, duration: 0.15 }, c);
    this.tl.fromTo(p.toast, { autoAlpha: 0, y: r.y + r.h + 18 }, { autoAlpha: 1, y: r.y + r.h + 10, duration: 0.35, ease: "power3.out", immediateRender: false }, c + 0.05);
    return c + 0.9;
  }

  // ---------------------------------------------------------------- overlay pieces

  private cursor(spec: CursorSpec, i: number): Agent {
    const el = div("sw-cursor", this.overlay);
    const inner = div("sw-inner", el);
    inner.innerHTML = `<svg width="18" height="20" viewBox="0 0 18 20"><path d="M1.2 1.2v15.2l4.1-3.9 2.8 6.3 2.7-1.2-2.7-6.2 5.9-.2z" fill="${spec.color}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg><span class="sw-tag" style="background:${spec.color}">${spec.label}</span>`;
    const ring = div("sw-ring", inner);
    ring.style.borderColor = spec.color;
    gsap.set(ring, { autoAlpha: 0 });
    const svg = inner.querySelector("svg")!;
    gsap.set(svg, { transformOrigin: "1px 1px" });
    const pos = this.frac(this.scene.start?.[spec.id] ?? spec.exit);
    gsap.set(el, { x: pos.x, y: pos.y });
    return { spec, el, inner, svg, ring, pos, home: pos, t: 0, side: i % 2 ? -1 : 1 };
  }

  private sel(a: Agent, from: Rect, t: number, final: Rect): Sel {
    const el = div("sw-sel", this.overlay, `<i></i><i></i><i></i><i></i><span>${dims(final)}</span>`);
    el.style.setProperty("--c", a.spec.color);
    gsap.set(el, { x: from.x, y: from.y, width: from.w, height: from.h, autoAlpha: 0 });
    if (a.sel) this.tl.set(a.sel.el, { autoAlpha: 0 }, t);
    this.tl.set(el, { autoAlpha: 1 }, t);
    a.sel = { el, r: from };
    return a.sel;
  }

  private guides(el: HTMLElement, guides: Guide[], on: number, off: number) {
    const r = this.rect(el);
    for (const g of guides) {
      const other = this.el(g.with);
      if (!other) continue;
      const o = this.rect(other);
      const line = div("sw-guide", this.overlay);
      if (g.edge === "left") {
        const y0 = Math.min(r.y, o.y) - 16;
        gsap.set(line, { x: r.x, y: y0, width: 1, height: Math.max(r.y + r.h, o.y + o.h) + 16 - y0, autoAlpha: 0 });
      } else {
        const x0 = Math.min(r.x, o.x) - 16;
        gsap.set(line, { x: x0, y: r.y, height: 1, width: Math.max(r.x + r.w, o.x + o.w) + 16 - x0, autoAlpha: 0 });
      }
      this.tl.set(line, { autoAlpha: 1 }, on);
      this.tl.set(line, { autoAlpha: 0 }, off);
    }
  }

  private editorChrome() {
    const { w, h } = this.size;
    const content = this.root.querySelector("[data-swarm-frame]");
    let frameBottom = 0;
    if (content) {
      const r = this.measure(content);
      const pad = 22;
      const frame = div("sw-frame", this.overlay, `<span>Home — ${this.mode === "desktop" ? "Desktop" : "Tablet"} ${Math.round(innerWidth)}</span>`);
      gsap.set(frame, { x: r.x - pad, y: r.y - pad, width: r.w + pad * 2, height: r.h + pad * 2 });
      frameBottom = r.y + r.h + pad;
      this.chrome.push(frame);
    }

    const bar = div("sw-toolbar", this.overlay);
    (Object.keys(ICONS) as Tool[]).forEach((tool) => {
      const b = document.createElement("b");
      b.innerHTML = svgIcon(ICONS[tool]);
      bar.appendChild(b);
      this.tools.set(tool, b);
    });
    // Sit below the artboard when there is room; on short viewports hug the bottom edge.
    const barH = bar.offsetHeight;
    const barY = Math.min(h - barH - 12, Math.max(frameBottom + 12, h - barH - 26));
    gsap.set(bar, { x: (w - bar.offsetWidth) / 2, y: barY });
    this.tools.forEach((b) => this.rects.set(b, this.measure(b)));
    gsap.set(this.tools.get("move")!, { backgroundColor: "rgba(255,255,255,0.08)", color: "#EDEDEF" });
    this.chrome.push(bar);

    const hint = div("sw-hint", this.overlay, "<span>Scroll to build</span><i><b></b></i>");
    gsap.set(hint, { x: w - hint.offsetWidth - 32, y: barY + (barH - hint.offsetHeight) / 2 });
    this.progressBar = hint.querySelector("b")!;

    // Stage 1 cue under the gathered swarm; the first scroll fades it.
    this.cue = div("sw-hint sw-cue", this.overlay, "<span>Scroll — the page builds itself</span><span aria-hidden>↓</span>");
    gsap.set(this.cue, { x: (w - this.cue.offsetWidth) / 2, y: h * 0.74 });
    this.chrome.push(hint);
  }

  private publishChrome() {
    const page = this.root.querySelector(".page");
    const kicker = this.el("contact.kicker");
    if (!page || !kicker) return;
    const pr = this.measure(page);
    const kr = this.rect(kicker);
    const chip = div("sw-chip", this.overlay, '<span>Publish</span><span class="sw-chip-done">✓ Published</span>');
    const toast = div("sw-toast", this.overlay, "Portfolio is live · abdulmalikmuzakir.my.id");
    const x = pr.x + pr.w - 32 - chip.offsetWidth;
    gsap.set(chip, { x, y: kr.y - 10, autoAlpha: 0 });
    gsap.set(toast, { x: pr.x + pr.w - 32 - toast.offsetWidth, autoAlpha: 0 });
    this.rects.set(chip, this.measure(chip));
    const done = chip.querySelector<HTMLElement>(".sw-chip-done")!;
    gsap.set(done, { autoAlpha: 0 });
    this.publishChip = { chip, done, toast };
  }

  // ---------------------------------------------------------------- geometry

  private who(id: string) {
    return this.alias[id] ?? id;
  }
  private frac(p: Pt): Pt {
    return { x: p.x * this.base.width, y: p.y * this.base.height };
  }
  private measure(el: Element): Rect {
    const r = el.getBoundingClientRect();
    return { x: r.left - this.base.left, y: r.top - this.base.top, w: r.width, h: r.height };
  }
  private el(id: string) {
    return this.root.querySelector<HTMLElement>(`[data-build="${id}"]`);
  }
  /** Layout rect captured before any build state was applied. */
  private rect(el: Element): Rect {
    return this.rects.get(el) ?? this.measure(el);
  }
  /** Where the element currently appears, given the transforms this director applied. */
  private vis(el: Element): Rect {
    const r = this.rect(el);
    const x = this.xf.get(el);
    return x ? { x: r.x + x.dx, y: r.y + x.dy, w: r.w * x.s, h: r.h * x.s } : r;
  }
}
