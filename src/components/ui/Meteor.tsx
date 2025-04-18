"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [delays, setDelays] = useState<number[]>([]);
  const [durations, setDurations] = useState<number[]>([]);

  useEffect(() => {
    const count = number || 20;
    const randomDelays = Array.from({ length: count }, () => Math.random() * 5);
    const randomDurations = Array.from({ length: count }, () =>
      Math.floor(Math.random() * (10 - 5) + 5)
    );
    setDelays(randomDelays);
    setDurations(randomDurations);
  }, [number]);

  if (delays.length === 0 || durations.length === 0) return null; // Hindari render saat initial SSR

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {delays.map((delay, idx) => {
        const meteorCount = number || 20;
        const position = idx * (800 / meteorCount) - 400;

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-40px",
              left: `${position}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${durations[idx]}s`,
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};
