"use client";

import { useEffect } from "react";
import { clamp } from "@/lib/editor/timeline";
import { useEditorStore } from "@/lib/editor/store";

export function usePlayback() {
  const isPlaying = useEditorStore((state) => state.isPlaying);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;

      const state = useEditorStore.getState();
      const duration = Math.max(
        10,
        ...state.clips.map((clip) => clip.end)
      );
      const next = clamp(state.playhead + delta, 0, duration);
      state.setPlayhead(next);

      if (next >= duration) {
        state.setPlaying(false);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);
}
