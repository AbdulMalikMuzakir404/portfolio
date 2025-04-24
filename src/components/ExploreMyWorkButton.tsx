"use client";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import { BackgroundGradient } from "./ui/BackgroundGradient";

export const ExploreMyWorkButton = () => {
  return (
    <BackgroundGradient rounded="rounded-xl">
      <button
        onClick={() => {
          const el = document.getElementById("certificates");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
        className="inline-flex items-center gap-2 border border-white/15 px-6 h-12 rounded-xl"
      >
        <span className="font-semibold">Explore My Work</span>
        <ArrowDown className="size-4" />
      </button>
    </BackgroundGradient>
  );
};
