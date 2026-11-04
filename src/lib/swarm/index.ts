import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Lenis from "lenis";
import { Director, cursorMarkup } from "./director";
import type { Pt } from "./types";
import { cursors, scenes, tabletAlias } from "./scenes";

type Mode = "desktop" | "tablet";

const SKIP_KEY = "swarm:skipped";

/** Mounts every swarm scene. Returns a disposer that restores the plain, fully built page. */
export function startSwarm(): () => void {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  const html = document.documentElement;
  const mm = gsap.matchMedia();
  let alive = true;
  let hero: ScrollTrigger | undefined;

  const teardown = () => {
    mm.revert();
    html.classList.remove("swarm", "swarm-ready");
    delete html.dataset.swarm;
    dispatchEvent(new CustomEvent("swarm:skipped"));
  };

  const onSkip = () => {
    try {
      sessionStorage.setItem(SKIP_KEY, "1");
    } catch {}
    const inHero = hero ? scrollY < hero.end : true;
    const pinned = hero ? hero.end - hero.start : 0;
    const y = scrollY;
    teardown();
    // Land on the finished hero if the visitor was watching it, otherwise keep their place.
    window.scrollTo({ top: inHero ? 0 : Math.max(0, y - pinned), behavior: "instant" });
  };
  addEventListener("swarm:skip", onSkip);

  // A clipped control can still take focus, so keyboard focus on any buildable part ends the build.
  const onFocus = (e: FocusEvent) => {
    const el = e.target as HTMLElement;
    if (!html.classList.contains("swarm-ready") || !el.matches(":focus-visible") || !el.closest("[data-build]")) return;
    try {
      sessionStorage.setItem(SKIP_KEY, "1");
    } catch {}
    teardown();
    // Unpinning re-parents the hero, which drops focus; put it back.
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "center", behavior: "instant" });
  };
  addEventListener("focusin", onFocus);

  document.fonts.ready.then(() => {
    if (!alive) return;
    mm.add(
      {
        desktop: "(min-width: 1024px)",
        tablet: "(min-width: 640px) and (max-width: 1023.98px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { desktop, tablet, motion } = ctx.conditions as Record<string, boolean>;
        if (!motion || !(desktop || tablet)) {
          html.classList.remove("swarm", "swarm-ready");
          return;
        }
        const mode: Mode = desktop ? "desktop" : "tablet";
        // A touch of smoothing and ~15% slower wheel scrolling. Kept light on purpose: a stronger
        // setting (0.7x, lerp 0.07) read as laggy. Keyboard, anchors and focus stay native.
        const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 0.85, anchors: true });
        lenis.on("scroll", ScrollTrigger.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        let built = mount(mode);
        jumpToHash();

        // Coordinates are measured in px, so a width change within a breakpoint needs a rebuild.
        let width = innerWidth;
        let timer = 0;
        const onResize = () => {
          clearTimeout(timer);
          timer = window.setTimeout(() => {
            if (innerWidth === width) return;
            width = innerWidth;
            built.revert();
            clearBuildStyles();
            built = mount(mode);
            ScrollTrigger.refresh();
          }, 250);
        };
        addEventListener("resize", onResize);

        return () => {
          gsap.ticker.remove(raf);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
          clearTimeout(timer);
          removeEventListener("resize", onResize);
          built.revert();
          clearBuildStyles();
          html.classList.remove("swarm-ready");
          // The header is already on screen: don't replay its no-swarm entrance.
          html.classList.add("swarm-off");
          delete html.dataset.swarm;
        };
      },
    );
  });

  function mount(mode: Mode) {
    return gsap.context(() => {
      html.classList.add("swarm");
      const overlays: HTMLElement[] = [];
      const stops: (() => void)[] = [];
      const alias = mode === "tablet" ? tabletAlias : {};
      const runs: Run[] = [];

      for (const scene of scenes) {
        const root = document.querySelector<HTMLElement>(scene.root);
        if (!root) continue;
        const d = new Director(root, scene, cursors, alias, mode);
        overlays.push(d.overlay);
        const tl = d.build();
        const pinSpec = scene.scroll.pin;
        const pin = typeof pinSpec === "object" ? pinSpec[mode] : undefined;

        // The editor scene opens with the galaxy and drives the header's Skip button; a scene that
        // ends in an orbit step resumes the galaxy whenever its timeline sits at the end.
        const editor = scene.chrome === "editor";
        const finale = scene.steps.some((st) => st.do === "orbit");
        const intro = editor ? galaxy(d, "home", true) : undefined;
        const outro = finale ? galaxy(d, "end", false) : undefined;
        intro?.start();
        if (intro) stops.push(intro.stop);
        if (outro) stops.push(outro.stop);
        const sync = (p: number) => {
          if (editor) {
            html.dataset.swarm = p < 0.995 ? "building" : "done";
            // The hero's layer is fixed to the screen: put it away once the hero has scrolled past.
            d.overlay.style.visibility = p < 1 ? "" : "hidden";
            if (p > 0.002) intro?.release();
          }
          if (outro && p > 0.995) outro.start();
          else outro?.release();
        };

        const start = scene.scroll.start;
        let end: string | (() => string) = pin ? () => `+=${innerHeight * pin}` : scene.scroll.end;
        if (pinSpec === "fit") {
          // Hold so the built parts are framed below the header, for ~15% of a screen per timeline unit.
          const vh = innerHeight;
          const base = root.getBoundingClientRect().top;
          const boxes = [...root.querySelectorAll("[data-build]")].map((e) => e.getBoundingClientRect());
          const top = Math.min(...boxes.map((r) => r.top)) - base;
          const bottom = Math.max(...boxes.map((r) => r.bottom)) - base;
          let offset = gsap.utils.clamp(0, Math.max(0, root.offsetHeight - vh), top - Math.max(96, (vh - (bottom - top)) / 2));
          // When the section plus the footer is shorter than the screen, the page can't scroll far
          // enough to bring the section's top to the top of the screen: hold it lower instead, so the
          // footer meets the bottom edge exactly as the hold ends and the last beat is reachable.
          const tail = root.offsetHeight + (document.querySelector("footer")?.offsetHeight ?? 0) - vh;
          offset = Math.min(offset, tail);
          // The hold is its own trigger; the build starts earlier, as the section comes into view,
          // and runs on through the hold so it is already under way when the section arrives.
          const hold = ScrollTrigger.create({
            trigger: root,
            start: offset >= 0 ? `top+=${Math.round(offset)} top` : `top ${Math.round(-offset)}px`,
            end: `+=${Math.round(gsap.utils.clamp(vh * 0.8, vh * 2.2, tl.duration() * vh * 0.15))}`,
            pin: true,
            anticipatePin: 1,
          });
          end = () => `${hold.end}`;
        }

        const st = ScrollTrigger.create({
          trigger: scene.scroll.trigger ? (root.querySelector(scene.scroll.trigger) ?? root) : root,
          start,
          end,
          pin: !!pin,
          anticipatePin: pin ? 1 : 0,
          scrub: 0.4,
          animation: tl,
          onUpdate: editor || finale ? (self) => sync(self.progress) : undefined,
        });
        runs.push({ d, st, tl });
        if (editor) hero = st;
        if (editor || finale) sync(st.progress);
      }

      stops.push(travel(runs));
      html.classList.add("swarm-ready");
      return () => {
        stops.forEach((stop) => stop());
        overlays.forEach((o) => o.remove());
      };
    });
  }

  return () => {
    alive = false;
    removeEventListener("swarm:skip", onSkip);
    removeEventListener("focusin", onFocus);
    teardown();
  };
}

/**
 * Time-based galaxy orbit, used for the opening (Stage 1) and the closing scene. Agents circle the
 * ring they are standing on (inner ones faster) and the whole system leans toward the visitor's
 * pointer, each agent with its own lag. It only moves the `.sw-inner` wrappers, so the scroll
 * timeline on the outer element is untouched; `release` eases every offset back to zero.
 *
 * `anchor` picks the ring: "home" is where cursors sit at progress 0 (the opening), "end" is where
 * the timeline leaves them (the closing orbit). `enter` flies them in from their exit points first.
 */
function galaxy(d: Director, anchor: "home" | "end", enter: boolean) {
  const agents = [...d.agents.values()];
  const inners = agents.map((a) => a.inner);
  const pts = agents.map((a) => (anchor === "home" ? a.home : a.pos));
  const entry = d.enterOffsets();
  const { w, h } = d.size;
  const cx = pts.reduce((n, p) => n + p.x, 0) / pts.length;
  const cy = pts.reduce((n, p) => n + p.y, 0) / pts.length;
  // Orbits keep each agent's own ring radius; the ellipse squash matches the gathering ring.
  const squash = 0.8;
  const orbits = pts.map((p) => {
    const dx = p.x - cx;
    const dy = (p.y - cy) / squash;
    return { r: Math.hypot(dx, dy), a0: Math.atan2(dy, dx) };
  });
  const rMax = Math.max(...orbits.map((o) => o.r), 1);
  const setX = inners.map((el) => gsap.quickSetter(el, "x", "px"));
  const setY = inners.map((el) => gsap.quickSetter(el, "y", "px"));
  const aim = { x: 0, y: 0 };
  const clamp = gsap.utils.clamp;
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const r = d.root.getBoundingClientRect();
    aim.x = clamp(-w * 0.32, w * 0.32, (e.clientX - r.left - cx) * 0.65);
    aim.y = clamp(-h * 0.28, h * 0.28, (e.clientY - r.top - cy) * 0.65);
  };
  const onLeave = () => ((aim.x = 0), (aim.y = 0));

  let sim: { x: number; y: number; k: number; w: number }[] = [];
  let born = 0;
  let running = false;
  const tick = (time: number) => {
    const dr = gsap.ticker.deltaRatio();
    sim.forEach((s, i) => {
      if (enter && time - born < i * 0.08) return; // staggered entrance
      const { r, a0 } = orbits[i];
      const ang = a0 + s.w * (time - born);
      // Target is the orbit point minus the agent's own anchor (offsets are relative to it).
      const tx = aim.x + cx + Math.cos(ang) * r - pts[i].x;
      const ty = aim.y + cy + Math.sin(ang) * r * squash - pts[i].y;
      const f = 1 - Math.pow(1 - s.k, dr); // frame-rate independent easing
      s.x += (tx - s.x) * f;
      s.y += (ty - s.y) * f;
      setX[i](s.x);
      setY[i](s.y);
    });
  };
  const stop = () => {
    if (!running) return;
    running = false;
    gsap.ticker.remove(tick);
    d.root.removeEventListener("pointermove", onMove);
    d.root.removeEventListener("pointerleave", onLeave);
  };
  return {
    start() {
      if (running) return;
      running = true;
      gsap.killTweensOf(inners);
      born = gsap.ticker.time;
      sim = agents.map((_, i) => ({
        x: enter ? entry[i].x : +gsap.getProperty(inners[i], "x"),
        y: enter ? entry[i].y : +gsap.getProperty(inners[i], "y"),
        k: 0.03 + ((i * 7) % 10) * 0.0045,
        // Kepler-ish: angular speed falls off with radius, so the inner ring overtakes the outer one.
        w: 0.3 * Math.pow(rMax / Math.max(orbits[i].r, 1), 1.5),
      }));
      sim.forEach((s, i) => (setX[i](s.x), setY[i](s.y)));
      gsap.ticker.add(tick);
      d.root.addEventListener("pointermove", onMove);
      d.root.addEventListener("pointerleave", onLeave);
    },
    stop,
    release() {
      if (!running) return;
      stop();
      gsap.to(inners, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    },
  };
}

/**
 * Reverting a context mid-build can restore an element to the state the build set first (e.g. a
 * typed letter at opacity 0), not to what the page had. Wipe every inline style the build touched.
 */
function clearBuildStyles() {
  gsap.set(document.querySelectorAll("[data-build], [data-build-part], [data-ch]"), { clearProps: "opacity,visibility,transform,clipPath,color" });
}

type Run = { d: Director; st: ScrollTrigger; tl: gsap.core.Timeline };

/**
 * Agents never vanish between sections. A scene shows its own copy of an agent only while the agent
 * works there (from arriving at its first task until the scene's exit). Whenever an agent leaves one
 * copy, a shared traveller takes over exactly where that copy was and flies (spring-eased) to where
 * the agent works next, or back where it came from when scrolling up, and waits there; it hands back
 * to the next copy once it's on top of it. No hand-off ever jumps.
 */
function travel(runs: Run[]) {
  const layer = document.createElement("div");
  layer.className = "sw-travel";
  layer.setAttribute("aria-hidden", "true");
  layer.inert = true;
  document.body.append(layer);

  const ids = [...new Set(runs.flatMap((r) => [...r.d.agents.keys()]))];
  const lanes = ids.map((id) => {
    const all = runs.flatMap((r) => {
      const a = r.d.agents.get(id);
      return a ? [{ ...r, a }] : [];
    });
    all.forEach((s) => (s.a.el.style.visibility = "hidden"));
    const segs = all.flatMap((s) => (s.a.first !== undefined && s.a.first < s.a.last ? [{ ...s, first: s.a.first }] : []));
    const el = document.createElement("div");
    el.className = "sw-cursor";
    el.innerHTML = `<div class="sw-inner">${cursorMarkup(all[0].a.spec)}</div>`;
    el.style.visibility = "hidden";
    layer.append(el);
    return { segs, el, shown: null as (typeof segs)[number] | null, pos: null as Pt | null, vel: { x: 0, y: 0 } };
  });
  type Seg = (typeof lanes)[number]["segs"][number];

  // Where the arrow sits inside a cursor element, so a traveller can be laid exactly over a scene copy.
  const svg0 = lanes[0]?.el.querySelector("svg")?.getBoundingClientRect();
  const off = { x: svg0?.left ?? 0, y: svg0?.top ?? 0 };
  const where = (s: Seg) => {
    const r = s.a.svg.getBoundingClientRect();
    return { x: r.left - off.x, y: r.top - off.y };
  };
  const live = (s: Seg) => s.tl.time() >= s.first && s.tl.time() < s.a.last;
  const onScreen = (b: DOMRect, p: Pt) => ({
    x: gsap.utils.clamp(8, innerWidth - 24, b.left + p.x),
    y: gsap.utils.clamp(8, innerHeight - 24, b.top + p.y),
  });
  const show = (lane: (typeof lanes)[number], seg: Seg | null) => {
    if (lane.shown) lane.shown.a.el.style.visibility = "hidden";
    if (seg) seg.a.el.style.visibility = "";
    lane.shown = seg;
    lane.el.style.visibility = seg ? "hidden" : "";
  };
  let lastY = scrollY;
  let down = true;

  const tick = (_: number, dtMs: number) => {
    if (scrollY !== lastY) down = scrollY > lastY;
    lastY = scrollY;
    const dt = Math.min(dtMs, 50) / 1000;
    for (const lane of lanes) {
      if (lane.shown && live(lane.shown)) continue;
      if (lane.shown) {
        // Its copy just stopped working here: pick up from exactly where it is.
        lane.pos = where(lane.shown);
        lane.vel = { x: 0, y: 0 };
        show(lane, null);
      }
      const next = lane.segs.find(live);
      let goal: Pt | null = next ? where(next) : null;
      if (!next) {
        const i = lane.segs.findLastIndex((s) => s.tl.time() >= s.a.last);
        const from = lane.segs[i];
        const to = lane.segs[i + 1];
        // Like a purposeful agent: head straight for the spot it works at next (or, scrolling back,
        // the one it came from) and wait there, kept on screen until that spot scrolls into view.
        if (from && to) goal = down ? onScreen(to.d.overlay.getBoundingClientRect(), to.a.firstPos!) : onScreen(from.d.overlay.getBoundingClientRect(), from.a.lastPos!);
      }
      if (!goal) {
        lane.pos = null;
        lane.el.style.visibility = "hidden";
        continue;
      }
      // Critically damped spring: quick, with a smooth start and stop (settles in about 0.5s).
      const p = lane.pos ?? goal;
      const w = 12;
      const v = lane.vel;
      v.x += (w * w * (goal.x - p.x) - 2 * w * v.x) * dt;
      v.y += (w * w * (goal.y - p.y) - 2 * w * v.y) * dt;
      lane.pos = { x: p.x + v.x * dt, y: p.y + v.y * dt };
      if (next && Math.hypot(goal.x - lane.pos.x, goal.y - lane.pos.y) < 3) {
        show(lane, next);
        continue;
      }
      lane.el.style.visibility = "";
      lane.el.style.transform = `translate(${lane.pos.x}px, ${lane.pos.y}px)`;
    }
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    layer.remove();
  };
}

/** Pin spacers shift every section down, so deep links need re-resolving once they exist. */
function jumpToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id || id === "home") return;
  ScrollTrigger.refresh();
  document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
}
