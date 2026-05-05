"use client";

import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

export function Waveform({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      height: 32,
      waveColor: "rgba(42, 159, 214, 0.4)",
      progressColor: "rgba(42, 159, 214, 0.8)",
      cursorWidth: 0,
      normalize: true,
      interact: false,
      url
    });

    return () => waveSurfer.destroy();
  }, [url]);

  return <div ref={containerRef} className="timeline-waveform" />;
}
