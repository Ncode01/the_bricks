"use client";

import { pixelsToTime, timeToPixels } from "@/lib/editor/timeline";
import { useEditorStore } from "@/lib/editor/store";

export function Playhead({
  playhead,
  zoom,
  scrollRef
}: {
  playhead: number;
  zoom: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const setPlayhead = useEditorStore((state) => state.setPlayhead);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) {
      return;
    }

    const rect = scrollRef.current.getBoundingClientRect();
    const update = (clientX: number) => {
      const offsetX =
        clientX - rect.left + scrollRef.current!.scrollLeft - 120;
      const next = pixelsToTime(Math.max(0, offsetX), zoom);
      setPlayhead(next);
    };

    update(event.clientX);

    const handleMove = (moveEvent: PointerEvent) => update(moveEvent.clientX);
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp, { once: true });
  };

  return (
    <div
      className="timeline-playhead"
      style={{ left: timeToPixels(playhead, zoom) + 120 }}
      onPointerDown={handlePointerDown}
    >
      <span className="timeline-playhead-handle" />
    </div>
  );
}
