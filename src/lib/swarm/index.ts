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
        // A touch of smoothing, wheel a bit faster than native. Kept light on purpose: a stronger
        // setting (0.7x, lerp 0.07) read as laggy. Keyboard, anchors and focus stay native.
        const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1.15, anchors: true });
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

      stops.push(travel(runs), studio(runs));
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

const SECTION_NAMES: Record<string, string> = { home: "Hero", about: "About", skills: "Skills", experience: "Experience", work: "Work", credentials: "Credentials", contact: "Contact" };
const sectionName = (d: Director) => SECTION_NAMES[d.root.closest("section")?.id ?? ""] ?? "";

/**
 * Design-tool chrome around the build: rulers along the top and left edges (blue bands follow the
 * current selections) and a status bar with the agents, a live layer counter and what's happening.
 * The rulers fade once the page is published; the status bar stays to say so.
 */
function studio(runs: Run[]) {
  const ids = new Set(runs.flatMap((r) => [...r.d.agents.keys()]));
  const crew = cursors.filter((c) => ids.has(c.id));
  const total = runs.reduce((n, r) => n + r.d.built.length, 0);
  const sectionOf = (r: Run) => sectionName(r.d);
  const contact = runs.find((r) => r.d.root.id === "contact");

  const el = (cls: string, html = "") => {
    const e = document.createElement("div");
    e.className = cls;
    e.setAttribute("aria-hidden", "true");
    e.innerHTML = html;
    document.body.append(e);
    return e;
  };
  const hud = el(
    "sw-hud",
    `<span class="sw-hud-av">${crew.map((c) => `<i style="background:${c.color}"></i>`).join("")}</span><span><b>${crew.length}</b> agents</span><span><b class="sw-hud-n">0</b> / ${total} layers</span><span class="sw-hud-bar"><i></i></span><span class="sw-hud-status">Scanning page…</span>`,
  );
  const count = hud.querySelector<HTMLElement>(".sw-hud-n")!;
  const bar = hud.querySelector<HTMLElement>(".sw-hud-bar i")!;
  const status = hud.querySelector<HTMLElement>(".sw-hud-status")!;

  const top = el("sw-ruler sw-ruler-x", Array.from({ length: 40 }, (_, i) => `<em style="left:${i * 100 + 3}px">${i * 100}</em>`).join(""));
  const left = el("sw-ruler sw-ruler-y", Array.from({ length: 16 }, () => "<em></em>").join(""));
  const marks = left.querySelectorAll<HTMLElement>("em");
  const bands = (ruler: HTMLElement) => Array.from({ length: 10 }, () => ruler.appendChild(document.createElement("b")));
  const topBands = bands(top);
  const leftBands = bands(left);
  const sels = new Map(runs.map((r) => [r, [...r.d.overlay.querySelectorAll<HTMLElement>(".sw-sel")]]));
  const frames = new Map(runs.map((r) => [r, [...r.d.overlay.querySelectorAll<HTMLElement>(".sw-skel")]]));

  let shown = -1;
  let text = "";
  const tick = () => {
    // Layers built so far, and what's happening.
    let n = 0;
    let active: Run | undefined;
    for (const r of runs) {
      const t = r.tl.time();
      for (const b of r.d.built) if (t >= b) n++;
      const p = r.tl.progress();
      if (p > 0 && p < 1) active = r;
    }
    if (n !== shown) {
      shown = n;
      count.textContent = String(n);
      bar.style.transform = `scaleX(${total ? n / total : 0})`;
    }
    const cp = contact?.tl.progress() ?? 0;
    const done = cp > 0.995;
    const next = done ? "Published ✓" : cp > 0.85 ? "Publishing…" : n === 0 ? "Scanning page…" : active ? `Building · ${sectionOf(active)}` : text;
    if (next !== text) {
      text = next;
      status.textContent = next;
      hud.classList.toggle("is-done", done);
      top.classList.toggle("is-off", done);
      left.classList.toggle("is-off", done);
    }

    // Left ruler counts page pixels and scrolls with the page.
    const y0 = scrollY;
    left.style.backgroundPositionY = `${-y0}px`;
    const first = Math.floor(y0 / 100);
    marks.forEach((m, i) => {
      const py = (first + i) * 100;
      m.style.transform = `translateY(${py - y0 + 3}px) rotate(-90deg)`;
      if (m.textContent !== String(py)) m.textContent = String(py);
    });

    // Bands on the rulers: strong for the selections on screen, faint for the layer frames waiting
    // to be built. GSAP's autoAlpha writes visibility inline, so no style recalculation is needed.
    const boxes: { q: DOMRect; strong: boolean }[] = [];
    const take = (els: HTMLElement[], strong: boolean) => {
      for (const s of els) {
        if (boxes.length >= 10) return;
        if (s.style.visibility === "hidden") continue;
        const q = s.getBoundingClientRect();
        if (q.bottom > 0 && q.top < innerHeight && q.width > 0) boxes.push({ q, strong });
      }
    };
    const live = runs.filter((r) => {
      const b = r.d.root.getBoundingClientRect();
      return b.bottom > 0 && b.top < innerHeight && r.tl.progress() < 1;
    });
    live.forEach((r) => take(sels.get(r)!, true));
    live.forEach((r) => take(frames.get(r)!, false));
    topBands.forEach((b, i) => {
      const it = boxes[i];
      b.style.opacity = it ? (it.strong ? "1" : "0.45") : "0";
      if (it) b.style.transform = `translateX(${it.q.left}px) scaleX(${it.q.width / 100})`;
    });
    leftBands.forEach((b, i) => {
      const it = boxes[i];
      b.style.opacity = it ? (it.strong ? "1" : "0.45") : "0";
      if (it) b.style.transform = `translateY(${it.q.top}px) scaleY(${it.q.height / 100})`;
    });
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    hud.remove();
    top.remove();
    left.remove();
  };
}

/**
 * Agents never vanish between sections. A scene shows its own copy of an agent only while the agent
 * works there (from arriving at its first task until the scene's exit). Whenever an agent leaves one
 * copy, a shared traveller takes over exactly where that copy was. It stays by the finished work until
 * the spot of the agent's next task (scrolling up: the previous one) is on screen, then zips there
 * (spring-eased) and waits riding along with the page; it hands back to the next copy once it's on
 * top of it. No
 * hand-off ever jumps. Fast moves (in a scene or between scenes) leave a short streak.
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
    // A speed streak behind the arrow, shown only on fast moves.
    const trail = document.createElement("div");
    trail.className = "sw-trail";
    trail.style.setProperty("--c", all[0].a.spec.color);
    const bubble = document.createElement("div");
    bubble.className = "sw-say";
    bubble.style.background = all[0].a.spec.color;
    bubble.style.visibility = "hidden";
    layer.append(trail, el, bubble);
    return {
      id,
      segs,
      el,
      trail,
      shown: null as (typeof segs)[number] | null,
      pos: null as Pt | null,
      vel: { x: 0, y: 0 },
      // For the streak: last position relative to the scene the agent belongs to, and smoothed speed.
      frame: null as Director | null,
      rel: null as Pt | null,
      speed: { x: 0, y: 0 },
      // Idle: a small offset it hops around while waiting, its spring, and when it last stopped.
      bubble,
      off: { x: 0, y: 0 },
      offVel: { x: 0, y: 0 },
      hop: { x: 0, y: 0 },
      nextHop: 0,
      still: 0,
      sayUntil: 0,
      quietUntil: 1.5 + Math.random() * 3,
      onScreen: false,
      cheerAt: 0,
      screen: { x: -999, y: -999 },
      greeted: -99,
      turn: null as { at: number; text: string; typed: boolean } | null,
      // Who it's facing in a conversation (only its position matters here).
      lookAt: null as { onScreen: boolean; screen: Pt } | null,
    };
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
  // A scene point on screen. The root gives the top: the hero's layer is fixed, its content isn't.
  const origin = (d: Director) => ({ x: d.overlay.getBoundingClientRect().left, y: d.root.getBoundingClientRect().top });
  const onPage = (d: Director, p: Pt) => {
    const o = origin(d);
    return { x: o.x + p.x, y: o.y + p.y };
  };
  const visible = (q: Pt) => q.y > 40 && q.y < innerHeight - 60;
  const show = (lane: (typeof lanes)[number], seg: Seg | null) => {
    if (lane.shown) {
      lane.shown.a.el.style.visibility = "hidden";
      lane.shown.a.el.style.translate = "";
    }
    if (seg) seg.a.el.style.visibility = "";
    lane.shown = seg;
    lane.el.style.visibility = seg ? "hidden" : "";
  };
  let lastY = scrollY;
  let down = true;

  type Lane = (typeof lanes)[number];

  // While waiting, an agent keeps working: it hops around the spot inspecting things, clicks now and
  // then, says what it's about to do, and chats with the others (see the conversation scripts).
  const about: Partial<Record<string, string>> = {
    type: "Warming up the text tool",
    draw: "Measuring the frame",
    import: "Fetching the asset",
    stamp: "Lining up the chips",
    thread: "Drafting a comment",
    comment: "Drafting a comment",
    write: "Outlining the copy",
    highlight: "Picking the accent",
    paint: "Mixing the palette",
    marquee: "Planning the selection",
    align: "Checking the grid",
    reveal: "Prepping the reveal",
    fill: "Filling in content",
    place: "Prepping the image",
    duplicate: "Copying the component",
    line: "Measuring the divider",
    appear: "Setting the type scale",
    publish: "Getting ready to ship",
  };
  const busy = ["Reviewing spacing", "Checking contrast", "Scanning the grid", "Running a11y checks", "Inspecting layers"];
  // Conversation scripts, by phase. Each line is [who, text]: 0 starts, 1 and 2 join in; {0} {1} {2}
  // are their names, {section} the part of the page they're on, {task} what the speaker does next.
  type Line = [number, string];
  const scripts: Record<"hello" | "work" | "after", Line[][]> = {
    // The opening: the team gathers, says hi and splits up the work.
    hello: [
      [[0, "Morning team ☀️"], [1, "Morning {0}! Coffee first? ☕"], [2, "Already on my second 😄"], [0, "Ha. Let's build something nice"]],
      [[0, "Hey {1}! Ready to build?"], [1, "Always 💪"], [0, "The visitor's scroll is our cue 👇"]],
      [[0, "Who's taking the hero?"], [1, "I've got the name"], [2, "I'll grab the photo 📸"], [0, "Perfect. Teamwork 🤝"]],
      [[0, "Nice to see you all 👋"], [1, "Welcome back {0}!"], [2, "Ten of us today 🔟"], [1, "Let's make it look great"]],
      [[0, "Did everyone read the CV?"], [1, "Twice 📄"], [2, "Bandung, Full Stack, MrScraper ✓"], [0, "Then we're set"]],
      [[0, "{1}, nice colour today 🎨"], [1, "Thanks! Matches the brand"], [0, "😂"]],
      [[0, "Waiting for the scroll…"], [1, "Any second now 👀"], [2, "Patience, team 🧘"]],
      [[0, "How was the weekend, {1}?"], [1, "Refactored a whole repo 😅"], [0, "Of course you did"]],
    ],
    // During the build: about the section and the task at hand.
    work: [
      [[0, "{section} is coming together 👌"], [1, "Spacing feels right"], [2, "Snapped to the 8pt grid ✓"], [0, "Love it"]],
      [[0, "I'll take the {task} here"], [1, "Cool, I'll review after"], [0, "Deal 🤝"]],
      [[0, "Heading weight okay?"], [1, "Bump it to 500"], [0, "Done ✓"]],
      [[0, "Contrast check?"], [1, "AA passes on dark"], [2, "Even on the muted text"], [0, "Ship it 🚀"]],
      [[0, "{1}, can you take the chips?"], [1, "On it"], [1, "Done, all aligned"], [0, "Fast! ⚡"]],
      [[0, "Image looks a bit soft"], [1, "Exporting @2x"], [0, "Much sharper ✨"]],
      [[0, "Copy for this card?"], [1, "Straight from the CV"], [2, "No invented numbers 🙅"], [0, "As it should be"]],
      [[0, "Should the title wrap?"], [1, "Two lines max"], [0, "Agreed"]],
      [[0, "{1}, want a hand?"], [1, "Grab the next row"], [0, "On my way ➜"]],
      [[0, "Ready for review?"], [1, "One sec…"], [1, "Okay, all yours 👀"], [2, "Looks great to me"]],
      [[0, "Coffee break after {section}?"], [1, "Earn it first 😄"], [0, "Fair 😅"]],
      [[0, "Next up: the {task}"], [1, "Need anything?"], [0, "Just a second pair of eyes 👀"], [1, "Got you"]],
    ],
    // After publishing: wind down together.
    after: [
      [[0, "That was fun 😄"], [1, "Best build this week"], [2, "Same time tomorrow?"], [0, "Count me in 🙋"]],
      [[0, "Who's buying pizza? 🍕"], [1, "{2} is 😏"], [2, "Hey! 😂"], [1, "Kidding, it's on me"]],
      [[0, "Quick retro?"], [1, "Keep: the comments 💬"], [2, "Change: more coffee ☕"], [0, "Noted 📝"]],
      [[0, "Psst, visitor 👋"], [1, "Abdul's email is right there ✉️"], [2, "WhatsApp works too 📱"]],
      [[0, "Proud of us 🥹"], [1, "Group hug 🤗"], [2, "Virtual high five ✋"]],
      [[0, "Want to see it again?"], [1, "Scroll up, or hit Replay build ↺"], [0, "We'd happily rebuild it"]],
    ],
  };
  const reactions = ["👍", "😂", "🔥", "❤️", "👀", "💯", "🙌", "✨"];
  const taskNoun: Partial<Record<string, string>> = {
    type: "text",
    write: "copy",
    draw: "frame",
    import: "image",
    stamp: "chips",
    fill: "card copy",
    reveal: "details",
    paint: "colours",
    marquee: "nav",
    align: "row",
    thread: "review",
    highlight: "accent",
    duplicate: "copies",
    line: "divider",
    appear: "headline",
    place: "image",
  };
  const label = (l: Lane) => l.el.querySelector(".sw-tag")!.textContent;
  // Bubbles hang right of the arrow; near the right edge they flip to its left so they aren't cut off.
  const place = (b: HTMLElement, x: number, y: number) => {
    const flip = x + 16 + b.offsetWidth > innerWidth - 8;
    b.style.translate = `${flip ? x - b.offsetWidth - 24 : x}px ${y}px`;
  };
  // Never talk over a comment thread, note or the Publish chrome.
  const covers = (b: HTMLElement) => {
    const r = b.getBoundingClientRect();
    return [...document.querySelectorAll<HTMLElement>(".sw-thread, .sw-note, .sw-toast, .sw-chip, .sw-toolbar")].some((n) => {
      if (!n.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return false;
      const q = n.getBoundingClientRect();
      return r.left < q.right && r.right > q.left && r.top < q.bottom && r.bottom > q.top;
    });
  };
  const say = (lane: Lane, text: string, x: number, y: number, dur = 2.2) => {
    lane.bubble.textContent = text;
    lane.bubble.classList.toggle("sw-say-dots", text === "•••");
    place(lane.bubble, x, y);
    if (covers(lane.bubble)) {
      lane.quietUntil = clock + 1.5;
      return;
    }
    lane.bubble.style.visibility = "";
    lane.sayUntil = clock + dur;
    lane.quietUntil = clock + 4 + Math.random() * 5;
  };
  const greetings = ["👋 hi!", "Hey there!", "Looking for something?", "Hi! Watch this", "Oh, hello 👀"];
  const cheers = ["Yay! 🎉", "Great job, team! 🙌", "We shipped it 🚀", "High five ✋", "Looks amazing ✨", "Teamwork 💪", "Woohoo! 🥳", "Nailed it 🎯", "So clean 😍", "It's live! 🌐"];
  const pickOne = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
  // Each agent waits in its own way.
  type Style = "orbit" | "grid" | "figure8" | "dart" | "scan" | "drift" | "spiral" | "bounce" | "buddy";
  const personality: Record<string, Style> = {
    claude: "orbit",
    codex: "grid",
    gemini: "figure8",
    copilot: "dart",
    devin: "scan",
    mistral: "dart",
    llama: "drift",
    deepseek: "spiral",
    qwen: "bounce",
    grok: "buddy",
  };
  // Spring stiffness and damping per style: grid snaps, drift is lazy, bounce overshoots.
  const springs: Partial<Record<Style, [number, number]>> = {
    grid: [18, 1],
    dart: [14, 0.9],
    scan: [16, 1],
    drift: [5, 1],
    bounce: [12, 0.35],
    buddy: [6, 1],
    orbit: [8, 1],
    figure8: [8, 1],
    spiral: [8, 1],
  };
  const curious = new Set(["claude", "gemini", "grok", "qwen", "copilot"]);
  const shy = new Set(["llama", "deepseek", "devin"]);
  const pointer = { x: -9999, y: -9999 };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  };
  const onLeave = () => ((pointer.x = -9999), (pointer.y = -9999));
  addEventListener("pointermove", onPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  let clock = 0;
  // Celebration once the page is published (Contact's timeline at its end); again on each return.
  const contact = runs.find((r) => r.d.root.id === "contact");
  let celebrated = false;
  let cheerUntil = 0;
  const celebrate = () => {
    const done = !!contact && contact.tl.progress() > 0.995;
    if (done && !celebrated) {
      celebrated = true;
      const order = [...lanes].sort(() => Math.random() - 0.5);
      order.forEach((l, i) => (l.cheerAt = clock + 0.7 + i * 0.45));
      cheerUntil = clock + 0.7 + order.length * 0.45 + 2.4;
    } else if (!done && celebrated && contact!.tl.progress() < 0.9) {
      celebrated = false;
      cheerUntil = 0;
      lanes.forEach((l) => (l.cheerAt = 0));
    }
  };
  // One conversation at a time: who's in it, its lines and how far it got.
  let convo: { cast: Lane[]; lines: Line[]; i: number; vars: Record<string, string> } | null = null;
  let nextConvoAt = 2.5;
  const hero = runs[0];
  const phase = (): "hello" | "work" | "after" =>
    contact && contact.tl.progress() > 0.995 ? "after" : hero && hero.tl.progress() < 0.02 ? "hello" : "work";
  const fill = (text: string, c: NonNullable<typeof convo>) =>
    text.replace(/\{(\d|section|task)\}/g, (_, k: string) => (/\d/.test(k) ? (c.cast[+k] ? label(c.cast[+k]) : "team") : c.vars[k]));
  const schedule = (c: NonNullable<typeof convo>, delay: number) => {
    const [who, text] = c.lines[c.i];
    const speaker = c.cast[who];
    if (!speaker?.onScreen) return endConvo();
    speaker.turn = { at: clock + delay, text: fill(text, c), typed: false };
  };
  const endConvo = () => {
    convo?.cast.forEach((l) => ((l.lookAt = null), (l.turn = null)));
    convo = null;
    nextConvoAt = clock + 2 + Math.random() * 3;
  };
  const startConvo = (lane: Lane, upcoming: Seg | undefined) => {
    const p = phase();
    const others = lanes.filter((l) => l !== lane && l.onScreen && clock >= l.sayUntil).sort(() => Math.random() - 0.5);
    // Prefer an agent busy in a scene as the one spoken to.
    others.sort((a, b) => Number(!!b.shown && b.still === 0) - Number(!!a.shown && a.still === 0));
    const fits = scripts[p].filter((sc) => Math.max(...sc.map(([w]) => w)) <= others.length);
    if (!fits.length) return;
    const lines = pickOne(fits);
    const seg = lane.shown ?? upcoming;
    const cast = [lane, ...others.slice(0, Math.max(...lines.map(([w]) => w)))];
    convo = {
      cast,
      lines,
      i: 0,
      vars: { section: (seg && sectionName(seg.d)) || "This section", task: (upcoming?.a.firstTask && taskNoun[upcoming.a.firstTask]) || "next bit" },
    };
    // Everyone in it turns towards whoever speaks first.
    cast.forEach((l) => (l.lookAt = l === lane ? cast[1] : lane));
    schedule(convo, 0);
  };
  const idle = (lane: Lane, at: Pt, visEl: HTMLElement, svg: SVGElement, upcoming: Seg | undefined, dt: number) => {
    const moving = Math.hypot(lane.speed.x, lane.speed.y) > 40;
    lane.still = moving ? 0 : lane.still + dt;
    const waiting = lane.still > 0.35;
    // Calm enough to talk: waiting, or just drifting (the opening orbit), not dashing somewhere.
    const calm = waiting || Math.hypot(lane.speed.x, lane.speed.y) < 260;
    const t = lane.still;
    const style = personality[lane.id] ?? "dart";
    const tap = () => svg.animate?.([{ scale: "1" }, { scale: "0.84" }, { scale: "1" }], { duration: 160 });
    let target = { x: 0, y: 0 };
    if (waiting) {
      // Smooth patterns follow time; the others pick a new spot now and then (sometimes clicking it).
      if (style === "orbit") target = { x: Math.cos(t * 1.6) * 18, y: Math.sin(t * 1.6) * 12 };
      else if (style === "figure8") target = { x: Math.sin(t * 1.4) * 26, y: Math.sin(t * 2.8) * 10 };
      else if (style === "spiral") {
        const r = 8 + 24 * (0.5 + 0.5 * Math.sin(t * 0.7));
        target = { x: Math.cos(t * 2.4) * r, y: Math.sin(t * 2.4) * r * 0.7 };
      } else if (style === "buddy") {
        // Go and hang around the nearest agent on screen, circling it.
        const me = lane.screen;
        const near = lanes.filter((l) => l !== lane && l.onScreen).sort((a, b) => Math.hypot(a.screen.x - me.x, a.screen.y - me.y) - Math.hypot(b.screen.x - me.x, b.screen.y - me.y))[0];
        const ring = { x: Math.cos(t * 1.3) * 46, y: Math.sin(t * 1.3) * 30 };
        target = near && Math.hypot(near.screen.x - me.x, near.screen.y - me.y) < 320 ? { x: near.screen.x - at.x + ring.x, y: near.screen.y - at.y + ring.y } : ring;
      } else {
        if (clock > lane.nextHop) {
          const rnd = (a: number, b: number) => a + Math.random() * (b - a);
          const ang = rnd(0, Math.PI * 2);
          if (style === "grid") {
            lane.hop = { x: Math.round(rnd(-3, 3)) * 16, y: Math.round(rnd(-2, 2)) * 16 };
            lane.nextHop = clock + rnd(0.55, 0.95);
          } else if (style === "scan") {
            // Reading along lines: step right, then down a line and back to the start.
            const col = lane.hop.x >= 40 ? -40 : lane.hop.x + 20;
            const row = col === -40 ? (lane.hop.y >= 24 ? -12 : lane.hop.y + 12) : lane.hop.y;
            lane.hop = { x: col, y: row };
            lane.nextHop = clock + 0.32;
          } else if (style === "drift") {
            const r = rnd(8, 26);
            lane.hop = { x: Math.cos(ang) * r, y: Math.sin(ang) * r * 0.7 };
            lane.nextHop = clock + rnd(2, 3.2);
          } else if (style === "bounce") {
            lane.hop = { x: rnd(-34, 34), y: lane.hop.y < -6 ? 4 : -20 };
            lane.nextHop = clock + rnd(0.5, 0.8);
          } else {
            const r = rnd(20, 52);
            lane.hop = { x: Math.cos(ang) * r, y: Math.sin(ang) * r * 0.7 };
            lane.nextHop = clock + rnd(0.45, 0.85);
          }
          if (Math.random() < (style === "grid" ? 0.5 : 0.3)) setTimeout(tap, 300);
        }
        target = lane.hop;
      }
      // The visitor's pointer: curious agents come over to look (and may say hi), shy ones back off.
      const dx = pointer.x - (at.x + lane.off.x);
      const dy = pointer.y - (at.y + lane.off.y);
      const d = Math.hypot(dx, dy);
      if (d < 200 && d > 1) {
        if (curious.has(lane.id)) {
          const reach = Math.min(d - 44, 110);
          target = { x: target.x * 0.3 + (dx / d) * reach, y: target.y * 0.3 + (dy / d) * reach };
        } else if (shy.has(lane.id)) target = { x: target.x - (dx / d) * (200 - d) * 0.45, y: target.y - (dy / d) * (200 - d) * 0.45 };
      }
      // In a conversation, lean towards the one being spoken to (or speaking).
      const peer = lane.lookAt;
      if (peer?.onScreen) {
        const lx = peer.screen.x - (at.x + lane.off.x);
        const ly = peer.screen.y - (at.y + lane.off.y);
        const ld = Math.hypot(lx, ly);
        if (ld > 60) target = { x: target.x * 0.4 + (lx / ld) * Math.min(26, ld - 60), y: target.y * 0.4 + (ly / ld) * Math.min(26, ld - 60) };
      }
      // Personal space: don't sit on top of another agent.
      for (const l of lanes) {
        if (l === lane || !l.onScreen) continue;
        const ox = at.x + target.x - l.screen.x;
        const oy = at.y + target.y - l.screen.y;
        const od = Math.hypot(ox, oy);
        if (od < 44 && od > 0.1) target = { x: target.x + (ox / od) * (44 - od), y: target.y + (oy / od) * (44 - od) };
      }
    }
    lane.hop = waiting ? lane.hop : { x: 0, y: 0 };
    // Spring towards the target; each style has its own feel (snappy, lazy, bouncy).
    const [w, z] = !waiting ? [16, 1] : (springs[style] ?? [9, 1]);
    lane.offVel.x += (w * w * (target.x - lane.off.x) - 2 * z * w * lane.offVel.x) * dt;
    lane.offVel.y += (w * w * (target.y - lane.off.y) - 2 * z * w * lane.offVel.y) * dt;
    lane.off.x += lane.offVel.x * dt;
    lane.off.y += lane.offVel.y * dt;
    visEl.style.translate = `${lane.off.x}px ${lane.off.y}px`;

    const x = at.x + lane.off.x;
    const y = at.y + lane.off.y;
    const onScreen = x > 0 && x < innerWidth - 30 && y > 60 && y < innerHeight - 70;
    lane.onScreen = onScreen;
    lane.screen = { x, y };
    const stepSay = visEl.querySelector<HTMLElement>(".sw-say");
    const talking = lanes.filter((l) => clock < l.sayUntil).length;
    if (clock < lane.sayUntil && onScreen) place(lane.bubble, x, y);
    if (lane.sayUntil && (clock >= lane.sayUntil || !onScreen || covers(lane.bubble))) {
      lane.sayUntil = 0;
      lane.bubble.style.visibility = "hidden";
    }
    const quiet = !(stepSay && stepSay.checkVisibility({ visibilityProperty: true }));
    const near = Math.hypot(pointer.x - x, pointer.y - y) < 110;
    if (lane.cheerAt && clock >= lane.cheerAt) {
      // The page is published: everyone celebrates, one after another.
      lane.cheerAt = 0;
      if (convo) endConvo();
      if (onScreen) say(lane, pickOne(cheers), x, y);
    } else if (clock < cheerUntil) {
      // No small talk while the team celebrates.
    } else if (lane.turn && clock >= lane.turn.at) {
      // A conversation turn: typing dots first, then the line; then the next speaker's turn, and
      // now and then someone nearby reacts with an emoji.
      const turn = lane.turn;
      if (!onScreen || !convo) {
        lane.turn = null;
        if (convo) endConvo();
      } else if (!turn.typed) {
        say(lane, "•••", x, y, 0.6);
        turn.typed = true;
        turn.at = clock + 0.6;
      } else {
        lane.turn = null;
        say(lane, turn.text, x, y, 2.4);
        const c = convo;
        const others = lanes.filter((l) => l.onScreen && !c.cast.includes(l) && clock >= l.sayUntil);
        if (others.length && Math.random() < 0.4) {
          const r = pickOne(others);
          r.turn = null;
          gsap.delayedCall(0.8, () => r.onScreen && clock >= r.sayUntil && say(r, pickOne(reactions), r.screen.x, r.screen.y, 1.3));
        }
        c.i++;
        if (c.i < c.lines.length) {
          const [who] = c.lines[c.i];
          // The next speaker turns to the one who just spoke.
          c.cast.forEach((l) => (l.lookAt = l === c.cast[who] ? lane : c.cast[who]));
          schedule(c, 1.5);
        } else endConvo();
      }
    } else if (near && curious.has(lane.id) && waiting && onScreen && quiet && talking < 3 && clock - lane.greeted > 25 && clock >= lane.sayUntil) {
      lane.greeted = clock;
      say(lane, pickOne(greetings), x, y);
    } else if (!convo && calm && clock > nextConvoAt && onScreen && quiet && clock >= lane.sayUntil && talking < 2 && Math.random() < 0.05) {
      startConvo(lane, upcoming);
    } else if (phase() === "work" && waiting && clock > lane.quietUntil && onScreen && quiet && clock >= lane.sayUntil && talking < 2 && !lane.lookAt && Math.random() < 0.01) {
      // Between conversations: a word about what it's about to do.
      say(lane, (upcoming?.a.firstTask && about[upcoming.a.firstTask]) ?? pickOne(busy), x, y);
    }
  };
  // Streak: speed measured against the agent's scene (so scrolling the page doesn't count), drawn
  // behind the arrow tip along the direction of travel, longer the faster it goes.
  const streak = (lane: Lane, at: Pt, frame: Director, dt: number) => {
    const o = origin(frame);
    const rel = { x: at.x - o.x, y: at.y - o.y };
    if (lane.frame !== frame || !lane.rel) lane.speed = { x: 0, y: 0 };
    else {
      const k = 1 - Math.exp(-dt / 0.06);
      lane.speed.x += ((rel.x - lane.rel.x) / dt - lane.speed.x) * k;
      lane.speed.y += ((rel.y - lane.rel.y) / dt - lane.speed.y) * k;
    }
    lane.frame = frame;
    lane.rel = rel;
    const v = Math.hypot(lane.speed.x, lane.speed.y);
    const len = Math.min(150, (v - 500) * 0.08);
    if (len < 6) {
      lane.trail.style.opacity = "0";
      return;
    }
    lane.trail.style.opacity = String(Math.min(1, len / 60));
    lane.trail.style.width = `${len}px`;
    lane.trail.style.transform = `translate(${at.x + off.x + 1}px, ${at.y + off.y + 1}px) rotate(${Math.atan2(lane.speed.y, lane.speed.x)}rad) translateX(-100%)`;
  };

  const tick = (_: number, dtMs: number) => {
    if (scrollY !== lastY) down = scrollY > lastY;
    lastY = scrollY;
    const dt = Math.max(1, Math.min(dtMs, 50)) / 1000;
    clock += dt;
    celebrate();
    // Positions below are without the idle offset; the offset rides on top as a CSS translate.
    const base = (lane: Lane, s: Seg) => {
      const p = where(s);
      return { x: p.x - lane.off.x, y: p.y - lane.off.y };
    };
    for (const lane of lanes) {
      if (lane.shown && live(lane.shown)) {
        const at = base(lane, lane.shown);
        streak(lane, at, lane.shown.d, dt);
        idle(lane, at, lane.shown.a.el, lane.shown.a.svg, lane.segs[lane.segs.indexOf(lane.shown) + 1], dt);
        continue;
      }
      if (lane.shown) {
        // Its copy just stopped working here: pick up from exactly where it is.
        lane.pos = base(lane, lane.shown);
        lane.vel = { x: 0, y: 0 };
        show(lane, null);
      }
      const next = lane.segs.find(live);
      let goal: Pt | null = next ? where(next) : null;
      let frame = next?.d ?? null;
      if (!next) {
        const i = lane.segs.findLastIndex((s) => s.tl.time() >= s.a.last);
        const from = lane.segs[i];
        const to = lane.segs[i + 1];
        // Like a purposeful agent: stay by the work it just finished until the spot of its next task
        // (scrolling back: the previous one) is on screen, then dart there and wait, riding along
        // with the page. Only when neither spot is visible does it wait off screen.
        if (from && to) {
          const ahead = down ? { d: to.d, p: onPage(to.d, to.a.firstPos!) } : { d: from.d, p: onPage(from.d, from.a.lastPos!) };
          const behind = down ? { d: from.d, p: onPage(from.d, from.a.lastPos!) } : { d: to.d, p: onPage(to.d, to.a.firstPos!) };
          const pick = visible(ahead.p) || !visible(behind.p) ? ahead : behind;
          frame = pick.d;
          goal = pick.p;
        }
      }
      if (!goal || !frame) {
        lane.pos = null;
        lane.el.style.visibility = "hidden";
        lane.trail.style.opacity = "0";
        lane.bubble.style.visibility = "hidden";
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
      streak(lane, lane.pos, frame, dt);
      const upcoming = lane.segs.find((s) => s.tl.time() < s.first);
      idle(lane, lane.pos, lane.el, lane.el.querySelector("svg")!, upcoming, dt);
    }
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    removeEventListener("pointermove", onPointer);
    document.documentElement.removeEventListener("pointerleave", onLeave);
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
