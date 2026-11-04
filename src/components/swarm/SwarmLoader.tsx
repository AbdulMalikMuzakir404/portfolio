"use client";

import { useEffect } from "react";

/** Loads the swarm engine only when the pre-paint boot script opted in (see app/layout.tsx). */
export function SwarmLoader() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("swarm")) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import("@/lib/swarm")
      .then((m) => {
        if (!cancelled) dispose = m.startSwarm();
      })
      .catch(() => html.classList.remove("swarm"));
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);
  return null;
}
