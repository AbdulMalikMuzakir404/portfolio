import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
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
            built = mount(mode);
            ScrollTrigger.refresh();
          }, 250);
        };
        addEventListener("resize", onResize);

        return () => {
          clearTimeout(timer);
          removeEventListener("resize", onResize);
          built.revert();
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
        const pin = scene.scroll.pin?.[mode];

        // Only the editor scene has a Stage 1 intro and drives the header's Skip button.
        const editor = scene.chrome === "editor";
        const intro = editor ? playIntro(d) : undefined;
        if (intro) stops.push(intro.stop);
        const sync = (p: number) => {
          html.dataset.swarm = p < 0.995 ? "building" : "done";
          if (p > 0.002) intro?.release();
        };

        const st = ScrollTrigger.create({
          trigger: scene.scroll.trigger ? (root.querySelector(scene.scroll.trigger) ?? root) : root,
          start: scene.scroll.start,
          end: pin ? () => `+=${innerHeight * pin}` : scene.scroll.end,
          pin: !!pin,
          anticipatePin: pin ? 1 : 0,
          scrub: 0.6,
          animation: tl,
          onUpdate: editor ? (self) => sync(self.progress) : undefined,
        });
        if (editor) {
          hero = st;
          sync(st.progress);
        }
      }

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
 * Time-based Stage 1. The swarm flies in and orbits the centre like a small galaxy (inner agents
 * faster), and the whole system leans toward the visitor's pointer, each agent with its own lag.
 * It only moves the `.sw-inner` wrappers, so the scroll timeline (on the outer element) is
 * untouched; the first scroll eases every offset back to zero.
 */
function playIntro(d: Director) {
  const agents = [...d.agents.values()];
  const inners = agents.map((a) => a.inner);
  const offsets = d.enterOffsets();
  const { w, h } = d.size;
  const cx = agents.reduce((n, a) => n + a.home.x, 0) / agents.length;
  const cy = agents.reduce((n, a) => n + a.home.y, 0) / agents.length;
  // Orbits keep each agent's own ring radius; the ellipse squash matches the gathering ring.
  const squash = 0.82;
  const orbits = agents.map((a) => {
    const dx = a.home.x - cx;
    const dy = (a.home.y - cy) / squash;
    return { r: Math.hypot(dx, dy), a0: Math.atan2(dy, dx) };
  });
  const rMax = Math.max(...orbits.map((o) => o.r), 1);
  const sim = agents.map((_, i) => ({
    ...offsets[i],
    k: 0.03 + ((i * 7) % 10) * 0.0045,
    // Kepler-ish: angular speed falls off with radius, so the inner ring overtakes the outer one.
    w: 0.3 * Math.pow(rMax / orbits[i].r, 1.5),
  }));
  const setX = inners.map((el) => gsap.quickSetter(el, "x", "px"));
  const setY = inners.map((el) => gsap.quickSetter(el, "y", "px"));
  sim.forEach((s, i) => (setX[i](s.x), setY[i](s.y)));

  const aim = { x: 0, y: 0 };
  const clamp = gsap.utils.clamp;
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const r = d.root.getBoundingClientRect();
    aim.x = clamp(-w * 0.32, w * 0.32, (e.clientX - r.left - cx) * 0.65);
    aim.y = clamp(-h * 0.28, h * 0.28, (e.clientY - r.top - cy) * 0.65);
  };
  const onLeave = () => ((aim.x = 0), (aim.y = 0));

  const born = gsap.ticker.time;
  const tick = (time: number) => {
    const dr = gsap.ticker.deltaRatio();
    sim.forEach((s, i) => {
      if (time - born < i * 0.08) return; // staggered entrance
      const { r, a0 } = orbits[i];
      const ang = a0 + s.w * (time - born);
      // Target is the orbit point minus the agent's resting spot (offsets are relative to it).
      const tx = aim.x + cx + Math.cos(ang) * r - agents[i].home.x;
      const ty = aim.y + cy + Math.sin(ang) * r * squash - agents[i].home.y;
      const f = 1 - Math.pow(1 - s.k, dr); // frame-rate independent easing
      s.x += (tx - s.x) * f;
      s.y += (ty - s.y) * f;
      setX[i](s.x);
      setY[i](s.y);
    });
  };
  gsap.ticker.add(tick);
  d.root.addEventListener("pointermove", onMove);
  d.root.addEventListener("pointerleave", onLeave);

  let done = false;
  const stop = () => {
    if (done) return;
    done = true;
    gsap.ticker.remove(tick);
    d.root.removeEventListener("pointermove", onMove);
    d.root.removeEventListener("pointerleave", onLeave);
  };
  return {
    stop,
    release() {
      if (done) return;
      stop();
      gsap.to(inners, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    },
  };
}

/** Pin spacers shift every section down, so deep links need re-resolving once they exist. */
function jumpToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id || id === "home") return;
  ScrollTrigger.refresh();
  document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
}
