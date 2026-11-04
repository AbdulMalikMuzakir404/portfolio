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
    // Steps may target elements outside the root (the hero builds the fixed header): measure those
    // and their parts now too, before any build state is applied.
    for (const step of scene.steps) {
      const el = "target" in step ? this.el(step.target) : null;
      if (!el || root.contains(el)) continue;
      // shortcut: assumes a fixed element (the header) belongs to a scene pinned at the top of the
      // screen (the hero), so its viewport y is its y in the scene; fine while only the hero does this.
      [el, ...el.querySelectorAll("[data-build-part], [data-ch]")].forEach((n) => {
        this.rects.set(n, { ...this.measure(n), y: n.getBoundingClientRect().top });
      });
    }

    // The hero also builds the fixed header, so its layer is fixed to the screen above it (the pinned
    // hero is its own stacking context and could never draw over the header from inside).
    const editor = scene.chrome === "editor";
    this.overlay = div("sw-overlay", editor ? document.body : root);
    if (editor) {
      const { left, width, height } = this.base;
      Object.assign(this.overlay.style, { position: "fixed", inset: `0 auto auto ${left}px`, width: `${width}px`, height: `${height}px`, zIndex: "60" });
    }
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
      const e = this.exitPt(a.spec);
      return { x: e.x - a.home.x, y: e.y - a.home.y };
    });
  }

  build() {
    for (const s of this.scene.steps) {
      const after = s.after ? (this.ends.get(s.after) ?? 0) : 0;
      if (s.who === "*") {
        const t0 = Math.max(after, s.at ?? 0, ...[...this.agents.values()].map((a) => a.t)) + 0.15;
        const end = s.do === "publish" ? this.publish(t0) : s.do === "orbit" ? this.orbit(t0, s.center) : this.exit(t0);
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
      // Never rewind a clock: a thread can book this agent for a reply later than the step's end.
      a.t = Math.max(a.t, end);
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
      case "reveal":
        return this.reveal(a, s.target, t);
      case "paint":
        return this.paint(a, s.target, t);
      case "marquee":
        return this.marquee(a, s.target, t);
      case "align":
        return this.align(a, s.target, t);
      case "write":
        return this.write(a, s.target, t);
      case "thread":
        return this.thread(a, s.target, s.messages, t);
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

    // Text at the very left edge of a scene: keep the pointer inside it so it isn't clipped.
    t = this.move(a, { x: Math.max(r.x - 2, 4), y: r.y + r.h * 0.6 }, t);
    t = this.press(a, t);
    // The pointer steps aside so the words stay readable while they're typed.
    this.dragTo(a, { x: Math.max(r.x - 22, 4), y: r.y + r.h + 18 }, t, 0.35, "power2.out");
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
    for (const g of guides) {
      const other = this.el(g.with);
      if (other) this.redline(this.rect(other), this.rect(el), t + dur * 0.75, t + dur + 0.5);
    }
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
    this.redline(rs, rd, t + dur * 0.7, t + dur + 0.5);
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
    this.hover(r, t - 0.15, t + 0.3);
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
    this.hover(v, t - 0.15, t + 0.05);
    t = this.press(a, t);
    this.sel(a, v, t, this.rect(el));
    return t + 0.35;
  }

  /** Figma's hover state: a thin outline appears as the cursor arrives, before the click. */
  private hover(r: Rect, from: number, to: number) {
    const el = div("sw-hover", this.overlay);
    gsap.set(el, { x: r.x - 2, y: r.y - 2, width: r.w + 4, height: r.h + 4, autoAlpha: 0 });
    this.tl.set(el, { autoAlpha: 1 }, Math.max(0, from));
    this.tl.set(el, { autoAlpha: 0 }, to);
  }

  /** Red spacing marker between two boxes, labelled with the gap in px, like Figma's Alt-measure. */
  private redline(a: Rect, b: Rect, on: number, off: number) {
    const line = div("sw-redline", this.overlay, "<span></span>");
    let gap: number;
    if (b.x >= a.x + a.w - 1 || a.x >= b.x + b.w - 1) {
      const [l, r] = b.x >= a.x ? [a, b] : [b, a];
      gap = r.x - (l.x + l.w);
      const top = Math.max(l.y, r.y);
      const bottom = Math.min(l.y + l.h, r.y + r.h);
      const y = bottom > top ? (top + bottom) / 2 : l.y + l.h / 2;
      gsap.set(line, { x: l.x + l.w, y, width: Math.max(gap, 1), height: 1 });
    } else {
      const [t, u] = b.y >= a.y ? [a, b] : [b, a];
      gap = u.y - (t.y + t.h);
      const left = Math.max(t.x, u.x);
      const right = Math.min(t.x + t.w, u.x + u.w);
      const x = right > left ? left + Math.min(40, (right - left) / 2) : t.x + 20;
      gsap.set(line, { x, y: t.y + t.h, width: 1, height: Math.max(gap, 1) });
      line.classList.add("sw-redline-v");
    }
    if (gap < 4) return line.remove();
    line.querySelector("span")!.textContent = String(Math.round(gap));
    gsap.set(line, { autoAlpha: 0 });
    this.tl.set(line, { autoAlpha: 1 }, on);
    this.tl.set(line, { autoAlpha: 0 }, off);
  }

  private reveal(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    gsap.set(el, { autoAlpha: 0, y: 12 });
    t = this.move(a, { x: r.x + Math.min(28, r.w * 0.2), y: r.y + r.h * 0.6 }, t);
    this.hover(r, t - 0.15, t + 0.2);
    t = this.press(a, t);
    this.tl.to(el, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, t);
    return t + 0.4;
  }

  /** Colour-swatch popover; the last swatch is the element's real colour, which gets applied. */
  private paint(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    const final = getComputedStyle(el).color;
    gsap.set(el, { color: "#EDEDEF" });
    t = this.move(a, { x: r.x + r.w * 0.5, y: r.y + r.h * 0.55 }, t);
    this.hover(r, t - 0.15, t + 0.2);
    t = this.press(a, t);
    const swatches = ["#EDEDEF", "#60A5FA", "#F472B6", "#F5B93E", final];
    const pop = div("sw-swatches", this.overlay, swatches.map((c) => `<i style="background:${c}"></i>`).join(""));
    const px = clamp(8, this.size.w - pop.offsetWidth - 8, r.x + r.w + 14);
    const py = clamp(8, this.size.h - pop.offsetHeight - 8, r.y + r.h * 0.5 - pop.offsetHeight / 2);
    gsap.set(pop, { x: px, y: py, autoAlpha: 0 });
    this.tl.to(pop, { autoAlpha: 1, duration: 0.15 }, t);
    const dot = pop.children[swatches.length - 1] as HTMLElement;
    let u = this.move(a, { x: px + dot.offsetLeft + dot.offsetWidth / 2, y: py + dot.offsetTop + dot.offsetHeight / 2 }, t + 0.15);
    u = this.press(a, u);
    this.tl.to(el, { color: final, duration: 0.3, ease: "none" }, u);
    this.tl.to(pop, { autoAlpha: 0, duration: 0.15 }, u + 0.3);
    return u + 0.4;
  }

  private marquee(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const parts = [...el.querySelectorAll<HTMLElement>("[data-build-part='item']")];
    const items = parts.length ? parts : [el];
    const r = this.rect(el);
    gsap.set(items, { autoAlpha: 0, y: 6 });
    const p0 = { x: r.x - 14, y: r.y - 12 };
    const p1 = { x: r.x + r.w + 14, y: r.y + r.h + 12 };
    t = this.move(a, p0, t);
    t = this.press(a, t);
    const box = div("sw-marquee", this.overlay);
    box.style.setProperty("--c", a.spec.color);
    gsap.set(box, { x: p0.x, y: p0.y, width: 0, height: 0, autoAlpha: 0 });
    this.tl.set(box, { autoAlpha: 1 }, t);
    const dur = clamp(0.6, 1.2, 0.4 + r.w / 1400);
    this.dragTo(a, p1, t, dur, "none");
    this.tl.to(box, { width: p1.x - p0.x, height: p1.y - p0.y, duration: dur, ease: "none" }, t);
    // Each item appears as the box's edge sweeps past its centre.
    items.forEach((it) => {
      const ir = this.rect(it);
      const f = clamp(0, 1, (ir.x + ir.w / 2 - p0.x) / (p1.x - p0.x));
      this.tl.to(it, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, t + dur * f);
    });
    this.tl.to(box, { autoAlpha: 0, duration: 0.2 }, t + dur + 0.1);
    return t + dur + 0.25;
  }

  private align(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const parts = [...el.querySelectorAll<HTMLElement>("[data-build-part='item']")];
    if (!parts.length) return t;
    const r = this.rect(el);
    // Deterministic "messy" starting layout.
    parts.forEach((it, i) =>
      gsap.set(it, { x: (((i * 37) % 23) - 11) * 2, y: (((i * 53) % 19) - 9) * 2.4, rotation: (((i * 29) % 11) - 5) * 1.6, opacity: 0.45 }),
    );
    t = this.move(a, { x: r.x + r.w * 0.5, y: r.y + r.h * 0.5 }, t);
    this.hover(r, t - 0.15, t + 0.05);
    t = this.press(a, t);
    this.sel(a, { x: r.x - 6, y: r.y - 6, w: r.w + 12, h: r.h + 12 }, t, r);
    const icons = [
      '<path d="M4 3v14M7 6h9M7 14h6"/>',
      '<path d="M10 3v14M5 6h10M6 14h8"/>',
      '<path d="M4 10h12M7 5v10M13 7v6"/>',
      '<path d="M16 3v14M4 6h9M7 14h6"/>',
    ];
    const bar = div("sw-alignbar", this.overlay, icons.map((d) => `<b>${svgIcon(d)}</b>`).join(""));
    const bx = clamp(8, this.size.w - bar.offsetWidth - 8, r.x + r.w / 2 - bar.offsetWidth / 2);
    const by = r.y - bar.offsetHeight - 16 >= 8 ? r.y - bar.offsetHeight - 16 : r.y + r.h + 16;
    gsap.set(bar, { x: bx, y: by, autoAlpha: 0 });
    this.tl.to(bar, { autoAlpha: 1, duration: 0.15 }, t);
    const btn = bar.children[1] as HTMLElement;
    let u = this.move(a, { x: bx + btn.offsetLeft + btn.offsetWidth / 2, y: by + btn.offsetTop + btn.offsetHeight / 2 }, t + 0.2);
    u = this.press(a, u);
    this.tl.to(parts, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(1.6)", stagger: 0.04 }, u);
    this.tl.to(bar, { autoAlpha: 0, duration: 0.15 }, u + 0.35);
    return u + 0.5 + parts.length * 0.04;
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
    this.hover(this.rect(el!), t - 0.15, t + items.length * step + 0.2);
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
    this.hover(r, t - 0.15, t + 0.05);
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
    for (const g of guides) {
      const other = this.el(g.with);
      if (other) this.redline(this.rect(other), r, t + dur * 0.7, t + dur + 0.5);
    }
    sel.r = r;
    return t + dur;
  }

  private write(a: Agent, target: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 24;
    const n = Math.max(1, Math.round(r.h / lh));
    gsap.set(el, { clipPath: "inset(0% 0% 100% 0%)" });
    t = this.move(a, { x: r.x - 6, y: r.y + lh * 0.6 }, t);
    t = this.press(a, t);
    const dur = n * 0.2;
    this.tl.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: `steps(${n})` }, t);
    this.dragTo(a, { x: r.x - 6, y: r.y + r.h - lh * 0.4 }, t, dur, "none");
    this.unclip(el, t + dur);
    return t + dur;
  }

  /**
   * Figma-style comment thread. The opener pins it and posts; each reply's author flies over on
   * their own clock, clicks, and their message appears. The opener is free again almost at once.
   */
  private thread(a: Agent, target: string, messages: { who: string; text: string }[], t: number): number {
    const el = this.el(target);
    if (!el || !messages.length) return t;
    const r = this.rect(el);
    const spec = (id: string) => this.agents.get(this.who(id))?.spec ?? a.spec;
    const box = div(
      "sw-thread",
      this.overlay,
      messages
        .map((m) => `<div class="sw-msg"><b style="color:${spec(m.who).color}">${spec(m.who).label}</b><span>${m.text}</span><i>• • •</i></div>`)
        .join(""),
    );
    const rows = [...box.children] as HTMLElement[];
    const texts = rows.map((row) => row.querySelector("span")!);
    const dots = rows.map((row) => row.querySelector("i")!);
    gsap.set(dots, { autoAlpha: 0 });
    const spot = this.placeNote(r, box.offsetWidth, box.offsetHeight);
    const p = spot.pin;
    const bx = spot.x;
    const by = spot.y;
    t = this.move(a, p, t);
    this.hover(r, t - 0.15, t + 0.2);
    t = this.press(a, t);
    const pin = div("sw-pin", this.overlay, a.spec.label[0]);
    pin.style.background = a.spec.color;
    // Measure where each line will sit once shown, then collapse the replies so the box grows
    // as they arrive instead of opening at full height.
    const lineY = rows.map((row) => by + row.offsetTop + row.offsetHeight / 2);
    const boxW = box.offsetWidth;
    gsap.set(box, { width: boxW });
    gsap.set(rows.slice(1), { display: "none" });
    gsap.set(pin, { x: p.x - 12, y: p.y - 30, scale: 0, autoAlpha: 0, transformOrigin: "0% 100%" });
    gsap.set(box, { x: bx, y: by, autoAlpha: 0 });
    gsap.set(rows, { autoAlpha: 0, y: 6 });

    this.tl.to(pin, { scale: 1, autoAlpha: 1, duration: 0.25, ease: "back.out(2)" }, t);
    this.tl.set(box, { autoAlpha: 1 }, t + 0.1);
    this.tl.to(rows[0], { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, t + 0.1);
    this.dragTo(a, spot.away, t + 0.3, 0.4, "power2.out");

    let next = t + 0.6;
    messages.slice(1).forEach((m, k) => {
      const row = rows[k + 1];
      const b = this.agents.get(this.who(m.who));
      if (b) {
        // Replies land beside their own line in the thread.
        // Reply beside its own line, on whichever side of the box leaves room for the name tag.
        const roomRight = bx + boxW + 14 + 100 <= this.size.w;
        const replyAt = { x: roomRight ? bx + boxW + 14 : bx - 110, y: lineY[k + 1] };
        const go = Math.max(b.t, next - 0.6, b === a ? next : 0);
        const at = this.press(b, this.move(b, replyAt, go));
        b.t = at + 0.3;
        next = at;
      }
      // "is typing…" for a beat, then the message lands.
      this.tl.set(row, { display: "grid" }, next - 0.45);
      this.tl.set(texts[k + 1], { autoAlpha: 0 }, next - 0.45);
      this.tl.set(dots[k + 1], { autoAlpha: 1 }, next - 0.45);
      this.tl.to(row, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" }, next - 0.45);
      this.tl.set(dots[k + 1], { autoAlpha: 0 }, next);
      this.tl.set(texts[k + 1], { autoAlpha: 1 }, next);
      next += 0.55;
    });
    // Leave the finished thread up long enough to read before it collapses to its pin.
    this.tl.to(box, { autoAlpha: 0, duration: 0.25 }, next + 2.2);
    this.chrome.push(pin);
    return t + 0.7;
  }

  /**
   * Where a comment box goes: beside the target on the right, else above, left, or below, taking
   * the first spot that fits in the scene without covering the target itself.
   */
  private placeNote(r: Rect, w: number, h: number) {
    const W = this.size.w;
    const H = this.size.h;
    const alignRight = clamp(8, W - w - 8, r.x + r.w - w);
    // Side spots may slide vertically to fit inside short rows.
    const sideY = clamp(8, Math.max(8, H - h - 8), r.y - 8);
    const spots = [
      { side: "right", x: r.x + r.w + 16, y: sideY },
      { side: "above", x: alignRight, y: r.y - h - 40 },
      { side: "left", x: r.x - w - 16, y: sideY },
      { side: "below", x: alignRight, y: r.y + r.h + 14 },
    ] as const;
    const fits = (q: { x: number; y: number }) => q.x >= 8 && q.x + w <= W - 8 && q.y >= 8 && q.y + h <= H - 8;
    const spot = spots.find(fits) ?? { side: "right" as const, x: clamp(8, W - w - 8, r.x + r.w + 16), y: clamp(8, H - h - 8, r.y - 8) };
    // The pin sits on the target's top-right corner; the author steps away from the box.
    const pin = { x: r.x + r.w - 6, y: r.y + 8 };
    const away =
      spot.side === "left" ? { x: pin.x + 24, y: pin.y + 40 } : spot.side === "below" ? { x: pin.x - 60, y: pin.y - 34 } : { x: pin.x - 44, y: pin.y + 40 };
    return { ...spot, pin, away };
  }

  private comment(a: Agent, target: string, text: string, t: number): number {
    const el = this.el(target);
    if (!el) return t;
    const r = this.rect(el);
    const note = div("sw-note", this.overlay, `<b>${a.spec.label}</b>${text}`);
    note.style.setProperty("--c", a.spec.color);
    const spot = this.placeNote(r, note.offsetWidth, note.offsetHeight);
    const p = spot.pin;
    t = this.move(a, p, t);
    this.hover(r, t - 0.15, t + 0.2);
    t = this.press(a, t);
    const pin = div("sw-pin", this.overlay, a.spec.label[0]);
    pin.style.background = a.spec.color;
    gsap.set(pin, { x: p.x - 12, y: p.y - 30, scale: 0, autoAlpha: 0, transformOrigin: "0% 100%" });
    gsap.set(note, { x: spot.x, y: spot.y, autoAlpha: 0 });
    this.tl.to(pin, { scale: 1, autoAlpha: 1, duration: 0.25, ease: "back.out(2)" }, t);
    this.tl.fromTo(note, { autoAlpha: 0, y: spot.y + 6 }, { autoAlpha: 1, y: spot.y, duration: 0.25, ease: "power2.out", immediateRender: false }, t + 0.1);
    // The note collapses after a read; the pin stays until the swarm leaves.
    this.tl.to(note, { autoAlpha: 0, duration: 0.2 }, t + 2.6);
    this.chrome.push(pin);
    this.dragTo(a, spot.away, t + 0.3, 0.4, "power2.out");
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
    const r = a.sel.r;
    this.tl.set(a.sel.el, { autoAlpha: 0 }, t);
    a.sel = undefined;
    // Click off, then drift just past the bottom-right corner so the finished work stays readable.
    const off = {
      // Keep the whole name tag inside the scene (it hangs ~90px right and ~45px below the tip).
      x: clamp(8, this.size.w - 100, r.x + r.w + 14),
      y: clamp(8, this.size.h - 48, r.y + r.h + 16),
    };
    return this.move(a, off, t + 0.05, "power2.out");
  }

  // ---------------------------------------------------------------- swarm-wide

  private exit(t: number): number {
    let end = t;
    [...this.agents.values()].forEach((a, i) => {
      if (a.sel) this.tl.set(a.sel.el, { autoAlpha: 0 }, t);
      end = Math.max(end, this.move(a, this.exitPt(a.spec), t + i * 0.07, "power2.in"));
    });
    if (this.chrome.length) this.tl.to(this.chrome, { autoAlpha: 0, duration: 0.4, ease: "none" }, t + 0.1);
    return Math.max(end, t + 0.5);
  }

  /**
   * The empty area for the closing orbit: the right-hand column beside the contact heading.
   * Insets leave room for a cursor's name tag (it hangs right and down).
   */
  private freeBox() {
    const p = this.publishChip;
    const title = this.el("contact.title");
    const actions = this.el("contact.actions");
    const socials = this.el("contact.socials");
    if (!p || !title || !actions || !socials) return undefined;
    const chip = this.rects.get(p.chip)!;
    const range = document.createRange();
    range.selectNodeContents(title);
    const textRight = Math.max(0, ...[...range.getClientRects()].map((r) => r.right - this.base.left));
    const ar = this.rect(actions);
    const sr = this.rect(socials);
    // The right-hand column beside the heading: right of its text and of the buttons, below the
    // publish toast, above the social links. On narrow screens it can be smaller than the ring;
    // the ring then keeps its minimum size, centred in what room there is.
    const box = {
      l: Math.max(textRight, ar.x + ar.w) + 24,
      r: chip.x + chip.w - 110,
      t: chip.y + chip.h + 10 + p.toast.offsetHeight + 24,
      b: sr.y - 24,
    };
    return box.r > box.l && box.b > box.t ? box : undefined;
  }

  /** Closing formation: everyone rings a point; the time-based galaxy orbit takes over from there. */
  private orbit(t: number, center: Pt): number {
    const list = [...this.agents.values()];
    let c = this.frac(center);
    // A ring big enough that the name tags don't pile up: ~13px of radius per agent.
    const minRx = Math.max(90, list.length * 13);
    const minRy = minRx * 0.72;
    let rx = Math.max(minRx, Math.min(180, this.size.w * 0.12));
    let ry = rx * 0.8;
    const free = this.freeBox();
    if (free) {
      // Fit the ring into the measured empty area instead of a fixed fraction of the section.
      c = { x: (free.l + free.r) / 2, y: (free.t + free.b) / 2 };
      rx = Math.max(minRx, Math.min(rx, (free.r - free.l) / 2));
      ry = Math.max(minRy, Math.min(rx * 0.8, (free.b - free.t) / 2));
    }
    // Don't let the ring spill left over the heading text when the column is narrower than it.
    if (free) c.x = Math.max(c.x, free.l + rx);
    // Keep the whole ring, name tags included (~100px right, ~45px down), inside the scene.
    c = {
      x: clamp(rx + 16, Math.max(rx + 16, this.size.w - rx - 100), c.x),
      y: clamp(ry + 16, Math.max(ry + 16, this.size.h - ry - 50), c.y),
    };
    let end = t;
    list.forEach((a, i) => {
      if (a.sel) this.tl.set(a.sel.el, { autoAlpha: 0 }, t);
      const ang = (i / list.length) * Math.PI * 2 - Math.PI / 2;
      const k = i % 2 ? 0.72 : 1;
      end = Math.max(end, this.move(a, { x: c.x + Math.cos(ang) * rx * k, y: c.y + Math.sin(ang) * ry * k }, t + i * 0.05));
    });
    if (this.chrome.length) this.tl.to(this.chrome, { autoAlpha: 0, duration: 0.3, ease: "none" }, t);
    return end + 0.2;
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
    inner.innerHTML = `<svg width="22" height="24" viewBox="0 0 18 20"><path d="M1.2 1.2v15.2l4.1-3.9 2.8 6.3 2.7-1.2-2.7-6.2 5.9-.2z" fill="${spec.color}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg><span class="sw-tag" style="background:${spec.color}">${spec.label}</span>`;
    const ring = div("sw-ring", inner);
    ring.style.borderColor = spec.color;
    gsap.set(ring, { autoAlpha: 0 });
    const svg = inner.querySelector("svg")!;
    gsap.set(svg, { transformOrigin: "1px 1px" });
    const start = this.scene.start?.[spec.id];
    const pos = start ? this.frac(start) : this.exitPt(spec);
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

  /**
   * Publish button and toast at the top right, beside the contact heading (Contact holds while it
   * builds, so they stay on screen). Only if they would overlap the heading's actual text — narrow
   * screens where it fills the width — do they move under the action buttons.
   */
  private publishChrome() {
    const page = this.root.querySelector(".page");
    const kicker = this.el("contact.kicker");
    const title = this.el("contact.title");
    if (!page || !kicker || !title) return;
    const pr = this.measure(page);
    const kr = this.rect(kicker);
    const chip = div("sw-chip", this.overlay, '<span>Publish</span><span class="sw-chip-done">✓ Published</span>');
    const toast = div("sw-toast", this.overlay, "Portfolio is live · abdulmalikmuzakir.my.id");
    const right = pr.x + pr.w - 32;
    const blockH = chip.offsetHeight + 10 + toast.offsetHeight;
    const left = right - Math.max(chip.offsetWidth, toast.offsetWidth);
    const lines = (() => {
      const range = document.createRange();
      range.selectNodeContents(title);
      return [...range.getClientRects()].map((r) => ({ top: r.top - this.base.top, bottom: r.bottom - this.base.top, right: r.right - this.base.left }));
    })();
    const clearOfText = (y: number) => lines.filter((l) => l.bottom > y && l.top < y + blockH).every((l) => left > l.right + 16);
    const actions = this.el("contact.actions");
    const under = actions ? this.rect(actions) : kr;
    const y = clearOfText(kr.y - 10) ? kr.y - 10 : under.y + under.h + 28;
    gsap.set(chip, { x: right - chip.offsetWidth, y, autoAlpha: 0 });
    gsap.set(toast, { x: right - toast.offsetWidth, autoAlpha: 0 });
    this.rects.set(chip, this.measure(chip));
    const done = chip.querySelector<HTMLElement>(".sw-chip-done")!;
    gsap.set(done, { autoAlpha: 0 });
    this.publishChip = { chip, done, toast };
  }

  // ---------------------------------------------------------------- geometry

  private who(id: string) {
    return this.alias[id] ?? id;
  }
  /** Off-canvas point for a cursor: its exit fraction, but always at least 60px clear of the scene. */
  private exitPt(spec: CursorSpec): Pt {
    const { w, h } = this.size;
    const e = this.frac(spec.exit);
    const out = (v: number, f: number, size: number) => (f < 0 ? Math.min(v, -60) : f > 1 ? Math.max(v, size + 60) : v);
    return { x: out(e.x, spec.exit.x, w), y: out(e.y, spec.exit.y, h) };
  }
  private frac(p: Pt): Pt {
    return { x: p.x * this.base.width, y: p.y * this.base.height };
  }
  private measure(el: Element): Rect {
    const r = el.getBoundingClientRect();
    return { x: r.left - this.base.left, y: r.top - this.base.top, w: r.width, h: r.height };
  }
  private el(id: string) {
    const sel = `[data-build="${id}"]`;
    const el = this.root.querySelector<HTMLElement>(sel) ?? document.querySelector<HTMLElement>(sel);
    // Hidden at this breakpoint (display: none): treat as absent rather than aiming at (0, 0).
    return el && el.getClientRects().length ? el : null;
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
