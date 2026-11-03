export type Pt = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Tool = "move" | "frame" | "rect" | "text" | "image";

export type CursorSpec = {
  id: string;
  label: string;
  color: string;
  /** Off-canvas point (fraction of the scene root) where the cursor enters and leaves. */
  exit: Pt;
};

/** Alignment guide shown while an element settles: a line through `edge` of the target and `with`. */
export type Guide = { edge: "left" | "top"; with: string };

/** One cursor action. `target`/`source` are `data-build` ids inside the scene root. */
export type Task =
  | { do: "tool"; tool: Tool }
  | { do: "type"; target: string }
  | { do: "draw"; target: string; until?: number; drop?: boolean }
  | { do: "place"; target: string }
  | { do: "resize"; target: string; from: number }
  | { do: "appear"; target: string; offset: Pt; scale: number }
  | { do: "scale"; target: string }
  | { do: "drag"; target: string; guides?: Guide[] }
  | { do: "duplicate"; source: string; target: string; guides?: Guide[] }
  | { do: "fill"; target: string }
  | { do: "line"; target: string }
  | { do: "select"; target: string }
  /** Drop a review comment pin with a short note on the target. */
  | { do: "comment"; target: string; text: string }
  | { do: "deselect" }
  | { do: "wait"; dur: number }
  /** Park somewhere out of the way (fraction of the root) so idle cursors never cover content. */
  | { do: "rest"; to: Pt }
  | { do: "exit" }
  | { do: "publish" };

export type Step = Task & {
  /** Cursor id, or "*" for a whole-swarm action (exit, publish). */
  who: string;
  /** Earliest start, in timeline units. */
  at?: number;
  /** Start after the step with this id has finished. */
  after?: string;
  id?: string;
  /** Cursor-chat bubble shown next to the cursor while this step runs. */
  say?: string;
};

export type Scene = {
  root: string;
  steps: Step[];
  chrome?: "editor" | "publish";
  /** Where cursors sit at progress 0 (fractions of the root). Defaults to their exit points. */
  start?: Record<string, Pt>;
  scroll: {
    /** Element that drives the ScrollTrigger; defaults to the root. */
    trigger?: string;
    start: string;
    end: string;
    /** Pin length in viewport heights, per breakpoint. Omit for unpinned scenes. */
    pin?: { desktop: number; tablet: number };
  };
};
