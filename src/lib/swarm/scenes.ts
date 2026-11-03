import type { CursorSpec, Pt, Scene } from "./types";

// A swarm of AI coding agents helping build the page. Labels only (no logos); colors are loose nods.
export const cursors: CursorSpec[] = [
  { id: "claude", label: "Claude", color: "#E08A68", exit: { x: -0.06, y: 0.18 } },
  { id: "codex", label: "Codex", color: "#E4E4E7", exit: { x: 1.06, y: 0.12 } },
  { id: "gemini", label: "Gemini", color: "#6EA8FE", exit: { x: -0.06, y: 0.5 } },
  { id: "copilot", label: "Copilot", color: "#C084FC", exit: { x: 1.06, y: 0.4 } },
  { id: "devin", label: "Devin", color: "#2DD4BF", exit: { x: -0.06, y: 0.84 } },
  { id: "mistral", label: "Mistral", color: "#FF8A3D", exit: { x: 1.06, y: 0.68 } },
  { id: "llama", label: "Llama", color: "#F5B93E", exit: { x: 0.74, y: 1.08 } },
  { id: "deepseek", label: "DeepSeek", color: "#8B9CFF", exit: { x: 1.06, y: 0.94 } },
  { id: "qwen", label: "Qwen", color: "#F472B6", exit: { x: 0.26, y: 1.08 } },
  { id: "grok", label: "Grok", color: "#A3E635", exit: { x: 0.5, y: -0.08 } },
];

/** Tablet runs five agents; the others' work queues behind the agent they fold into. */
export const tabletAlias: Record<string, string> = {
  devin: "codex",
  mistral: "copilot",
  deepseek: "llama",
  qwen: "gemini",
  grok: "claude",
};

/** Places the swarm on an ellipse around a point (fractions of the root) for the Stage 1 gathering. */
function ring(cx: number, cy: number, rx: number, ry: number): Record<string, Pt> {
  return Object.fromEntries(
    cursors.map((c, i) => {
      const a = (i / cursors.length) * Math.PI * 2 - Math.PI / 2;
      // Alternate radii so neighbouring name tags don't sit on one line.
      const k = i % 2 ? 0.72 : 1;
      return [c.id, { x: cx + Math.cos(a) * rx * k, y: cy + Math.sin(a) * ry * k }];
    }),
  );
}

const hero: Scene = {
  root: "#home",
  chrome: "editor",
  start: ring(0.5, 0.47, 0.13, 0.17),
  scroll: { start: "top top", end: "bottom top", pin: { desktop: 3, tablet: 1.9 } },
  steps: [
    // Agents whose turn comes later step out of the way first, into the gutters.
    { who: "grok", at: 0.3, do: "rest", to: { x: 0.6, y: 0.2 } },
    { who: "qwen", at: 0.4, do: "rest", to: { x: 0.6, y: 0.5 } },
    { who: "mistral", at: 0.5, do: "rest", to: { x: 0.6, y: 0.74 } },
    { who: "deepseek", at: 0.6, do: "rest", to: { x: 0.935, y: 0.42 } },

    // Claude types the name.
    { who: "claude", do: "tool", tool: "text" },
    { who: "claude", do: "type", target: "hero.name", id: "name", say: "Typing Abdul's name…" },
    { who: "claude", do: "rest", to: { x: 0.42, y: 0.28 } },

    // Copilot drops in the availability pill.
    { who: "copilot", at: 0.7, do: "draw", target: "hero.status" },
    { who: "copilot", do: "deselect" },
    { who: "copilot", do: "rest", to: { x: 0.36, y: 0.12 } },

    // Codex writes the title under the name.
    { who: "codex", after: "name", do: "type", target: "hero.title", id: "title", say: "Adding the role" },
    { who: "codex", do: "rest", to: { x: 0.56, y: 0.36 } },

    // Gemini sets the headline small, scales it to display size, then snaps it onto the name's edge.
    { who: "gemini", at: 1.2, do: "tool", tool: "text" },
    { who: "gemini", do: "appear", target: "hero.headline", offset: { x: 110, y: 70 }, scale: 0.4 },
    { who: "gemini", do: "scale", target: "hero.headline", say: "Scaling to display size" },
    { who: "gemini", do: "drag", target: "hero.headline", guides: [{ edge: "left", with: "hero.name" }] },
    { who: "gemini", do: "deselect", id: "headline" },
    { who: "gemini", do: "rest", to: { x: 0.53, y: 0.64 } },

    // Qwen reviews the type.
    { who: "qwen", after: "headline", do: "comment", target: "hero.headline", text: "Tight leading reads well" },
    { who: "qwen", do: "rest", to: { x: 0.6, y: 0.9 } },

    // Llama builds the portrait frame.
    { who: "llama", at: 0.9, do: "tool", tool: "image" },
    { who: "llama", do: "draw", target: "hero.photo", until: 0.78, drop: true },
    { who: "llama", do: "place", target: "hero.photo", say: "Dropping in the portrait" },
    { who: "llama", do: "resize", target: "hero.photo", from: 0.78 },
    { who: "llama", do: "deselect", id: "photo" },

    // DeepSeek adds the "Now" card once the portrait is in.
    { who: "deepseek", after: "photo", do: "draw", target: "hero.now" },
    { who: "deepseek", do: "fill", target: "hero.now", say: "Current role" },
    { who: "deepseek", do: "deselect" },
    { who: "deepseek", do: "rest", to: { x: 0.95, y: 0.86 } },

    // Devin draws the primary button; Mistral duplicates it into the CV button.
    { who: "devin", at: 1.8, do: "tool", tool: "rect" },
    { who: "devin", do: "draw", target: "hero.cta1" },
    { who: "devin", do: "fill", target: "hero.cta1", id: "cta1" },
    { who: "devin", do: "deselect" },
    { who: "devin", do: "rest", to: { x: 0.08, y: 0.96 } },
    {
      who: "mistral",
      after: "cta1",
      do: "duplicate",
      source: "hero.cta1",
      target: "hero.cta2",
      guides: [{ edge: "top", with: "hero.cta1" }],
      say: "Duplicating the button",
    },
    { who: "mistral", do: "fill", target: "hero.cta2", id: "cta2" },
    { who: "mistral", do: "deselect" },
    { who: "mistral", do: "rest", to: { x: 0.44, y: 0.96 } },

    // Grok checks accessibility on the finished buttons.
    { who: "grok", after: "cta2", do: "comment", target: "hero.cta1", text: "Contrast passes AA ✓" },

    { who: "*", do: "exit" },
  ],
};

const about: Scene = {
  root: "#about",
  scroll: { start: "top 70%", end: "center 30%" },
  steps: [
    { who: "claude", do: "select", target: "about.title" },
    { who: "gemini", at: 0.3, do: "line", target: "about.rule" },
    { who: "claude", do: "deselect" },
    { who: "codex", at: 2.6, do: "draw", target: "about.card-0" },
    { who: "codex", do: "fill", target: "about.card-0", id: "c0" },
    { who: "codex", do: "deselect" },
    { who: "copilot", after: "c0", do: "duplicate", source: "about.card-0", target: "about.card-1", guides: [{ edge: "top", with: "about.card-0" }] },
    { who: "copilot", do: "fill", target: "about.card-1", id: "c1" },
    { who: "copilot", do: "deselect" },
    { who: "devin", after: "c1", do: "duplicate", source: "about.card-1", target: "about.card-2", guides: [{ edge: "top", with: "about.card-1" }] },
    { who: "devin", do: "fill", target: "about.card-2" },
    { who: "devin", do: "deselect" },
    { who: "*", do: "exit" },
  ],
};

const projects: Scene = {
  root: "#work",
  scroll: { trigger: "[data-build='projects.media']", start: "top 85%", end: "bottom 35%" },
  steps: [
    { who: "llama", do: "draw", target: "projects.media", drop: true },
    { who: "llama", do: "place", target: "projects.media", id: "media" },
    { who: "llama", do: "deselect" },
    { who: "llama", do: "rest", to: { x: 1.06, y: 0.3 } },
    { who: "deepseek", after: "media", do: "draw", target: "projects.thumb-0" },
    { who: "deepseek", do: "place", target: "projects.thumb-0" },
    { who: "deepseek", do: "duplicate", source: "projects.thumb-0", target: "projects.thumb-1" },
    { who: "deepseek", do: "duplicate", source: "projects.thumb-1", target: "projects.thumb-2" },
    { who: "deepseek", do: "deselect" },
    { who: "*", do: "exit" },
  ],
};

// Every agent shows up for the launch: a zero-length step enrolls the ones with no build work here.
const contact: Scene = {
  root: "#contact",
  chrome: "publish",
  scroll: { start: "top 80%", end: "max" },
  steps: [
    { who: "qwen", do: "draw", target: "contact.title" },
    { who: "qwen", do: "deselect" },
    { who: "mistral", at: 0.6, do: "draw", target: "contact.actions" },
    { who: "mistral", do: "deselect" },
    ...cursors.filter((c) => c.id !== "qwen" && c.id !== "mistral").map((c) => ({ who: c.id, do: "wait" as const, dur: 0 })),
    { who: "*", do: "publish" },
    { who: "*", do: "exit" },
  ],
};

export const scenes = [hero, about, projects, contact];
