# Swarm animation — how it works

The page is a normal, server-rendered portfolio. On tablets and desktops with motion allowed, a swarm
of ten AI-agent cursors (Claude, Codex, Gemini, Copilot, Devin, Mistral, Llama, DeepSeek, Qwen, Grok —
text labels only, no logos) builds the **real** DOM as you scroll. No
element is duplicated for the finished state: when a timeline reaches its end, the overlay is
empty and what remains is the actual site.

## Files

| File | Role |
| --- | --- |
| `src/app/layout.tsx` (`swarmBoot`) | Inline script that runs before first paint. Adds `html.swarm` only if width ≥ 640px, motion is allowed and the visitor hasn't skipped this session. A 4s failsafe removes it if the engine never loads. |
| `src/app/globals.css` | `html.swarm:not(.swarm-ready) [data-build] { visibility: hidden }` prevents a flash before the engine applies build states. Also holds the `.sw-*` overlay styles. |
| `src/components/swarm/SwarmLoader.tsx` | Dynamically imports the engine only when `html.swarm` is set. Phones, reduced-motion and no-JS visitors never download GSAP. |
| `src/lib/swarm/index.ts` | `startSwarm()`: `gsap.matchMedia` breakpoints, one ScrollTrigger per scene (the hero is pinned), the Stage 1 intro, Skip, keyboard-focus bail-out, resize rebuild, deep-link fix. |
| `src/lib/swarm/director.ts` | Compiles a `Scene` into one paused timeline. Creates the overlay (cursors, selection boxes, guides, toolbar, artboard frame). |
| `src/lib/swarm/scenes.ts` | The choreography: cursor specs and the step lists for hero, about, projects and contact. |
| `src/lib/swarm/types.ts` | `Task`, `Step`, `Scene`, `CursorSpec`. |

## Model

- **Targets** are marked in the section markup with `data-build="hero.name"`. Sub-parts use
  `data-build-part="label"` (text a `fill` step reveals) or `data-build-part="media"` (image a
  `place` step drops in). Characters for exact typing use `data-ch`.
- **Measure once.** The Director records every target's rect relative to the scene root
  *before* applying any build state, so later transforms never skew coordinates.
- **Per-cursor clocks.** Each step starts at `max(cursor.t, at, end of after)` plus a 0.12 beat,
  and advances only that cursor's clock. Cursors therefore work in parallel, each one sequential.
  `who: "*"` steps (exit, publish) wait for everyone.
- **Scroll is the only clock.** Timelines are paused and driven by ScrollTrigger `scrub: 0.6`. No
  section pins except the hero. While the swarm runs, a gentle Lenis (`lerp 0.12`,
  `wheelMultiplier 0.85`) smooths the wheel slightly; keyboard, anchors and focus stay native.
  Contact, the last section, has almost no page below it, so it is the one other scene that holds
  (`pin: "fit"`): a separate pin keeps it framed below the header while you scroll through its
  build, then the page continues to the footer. The build itself starts earlier, as the section
  slides in (label typed, then the headline), and finishes as the hold ends. Publish is the last
  beat, with the button and toast at the top right beside the heading; then the swarm orbits in the
  right-hand column beside the heading. No extra bottom padding.
  Every state is a tween, so scrolling backwards un-builds exactly. The only time-based motion is
  the interactive Stage 1 (agents fly in and orbit the centre like a galaxy, inner ones faster,
  while the whole system leans toward the visitor's pointer, each agent with its own lag). It moves a separate wrapper (`.sw-inner`) and is released on the first scroll.
- **Transforms only** for content (`x/y/scale/opacity/clip-path`). Selection boxes animate
  width/height, but they are tiny absolutely positioned overlay nodes in a `contain`ed layer.

### Tasks

`tool`, `type`, `draw` (rectangle drag revealing the element via clip-path, optional image drop
zone), `place`, `resize`, `appear` / `scale` / `drag` (headline set small, scaled up, dragged into place
with alignment guides), `duplicate` (Alt-drag a ghost clone onto the next instance), `fill`, `line`,
`select`, `deselect`, `stamp` (pop a set's `data-build-part="item"` children in as the cursor sweeps),
`highlight` (text-selection sweep), `import` (drag an element in from an offset and snap it to a guide),
`comment` (review pin with a note), `thread` (Figma-style comment thread: the opener posts, each
reply's author flies over, "is typing…" dots, then their line lands), `write` (paragraph revealed line
by line), `reveal` (click, element slides up into place), `paint` (colour-swatch popover; the last
swatch is the element's real colour and gets applied), `marquee` (a selection box is dragged across a
group and each item appears as the edge passes it), `align` (items start scattered, the group is
selected and the align bar snaps them into line), `rest`, `wait`, `exit`, `publish`, `orbit` (closing
ring; the time-based galaxy takes over whenever the scene sits at its end).

**Every visible widget has a step.** When you add a widget, give it a `data-build` hook and a step,
and keep the variety: don't reuse the neighbouring widget's task if another one fits.

Comment boxes go to the right of their target, else above, left or below — the first spot that
fits without covering the target. Exit points are always at least 60px outside the scene, so
cursors leave even very short rows cleanly.

Every action shows Figma's hover outline as the cursor arrives, drops carry red spacing markers
with the gap in px, and `deselect` steps the cursor just off the finished element.

### Scenes (every section has one)

Every section heading has its own scene too (`heading()` in `scenes.ts`): the mono kicker is typed,
the title drawn, written or scaled into place, the lede brought in by a third agent (written,
revealed or painted), and the divider drawn.

| Section | Choreography |
| --- | --- |
| Header | built inside the hero scene by the agents whose hero work comes later: logo imported, name typed, nav marquee-selected, avatar stack aligned, Skip/Replay painted (never hidden, so it is always usable), CV drawn |
| Hero | full build: type, draw, scale/drag with guides, emphasis painted, duplicate, image drop, comment threads |
| About | heading select + rule, summary written line by line, facts stamped; cards drawn then duplicated; labels typed, hobbies stamped, qualities aligned, book imported and its title revealed, map drawn and dropped in, label typed, pin dropped |
| Skills | rule, then six agents each draw a component set and stamp its chips; the Practice row is typed and aligned |
| Experience | heading highlight + rule; per role (own scene): dates and type typed, title highlighted, location revealed, bullets filled, tech stamped |
| Work | one scene per featured project, each different (draw + drop + duplicate, phones handed up, draw-short-then-resize, import from the side, phone frames drawn), plus meta typed, summary written, details and links revealed; More projects label typed and rows dragged into order |
| Credentials | draw heading, draw + duplicate education cards; per certificate (own scene): import image, type date and title, reveal issuer, stamp highlights, paint the link; extra CV certifications stamped in, honor highlighted and discussed in a thread |
| Contact | heading written line by line once it is on screen, "amazing" highlighted, each contact button and social link stamped in, thread, everyone gathers for Publish, then the swarm rings up beside the heading and keeps orbiting (galaxy, pointer-reactive) |
| Footer | own scene that plays (over time, not scrubbed) as it slides in, because there is almost no page left below it: "Abdul", the site owner's cursor rather than an agent, types the copyright and reveals Back to top |

Long sections are split into one short scene per row (root `[data-swarm-row]`), so each row is
built while it is actually on screen instead of on one long, loosely synced timeline.
The hero's overlay is fixed to the screen (z-index above the header) because the pinned hero is its own
stacking context and could never draw over the fixed header from inside; it hides once the hero has
scrolled past. The footer's overlay reaches 110px above it (`bleed`) so the cursor has room.
Any step can carry `say: "…"`, a Figma-style cursor-chat bubble shown while that step runs.

## Breakpoints

| Width | Behaviour |
| --- | --- |
| ≥ 1024px | 10 agents, hero pinned for 3 viewport heights |
| 640–1023px | 5 agents (`tabletAlias` folds the other five into them), pin 1.9 viewport heights |
| < 640px or `prefers-reduced-motion` | No engine; finished page with a light CSS entrance (`.rise`) |

## Common changes

**Swap in your photo.** Add the file (e.g. `src/assets/images/me.jpg`), then in
`src/data/profile.ts`:

```ts
import me from "@/assets/images/me.jpg";
// …
photo: { src: me, alt: "Portrait of Abdul Malik Muzakir", focal: { x: 50, y: 30 } },
```

`focal` sets `object-position`, so the 4:5 crop keeps your face in frame. No animation code changes.

**Add a scene.** Put `data-build` ids on the elements, then add a `Scene` to `scenes.ts`:

```ts
{
  root: "#skills",
  scroll: { start: "top 70%", end: "center 40%" },
  steps: [
    { who: "claude", do: "draw", target: "skills.title", say: "Laying out the stack" },
    { who: "gemini", at: 0.3, do: "line", target: "skills.rule" },
    { who: "*", do: "exit" },
  ],
}
```

**Debug.** Scrub with the scrollbar; every frame is deterministic. To jump to a moment in the
console: `ScrollTrigger.getAll()[0].animation.progress(0.5)`.

## Escape hatches

- The header has a **Skip build / Replay build** toggle (desktop and tablet): Skip reverts everything and remembers the choice for the session; Replay clears it and reloads at the top with the build on. After any revert, `clearBuildStyles()` wipes leftover inline styles so the page always renders fully.
  choice for the session.
- Keyboard focus on any buildable control does the same and restores focus, so Tab never
  lands on a clipped button.
- Nav anchors and deep links (`/#work`) work during and after the build.
