'use client';

import React from "react";

import { BallCanvas } from "@/components/canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "@/utils/const";

const Tech = () => {
  return (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {technologies.slice(0, 14).map((technology) => (
        <div className='w-28 h-28' key={technology.name}>
          <BallCanvas icon={technology.icon.src} />
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech);
