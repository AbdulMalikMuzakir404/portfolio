import { roles } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { skillGroups } from "@/data/skills";
import { projects } from "@/data/projects";
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
    { who: "codex", do: "rest", to: { x: 0.47, y: 0.11 } },

    // Gemini sets the headline small, scales it to display size, then snaps it onto the name's edge.
    { who: "gemini", at: 1.2, do: "tool", tool: "text" },
    { who: "gemini", do: "appear", target: "hero.headline", offset: { x: 110, y: 70 }, scale: 0.4 },
    { who: "gemini", do: "scale", target: "hero.headline", say: "Scaling to display size" },
    { who: "gemini", do: "drag", target: "hero.headline", guides: [{ edge: "left", with: "hero.name" }] },
    { who: "gemini", do: "deselect", id: "headline" },
    { who: "gemini", do: "rest", to: { x: 0.53, y: 0.64 } },

    // Qwen reviews the type.
    {
      who: "qwen",
      after: "headline",
      do: "thread",
      target: "hero.headline",
      messages: [
        { who: "qwen", text: "Tight leading reads well" },
        { who: "gemini", text: "Snapped it to the name's left edge" },
        { who: "claude", text: "Love it. Shipping the type 🚢" },
      ],
    },
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
    {
      who: "grok",
      after: "cta2",
      do: "thread",
      target: "hero.cta2",
      messages: [
        { who: "grok", text: "Contrast passes AA ✓" },
        { who: "devin", text: "Primary drawn from the rect tool" },
        { who: "mistral", text: "CV button is a duplicate, restyled" },
      ],
    },

    { who: "*", do: "exit" },
  ],
};


/**
 * Section headings, each built a different way: the mono kicker is typed, the title revealed,
 * the divider drawn, scrubbed while the heading block crosses the screen.
 */
function heading(id: string, lead: string, helper: string, reveal: "draw" | "write" | "appear"): Scene {
  const title = `${id}.title`;
  const build: Scene["steps"] =
    reveal === "appear"
      ? [
          { who: lead, do: "appear", target: title, offset: { x: 90, y: 40 }, scale: 0.5 },
          { who: lead, do: "scale", target: title, say: "Scaling the title" },
          { who: lead, do: "drag", target: title, guides: [{ edge: "left", with: `${id}.kicker` }] },
        ]
      : [{ who: lead, do: reveal, target: title, say: reveal === "write" ? "Writing the title" : undefined }];
  return {
    root: `[data-swarm-row='heading-${id}']`,
    scroll: { start: "top 100%", end: "top 15%" },
    steps: [
      { who: lead, do: "type", target: `${id}.kicker` },
      ...build,
      { who: lead, do: "deselect" },
      { who: helper, at: 0.5, do: "line", target: `${id}.rule` },
      { who: "*", do: "exit" },
    ],
  };
}

const headings = {
  about: heading("about", "claude", "gemini", "draw"),
  skills: heading("skills", "mistral", "codex", "write"),
  experience: heading("experience", "copilot", "deepseek", "appear"),
  work: heading("work", "llama", "qwen", "draw"),
  credentials: heading("credentials", "devin", "claude", "write"),
};

const about: Scene = {
  root: "[data-swarm-row='about-intro']",
  scroll: { start: "top 100%", end: "bottom 20%" },
  steps: [
    { who: "codex", do: "write", target: "about.summary", say: "Writing the summary" },
    { who: "mistral", at: 0.4, do: "stamp", target: "about.facts" },
    {
      who: "claude",
      at: 1.6,
      do: "thread",
      target: "about.summary",
      messages: [
        { who: "claude", text: "Summary is word for word from the CV" },
        { who: "codex", text: "Kept the line length comfortable" },
        { who: "mistral", text: "Facts column on the 12-col grid ✓" },
      ],
    },
    { who: "*", do: "exit" },
  ],
};

const aboutCards: Scene = {
  root: "[data-swarm-row='about-cards']",
  scroll: { start: "top 100%", end: "bottom 28%" },
  steps: [
    { who: "codex", do: "draw", target: "about.card-0" },
    { who: "codex", do: "fill", target: "about.card-0", id: "c0" },
    { who: "codex", do: "deselect" },
    { who: "copilot", after: "c0", do: "duplicate", source: "about.card-0", target: "about.card-1", guides: [{ edge: "top", with: "about.card-0" }] },
    { who: "copilot", do: "fill", target: "about.card-1", id: "c1" },
    { who: "copilot", do: "deselect" },
    { who: "devin", after: "c1", do: "duplicate", source: "about.card-1", target: "about.card-2", guides: [{ edge: "top", with: "about.card-1" }] },
    { who: "devin", do: "fill", target: "about.card-2", id: "c2" },
    { who: "devin", do: "deselect" },
    {
      who: "devin",
      after: "c2",
      do: "thread",
      target: "about.card-2",
      messages: [
        { who: "devin", text: "Three principles, one component" },
        { who: "copilot", text: "Instances stay in sync ✓" },
      ],
    },
    { who: "*", do: "exit" },
  ],
};

const aboutMore: Scene = {
  root: "[data-swarm-row='about-more']",
  scroll: { start: "top 100%", end: "bottom 28%" },
  steps: [
    { who: "qwen", do: "stamp", target: "about.hobbies", say: "Adding hobbies" },
    { who: "llama", at: 0.3, do: "import", target: "about.book", from: { x: -120, y: 40 } },
    { who: "llama", do: "deselect" },
    { who: "deepseek", at: 0.6, do: "import", target: "about.pin", from: { x: -90, y: -60 }, say: "Pinning Bandung" },
    { who: "deepseek", do: "deselect", id: "pin" },
    {
      who: "grok",
      after: "pin",
      do: "thread",
      target: "about.pin",
      messages: [
        { who: "grok", text: "Pin is on Bandung 📍" },
        { who: "deepseek", text: "Same city as the CV ✓" },
        { who: "llama", text: "Book cover placed — Atomic Habits" },
      ],
    },
    { who: "*", do: "exit" },
  ],
};

// One scene per featured project, each built a different way.
type Crew = Record<string, string>;
const caseScenes: Scene[] = projects
  .filter((p) => p.featured)
  .map((p, i): Scene => {
    const c = `case-${i}`;
    const steps: Scene["steps"] = [];
    const add = (...xs: Scene["steps"]) => steps.push(...xs);
    const crews: Crew[] = [
      { a: "llama", b: "deepseek", c: "claude" },
      { a: "gemini", b: "qwen", c: "codex" },
      { a: "mistral", b: "devin", c: "codex" },
      { a: "copilot", b: "gemini", c: "claude" },
      { a: "devin", b: "mistral", c: "grok" },
    ];
    const { a, b, c: lead } = crews[i % crews.length];
    add({ who: lead, do: "highlight", target: `${c}.title` });
    if (p.media === "phone") {
      // Phones are handed up into place, or drawn as frames and filled, alternating by case.
      const phoneCrew = i % 2 ? [a, b, "copilot", "grok"] : [a, b, lead];
      phoneCrew.forEach((who, j) =>
        i % 2
          ? add({ who, at: 0.15 * j, do: "import", target: `${c}.phone-${j}`, from: { x: 0, y: 140 } }, { who, do: "deselect" })
          : add({ who, at: 0.2 * j, do: "draw", target: `${c}.phone-${j}` }, { who, do: "place", target: `${c}.phone-${j}` }, { who, do: "deselect" }),
      );
      add({ who: "llama", at: 0.9, do: i % 2 ? "draw" : "import", target: `${c}.wide`, ...(i % 2 ? { drop: true } : { from: { x: 140, y: 60 } }) } as Scene["steps"][number]);
      if (i % 2) add({ who: "llama", do: "place", target: `${c}.wide` });
      add({ who: "llama", do: "deselect", id: `${c}-media` });
    } else if (i === 0) {
      add(
        { who: a, do: "draw", target: `${c}.media`, drop: true },
        { who: a, do: "place", target: `${c}.media`, id: `${c}-media` },
        { who: a, do: "deselect" },
        { who: b, after: `${c}-media`, do: "draw", target: `${c}.thumb-0` },
        { who: b, do: "place", target: `${c}.thumb-0` },
        { who: b, do: "duplicate", source: `${c}.thumb-0`, target: `${c}.thumb-1` },
        { who: b, do: "duplicate", source: `${c}.thumb-1`, target: `${c}.thumb-2` },
        { who: b, do: "deselect" },
      );
    } else if (i % 2 === 0) {
      // Draw the lead short, drop the image, then resize it to 16:10; thumbs are handed in.
      add(
        { who: a, do: "draw", target: `${c}.media`, until: 0.7, drop: true },
        { who: a, do: "place", target: `${c}.media` },
        { who: a, do: "resize", target: `${c}.media`, from: 0.7, say: "Resizing to 16:10" },
        { who: a, do: "deselect", id: `${c}-media` },
        ...[0, 1, 2].flatMap((j) => [
          { who: b, after: `${c}-media`, do: "import" as const, target: `${c}.thumb-${j}`, from: { x: 0, y: 90 } },
          { who: b, do: "deselect" as const },
        ]),
      );
    } else {
      // Import the lead from the left, then build the thumbs as one component.
      add(
        { who: a, do: "import", target: `${c}.media`, from: { x: -160, y: 0 }, say: "Importing the dashboard" },
        { who: a, do: "deselect", id: `${c}-media` },
        { who: b, after: `${c}-media`, do: "draw", target: `${c}.thumb-0` },
        { who: b, do: "place", target: `${c}.thumb-0` },
        { who: b, do: "duplicate", source: `${c}.thumb-0`, target: `${c}.thumb-1` },
        { who: b, do: "duplicate", source: `${c}.thumb-1`, target: `${c}.thumb-2` },
        { who: b, do: "deselect" },
      );
    }
    add({ who: lead, at: 0.8, do: "stamp", target: `${c}.tech` });
    const talk: { who: string; text: string }[][] = [
      [
        { who: a, text: "Lead shot anchored to the top of the page" },
        { who: b, text: "Thumbs are one component, duplicated" },
      ],
      [
        { who: b, text: "Phones keep their 9:20 ratio" },
        { who: "grok", text: "Every other one drops for rhythm" },
        { who: "llama", text: "Admin web screen below ✓" },
      ],
      [
        { who: a, text: "Lead resized to 16:10" },
        { who: b, text: "Thumbs snapped to the grid ✓" },
      ],
      [
        { who: a, text: "Dashboard shot pulled in" },
        { who: lead, text: "Tags come from the project data ✓" },
      ],
      [
        { who: a, text: "Repo links point to the public GitHub" },
        { who: b, text: "Both checked ✓" },
      ],
    ];
    add({ who: talk[i % talk.length][0].who, after: `${c}-media`, do: "thread", target: `${c}.title`, messages: talk[i % talk.length] });
    add({ who: "*", do: "exit" });
    return { root: `[data-swarm-row='${c}']`, scroll: { start: "top 100%", end: "bottom 35%" }, steps };
  });

// The compact list gets dragged into order, alternating sides.
const moreList: Scene = {
  root: "[data-swarm-row='more']",
  scroll: { start: "top 100%", end: "bottom 30%" },
  steps: [
    ...projects
      .filter((p) => !p.featured)
      .flatMap((_, j) => {
        const who = ["llama", "gemini", "codex"][j % 3];
        return [
          { who, at: j * 0.35, do: "import" as const, target: `more.row-${j}`, from: { x: j % 2 ? 90 : -90, y: 0 } },
          { who, do: "deselect" as const },
        ];
      }),
    {
      who: "mistral",
      at: 1.2,
      do: "thread",
      target: "more.row-0",
      messages: [
        { who: "mistral", text: "Sorted newest first" },
        { who: "codex", text: "Tap + for screenshots and the full story" },
      ],
    },
    { who: "*", do: "exit" },
  ],
};

// Six agents each frame one component set, then stamp its instances in.
const skillCrew = ["codex", "gemini", "deepseek", "copilot", "llama", "devin"];
const skills: Scene = {
  root: "[data-swarm-row='skills-sets']",
  scroll: { start: "top 95%", end: "bottom 45%" },
  steps: [
    ...skillGroups.flatMap((g, i) => {
      const who = skillCrew[i % skillCrew.length];
      const target = `skills.group-${g.id}`;
      return [
        { who, at: (i % 3) * 0.25 + Math.floor(i / 3) * 1.2, do: "draw" as const, target },
        { who, do: "stamp" as const, target, id: `skill-${i}` },
        { who, do: "deselect" as const },
      ];
    }),
    {
      who: "grok",
      after: "skill-2",
      do: "thread",
      target: "skills.group-distributed",
      messages: [
        { who: "grok", text: "Real stack, no % bars" },
        { who: "deepseek", text: "Kafka + CDC straight from the CV" },
        { who: "codex", text: "Sets read like a design system ✓" },
      ],
    },
    { who: "*", do: "exit" },
  ],
};

// Each role is its own short scene, so the work happens while that row is on screen.
const roleCrew = [
  ["claude", "devin"],
  ["codex", "mistral"],
  ["gemini", "qwen"],
  ["llama", "grok"],
];
const experienceRows: Scene[] = roles.map((_, i) => {
  const [lead, helper] = roleCrew[i % roleCrew.length];
  return {
    root: `[data-swarm-row='experience-${i}']`,
    scroll: { start: "top 100%", end: "bottom 28%" },
    steps: [
      { who: lead, do: "highlight", target: `experience.role-${i}` },
      { who: lead, do: "fill", target: `experience.points-${i}`, id: "points" },
      { who: helper, at: 0.6, do: "stamp", target: `experience.stack-${i}`, id: "stack" },
      ...(i === 0
        ? [
            {
              who: lead,
              after: "points",
              do: "thread" as const,
              target: `experience.role-${i}`,
              messages: [
                { who: lead, text: "Bullets are verbatim from the CV" },
                { who: helper, text: "Stack chips match the role ✓" },
              ],
            },
          ]
        : []),
      { who: "*", do: "exit" },
    ],
  };
});

// Heading and education share one scene; each certificate row gets its own.
const credentials: Scene = {
  root: "[data-swarm-row='edu']",
  scroll: { start: "top 100%", end: "bottom 20%" },
  steps: [
    { who: "gemini", do: "draw", target: "edu.0" },
    { who: "gemini", do: "fill", target: "edu.0", id: "edu0" },
    { who: "gemini", do: "deselect" },
    { who: "copilot", after: "edu0", do: "duplicate", source: "edu.0", target: "edu.1", guides: [{ edge: "top", with: "edu.0" }] },
    { who: "copilot", do: "fill", target: "edu.1", id: "edu1" },
    { who: "copilot", do: "deselect" },
    {
      who: "gemini",
      after: "edu1",
      do: "thread",
      target: "edu.0",
      messages: [
        { who: "gemini", text: "Degree in progress, 2025 — 2027" },
        { who: "copilot", text: "Matches the CV ✓" },
      ],
    },
    { who: "*", do: "exit" },
  ],
};
const certCrew = [
  ["deepseek", "copilot"],
  ["qwen", "claude"],
  ["mistral", "codex"],
  ["devin", "gemini"],
  ["grok", "llama"],
];
const certRows: Scene[] = certifications.map((_, i) => {
  const [importer, stamper] = certCrew[i % certCrew.length];
  return {
    root: `[data-swarm-row='cert-${i}']`,
    scroll: { start: "top 100%", end: "bottom 28%" },
    steps: [
      { who: importer, do: "import", target: `cert.image-${i}`, from: { x: 110, y: 40 }, guides: [{ edge: "top", with: `cert.title-${i}` }] },
      { who: importer, do: "deselect" },
      { who: stamper, at: 0.4, do: "stamp", target: `cert.highlights-${i}` },
      { who: "*", do: "exit" },
    ],
  };
});

// Every agent shows up for the launch: a zero-length step enrolls the ones with no build work here.
// The extra certifications and the honor: stamped in, highlighted, talked over.
const cvMore: Scene = {
  root: "[data-swarm-row='cv-more']",
  scroll: { start: "top 100%", end: "bottom 25%" },
  steps: [
    { who: "codex", at: 0.4, do: "stamp", target: "cv.more", say: "Adding the rest of the CV" },
    { who: "grok", at: 0.9, do: "highlight", target: "cv.honor-0", id: "honor" },
    {
      who: "grok",
      after: "honor",
      do: "thread",
      target: "cv.honor-0",
      messages: [
        { who: "grok", text: "3rd place, straight from the CV 🏆" },
        { who: "claude", text: "Gave honors their own column" },
        { who: "codex", text: "HackerRank badges listed too ✓" },
      ],
    },
    { who: "*", do: "exit" },
  ],
};

// The finale.
const contact: Scene = {
  root: "#contact",
  chrome: "publish",
  // Scrubbed like the others. It is the last section, so the range runs to the end of the page;
  // the extra bottom padding (globals.css) leaves room to scroll through the whole build.
  scroll: { start: "top 60%", end: "max" },
  steps: [
    { who: "qwen", do: "write", target: "contact.title", id: "title", say: "Writing the headline" },
    { who: "qwen", do: "rest", to: { x: 0.6, y: 0.2 } },
    { who: "gemini", after: "title", do: "highlight", target: "contact.accent", say: "Accent on “amazing”" },
    // Publish right after the headline, while it (and the button beside it) is on screen.
    ...cursors.map((c) => ({ who: c.id, do: "wait" as const, dur: 0 })),
    { who: "*", do: "publish", id: "published" },
    { who: "mistral", do: "stamp", target: "contact.actions", say: "Wiring email, WhatsApp, phone, CV", id: "actions" },
    { who: "devin", after: "actions", do: "stamp", target: "contact.socials", id: "socials" },
    {
      who: "claude",
      after: "socials",
      do: "thread",
      target: "contact.actions",
      messages: [
        { who: "claude", text: "Every link goes to a real profile" },
        { who: "gemini", text: "Email, WhatsApp and CV wired ✓" },
        { who: "grok", text: "Ready when you are 🚀" },
      ],
    },
    // No exit: the swarm settles under the social links and keeps orbiting there.
    { who: "*", do: "orbit", center: { x: 0.8, y: 0.38 } },
  ],
};

export const scenes = [
  hero,
  headings.about,
  about,
  aboutCards,
  aboutMore,
  headings.skills,
  skills,
  headings.experience,
  ...experienceRows,
  headings.work,
  ...caseScenes,
  moreList,
  headings.credentials,
  credentials,
  ...certRows,
  cvMore,
  contact,
];
