"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const Header = () => {
  const [activeLink, setActiveLink] = useState("home");
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex justify-center items-center fixed top-3 w-full z-10">
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