import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Lenis from "lenis";
import { Director } from "./director";
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
          scrub: 0.6,
          animation: tl,
          onUpdate: editor || finale ? (self) => sync(self.progress) : undefined,
        });
        if (editor) hero = st;
        if (editor || finale) sync(st.progress);
      }

      buildHeader();
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
  gsap.set(document.querySelectorAll("[data-build], [data-build-part], [data-ch]"), { clearProps: "all" });
}

/**
 * The header isn't there while the swarm gathers; it is built, part by part, over the first stretch
 * of scrolling. No cursor does this: the ten agents are busy with the hero.
 */
function buildHeader() {
  const header = document.querySelector<HTMLElement>("[data-swarm-header]");
  if (!header) return;
  const q = (sel: string) => [...header.querySelectorAll<HTMLElement>(sel)].filter((e) => e.getClientRects().length);
  const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.5 } });
  tl.fromTo(q(".hdr-bar"), { autoAlpha: 0, y: -18, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1 })
    .fromTo(q(".hdr-pop"), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, ease: "back.out(2)", stagger: 0.05 }, 0.25)
    .fromTo(q(".hdr-wipe"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "steps(18)", duration: 0.7 }, 0.3)
    .fromTo(q(".hdr-drop"), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, stagger: 0.06 }, 0.4)
    .fromTo(q(".hdr-rise"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, 0.7);
  ScrollTrigger.create({ start: 0, end: () => innerHeight * 0.6, scrub: 0.6, animation: tl });
}

/** Pin spacers shift every section down, so deep links need re-resolving once they exist. */
function jumpToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id || id === "home") return;
  ScrollTrigger.refresh();
  document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
}
