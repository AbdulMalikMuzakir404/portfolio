import type { CursorSpec, Scene } from "./types";

// Each cursor stands for one of the disciplines the portfolio is about.
export const cursors: CursorSpec[] = [
  { id: "fe", label: "Frontend", color: "#60A5FA", exit: { x: -0.06, y: 0.3 } },
  { id: "be", label: "Backend", color: "#34D399", exit: { x: 1.06, y: 0.14 } },
  { id: "da", label: "Data", color: "#F5B93E", exit: { x: 1.06, y: 0.82 } },
  { id: "in", label: "Infra", color: "#FF6A55", exit: { x: -0.06, y: 0.9 } },
  { id: "mo", label: "Mobile", color: "#A78BFA", exit: { x: 0.72, y: 1.08 } },
];

/** Tablet runs three cursors; aliased roles queue their work behind the cursor they map to. */
export const tabletAlias: Record<string, string> = { da: "be", in: "fe" };

const hero: Scene = {
  root: "#home",
  chrome: "editor",
  start: {
    fe: { x: 0.455, y: 0.47 },
    be: { x: 0.53, y: 0.43 },
    da: { x: 0.565, y: 0.53 },
    in: { x: 0.47, y: 0.585 },
    mo: { x: 0.515, y: 0.505 },
  },
  scroll: { start: "top top", end: "bottom top", pin: { desktop: 2.6, tablet: 1.7 } },
  steps: [
    // Backend types the name and drops in the status pill.
    { who: "be", do: "tool", tool: "text" },
    { who: "be", do: "type", target: "hero.name", id: "name" },
    { who: "be", do: "draw", target: "hero.status" },
    { who: "be", do: "deselect" },
    { who: "be", do: "rest", to: { x: 0.42, y: 0.3 } },

    // Frontend sets the headline small, scales it up, then drags it onto the name's left edge.
    { who: "fe", at: 1.3, do: "tool", tool: "text" },
    { who: "fe", do: "appear", target: "hero.headline", offset: { x: 110, y: 70 }, scale: 0.4 },
    { who: "fe", do: "scale", target: "hero.headline" },
    { who: "fe", do: "drag", target: "hero.headline", guides: [{ edge: "left", with: "hero.name" }] },
    { who: "fe", do: "deselect", id: "headline" },
    { who: "fe", do: "rest", to: { x: 0.53, y: 0.64 } },

    // Data writes the title under the name.
    { who: "da", after: "name", do: "type", target: "hero.title", id: "title" },
    { who: "da", do: "rest", to: { x: 0.56, y: 0.38 } },

    // Mobile builds the portrait frame.
    { who: "mo", at: 0.9, do: "tool", tool: "image" },
    { who: "mo", do: "draw", target: "hero.photo", until: 0.78, drop: true },
    { who: "mo", do: "place", target: "hero.photo" },
    { who: "mo", do: "resize", target: "hero.photo", from: 0.78 },
    { who: "mo", do: "deselect", id: "photo" },

    // Infra draws the primary button, then duplicates it into the CV button.
    { who: "in", at: 1.5, do: "tool", tool: "rect" },
    { who: "in", do: "draw", target: "hero.cta1" },
    { who: "in", do: "fill", target: "hero.cta1" },
    { who: "in", do: "duplicate", source: "hero.cta1", target: "hero.cta2", guides: [{ edge: "top", with: "hero.cta1" }] },
    { who: "in", do: "fill", target: "hero.cta2" },
    { who: "in", do: "deselect" },
    { who: "in", do: "rest", to: { x: 0.4, y: 0.9 } },

    // Data adds the "Now" card once the portrait is in.
    { who: "da", after: "photo", do: "draw", target: "hero.now" },
    { who: "da", do: "fill", target: "hero.now" },
    { who: "da", do: "deselect" },

    { who: "*", do: "exit" },
  ],
};

const about: Scene = {
  root: "#about",
  scroll: { start: "top 70%", end: "center 30%" },
  steps: [
    { who: "fe", do: "select", target: "about.title" },
    { who: "be", at: 0.3, do: "line", target: "about.rule" },
    { who: "fe", do: "deselect" },
    { who: "fe", at: 2.6, do: "draw", target: "about.card-0" },
    { who: "fe", do: "fill", target: "about.card-0", id: "c0" },
    { who: "be", after: "c0", do: "duplicate", source: "about.card-0", target: "about.card-1", guides: [{ edge: "top", with: "about.card-0" }] },
    { who: "be", do: "fill", target: "about.card-1", id: "c1" },
    { who: "be", do: "deselect" },
    { who: "be", do: "rest", to: { x: 0.5, y: 0.47 } },
    { who: "fe", after: "c1", do: "duplicate", source: "about.card-1", target: "about.card-2", guides: [{ edge: "top", with: "about.card-1" }] },
    { who: "fe", do: "fill", target: "about.card-2" },
    { who: "fe", do: "deselect" },
    { who: "*", do: "exit" },
  ],
};

const projects: Scene = {
  root: "#work",
  scroll: { trigger: "[data-build='projects.media']", start: "top 85%", end: "bottom 35%" },
  steps: [
    { who: "mo", do: "draw", target: "projects.media", drop: true },
    { who: "mo", do: "place", target: "projects.media", id: "media" },
    { who: "mo", do: "deselect" },
    { who: "mo", do: "rest", to: { x: 1.06, y: 0.3 } },
    { who: "da", after: "media", do: "draw", target: "projects.thumb-0" },
    { who: "da", do: "place", target: "projects.thumb-0" },
    { who: "da", do: "duplicate", source: "projects.thumb-0", target: "projects.thumb-1" },
    { who: "da", do: "duplicate", source: "projects.thumb-1", target: "projects.thumb-2" },
    { who: "da", do: "deselect" },
    { who: "*", do: "exit" },
  ],
};

const contact: Scene = {
  root: "#contact",
  chrome: "publish",
  scroll: { start: "top 80%", end: "max" },
  steps: [
    { who: "fe", do: "draw", target: "contact.title", id: "title" },
    { who: "fe", do: "deselect" },
    { who: "be", at: 0.6, do: "draw", target: "contact.actions", id: "actions" },
    { who: "be", do: "deselect" },
    { who: "*", do: "publish" },
    { who: "*", do: "exit" },
  ],
};

export const scenes = [hero, about, projects, contact];
