"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink-950/85 backdrop-blur-md">
      <div className="page flex h-16 items-center justify-between gap-6">
        <a href="#home" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span aria-hidden className="grid size-8 place-items-center rounded-[5px] border border-white/15 font-serif text-lg italic">
            a
          </span>
          <span className="text-[15px] font-medium tracking-tight">{profile.name}</span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "location" : undefined}
                  className="text-[14px] text-muted transition-colors hover:text-fg aria-[current]:text-fg"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("swarm:skip"))}
            className="hidden h-9 items-center gap-2 rounded-md border border-white/15 px-3 font-mono text-[12px] text-fg/90 transition-colors hover:border-white/40 [html[data-swarm=building]_&]:inline-flex"
          >
            Skip build <span aria-hidden>⏭</span>
          </button>
          <a
            href={profile.cv}
            target="_blank"
            rel="noopener"
            className="hidden h-9 items-center rounded-md bg-fg px-3 text-[13px] font-medium text-ink-950 transition-colors hover:bg-white sm:inline-flex"
          >
            Résumé
          </a>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-md border border-white/15 px-3 text-[13px] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Primary" hidden={!open} className="border-t border-line bg-ink-950 lg:hidden">
        <ul className="page flex flex-col py-3">
          {nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block py-3 text-lg">
                {n.label}
              </a>
            </li>
          ))}
          <li>
            <a href={profile.cv} target="_blank" rel="noopener" className="block py-3 text-lg text-accent">
              Résumé (PDF)
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
