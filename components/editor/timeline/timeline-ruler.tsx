"use client";

import { useMemo } from "react";
import {
  formatTimecode,
  pixelsToTime,
  timeToPixels
} from "@/lib/editor/timeline";
import { useEditorStore } from "@/lib/editor/store";
import type { Marker } from "@/lib/editor/types";

export function TimelineRuler({
  duration,
  zoom,
  scrollRef,
  markers
}: {
  duration: number;
  zoom: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  markers: Marker[];
}) {
  const sequence = useEditorStore((state) => state.sequence);
  const setPlayhead = useEditorStore((state) => state.setPlayhead);

  const ticks = useMemo(() => {
    const list: { time: number; major: boolean }[] = [];
    const step = 1;
    for (let t = 0; t <= duration; t += step) {
      list.push({ time: t, major: t % 5 === 0 });
    }
    return list;
  }, [duration]);

  const handleSeek = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) {
      return;
    }
    const rect = scrollRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left + scrollRef.current.scrollLeft - 120;
    const time = pixelsToTime(Math.max(0, offsetX), zoom);
    setPlayhead(time);
  };

  return (
    <div className="timeline-ruler" onPointerDown={handleSeek}>
      <div className="timeline-ruler-label label-tech">Timecode</div>
      {ticks.map((tick) => (
        <div
          key={tick.time}
          className={tick.major ? "ruler-tick major" : "ruler-tick"}
          style={{ left: timeToPixels(tick.time, zoom) + 120 }}
        >
          {tick.major ? (
            <span className="ruler-label">
              {formatTimecode(tick.time, sequence.fps)}
            </span>
          ) : null}
        </div>
      ))}
      {markers.map((marker) => (
        <button
          key={marker.id}
          type="button"
          className={marker.tone === "violet" ? "ruler-marker ruler-marker-violet" : "ruler-marker"}
          style={{ left: timeToPixels(marker.time, zoom) + 120 }}
          onPointerDown={(event) => {
            event.stopPropagation();
            setPlayhead(marker.time);
          }}
        >
          <span className="ruler-marker-label">{marker.label}</span>
        </button>
      ))}
    </div>
  );
}
