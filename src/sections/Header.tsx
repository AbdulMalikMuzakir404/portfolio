"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { navItems } from "@/utils/const";

export const Header = () => {
  const [activeLink, setActiveLink] = useState("home");
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          const topMostEntry = visibleEntries[0];
          setActiveLink(topMostEntry.target.id.replace("-anchor", ""));
        }
      },
      {
        threshold: 0.6,
      }
    );

    navItems.forEach((item) => {
      const anchorElement = document.getElementById(`${item.id}-anchor`);
      if (anchorElement) observer.observe(anchorElement);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex justify-center items-center fixed top-3 w-full z-[999]">
      <nav className="flex gap-1 p-1 border border-white/15 rounded-full bg-white/5 backdrop-blur relative">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            ref={(el) => {
              itemRefs.current[item.id] = el;
            }}
            onClick={() => setActiveLink(item.id)}
            className={`relative px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
              activeLink === item.id
                ? "text-gray-900"
                : "text-white hover:bg-white/20"
            }`}
          >
            {activeLink === item.id && (
              <motion.div
                layoutId="pill"
                className="absolute inset-0 bg-white rounded-full z-[-1]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};
