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
      return () => overlays.forEach((o) => o.remove());
    });
  }

  return () => {
    alive = false;
    removeEventListener("swarm:skip", onSkip);
    removeEventListener("focusin", onFocus);
    teardown();
  };
}

/** Time-based Stage 1: cursors fly in and hover until the first scroll hands control to the timeline. */
function playIntro(d: Director) {
  const inners = [...d.agents.values()].map((a) => a.inner);
  const offsets = d.enterOffsets();
  const tweens: gsap.core.Tween[] = [
    gsap.from(inners, {
      x: (i) => offsets[i].x,
      y: (i) => offsets[i].y,
      duration: 1.5,
      stagger: 0.11,
      ease: "power3.out",
    }),
  ];
  // Two out-of-phase sine drifts per cursor trace a small orbit around the gathering point.
  inners.forEach((el, i) => {
    const delay = 1.5 + i * 0.11;
    tweens.push(
      gsap.to(el, { x: 7 + i, duration: 1.7 + i * 0.23, yoyo: true, repeat: -1, ease: "sine.inOut", delay }),
      gsap.to(el, { y: -6 - i, duration: 2.1 + i * 0.17, yoyo: true, repeat: -1, ease: "sine.inOut", delay: delay + 0.4 }),
    );
  });
  let released = false;
  return {
    release() {
      if (released) return;
      released = true;
      tweens.forEach((t) => t.kill());
      gsap.to(inners, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
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
