"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { profile } from "@/data/profile";
import { agents } from "@/data/agents";

const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

/** "on": the scroll-built page is running · "off": skipped this session · "na": phone or reduced motion. */
type Build = "on" | "off" | "na";

// The build toggle mirrors what the page is doing; the engine announces when it turns itself off.
function readBuild(): Build {
  let skipped = false;
  try {
    skipped = sessionStorage.getItem("swarm:skipped") === "1";
  } catch {}
  if (!matchMedia("(min-width: 640px) and (prefers-reduced-motion: no-preference)").matches) return "na";
  return skipped ? "off" : "on";
}
const subscribeBuild = (onChange: () => void) => {
  addEventListener("swarm:skipped", onChange);
  return () => removeEventListener("swarm:skipped", onChange);
};

/** A floating bar styled like a design file's top bar: file breadcrumb, sections, collaborators, Share. */
export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const build = useSyncExternalStore(subscribeBuild, readBuild, () => "na" as Build);
  const links = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["home", ...nav.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);


  // Slide the highlight under the section currently in view.
  useLayoutEffect(() => {
    // Measure the <li>: it is positioned, so the link's own offsetLeft would always be 0.
    const li = links.current[active]?.parentElement;
    setPill(li ? { x: li.offsetLeft, w: li.offsetWidth } : null);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const skip = () => window.dispatchEvent(new CustomEvent("swarm:skip"));
  const replay = () => {
    try {
      sessionStorage.removeItem("swarm:skipped");
    } catch {}
    window.scrollTo(0, 0);
    location.reload();
  };

  return (
    <header data-swarm-header className="fixed inset-x-0 top-3 z-50 px-3 sm:px-4">
      <div data-build="header.bar" className="hdr-bar mx-auto flex h-14 max-w-page items-center justify-between gap-4 rounded-xl border border-white/10 bg-ink-950/80 pl-2.5 pr-2 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <a href="#home" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span aria-hidden data-build="header.logo" className="hdr-pop grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-ink-900 text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 8a3 3 0 0 1 6 0" />
              <rect x="7" y="8" width="10" height="12" rx="5" />
              <path d="M12 12v8M10 5 8.5 3.5M14 5l1.5-1.5M7 13H4M20 13h-3M7.4 9.8 5 8M16.6 9.8 19 8M7.3 17 5 19M16.7 17l2.3 2" />
            </svg>
          </span>
          <span className="hdr-wipe truncate text-[14px]" data-build="header.name">
            <span className="text-fg">{profile.name}</span>
            <span className="hidden text-white/25 md:inline"> / </span>
            <span className="hidden font-mono text-[12px] text-muted md:inline">portfolio</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul data-build="header.nav" className="relative flex items-center rounded-lg bg-white/[0.03] p-1">
            {pill && (
              <span
                aria-hidden
                className="absolute inset-y-1 left-0 rounded-md bg-white/[0.09] transition-[transform,width] duration-300 ease-out"
                style={{ width: pill.w, transform: `translateX(${pill.x}px)` }}
              />
            )}
            {nav.map((n, i) => (
              <li key={n.id} data-build-part="item" className="hdr-drop relative" style={{ "--i": i } as React.CSSProperties}>
                <a
                  ref={(el) => {
                    links.current[n.id] = el;
                  }}
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "location" : undefined}
                  className="block rounded-md px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-fg aria-[current]:text-fg"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Collaborators, like the avatar stack in a design tool: the agents building the page. */}
          <ul aria-label="Agents working on this page" data-build="header.agents" className="mr-1 hidden items-center xl:flex">
            {agents.map((a, i) => (
              <li
                key={a.id}
                title={a.label}
                data-build-part="item"
                className="hdr-pop -ml-1.5 grid size-6 place-items-center rounded-full font-mono text-[10px] font-medium text-ink-950 ring-2 ring-ink-950 first:ml-0"
                style={{ background: a.color, zIndex: agents.length - i, "--i": i + 4 } as React.CSSProperties}
              >
                <span aria-hidden>{a.label[0]}</span>
                <span className="sr-only">{a.label}</span>
              </li>
            ))}
          </ul>
          {build !== "na" && (
            <button
              type="button"
              onClick={build === "on" ? skip : replay}
              data-build="header.toggle"
              className="hdr-rise hidden h-9 items-center gap-2 rounded-lg border border-white/12 px-3 font-mono text-[12px] text-fg/85 transition-colors hover:border-white/35 hover:text-fg sm:inline-flex"
            >
              {build === "on" ? (
                <>
                  Skip build <span aria-hidden>⏭</span>
                </>
              ) : (
                <>
                  Replay build <span aria-hidden>↺</span>
                </>
              )}
            </button>
          )}
          <a
            href={profile.cv}
            target="_blank"
            rel="noopener"
            data-build="header.cv"
            className="hdr-rise hidden h-9 items-center rounded-lg bg-select px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-[#2f74e8] sm:inline-flex"
          >
            CV
          </a>
          <button
            type="button"
            data-build="header.menu"
            className="hdr-rise inline-flex h-9 items-center rounded-lg border border-white/12 px-3 text-[13px] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Primary" hidden={!open} className="mx-auto mt-2 max-w-page rounded-xl border border-white/10 bg-ink-950 lg:hidden">
        <ul className="flex flex-col p-2">
          {nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-lg hover:bg-white/[0.04]">
                {n.label}
              </a>
            </li>
          ))}
          <li>
            <a href={profile.cv} target="_blank" rel="noopener" className="block rounded-lg px-3 py-3 text-lg text-accent hover:bg-white/[0.04]">
              CV (PDF)
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
