"use client";

import { MotionConfig } from "motion/react";
import { motionDefaults } from "@/lib/animation";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={motionDefaults}>
      {children}
    </MotionConfig>
  );
}
