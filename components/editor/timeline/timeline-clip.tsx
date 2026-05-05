"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/lib/editor/store";
import { clamp, timeToPixels } from "@/lib/editor/timeline";
import type { MediaItem, TimelineClip } from "@/lib/editor/types";

function formatDuration(value: number) {
  const total = Math.max(0, Math.floor(value));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TimelineClip({
  clip,
  media,
  zoom,
  selected,
  tone,
  children
}: {
  clip: TimelineClip;
  media: MediaItem | null;
  zoom: number;
  selected: boolean;
  tone: "video" | "audio";
  children?: React.ReactNode;
}) {
  const selectClip = useEditorStore((state) => state.selectClip);
  const trimClip = useEditorStore((state) => state.trimClip);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: clip.id,
      data: { type: "clip", clipId: clip.id, start: clip.start }
    });

  const duration = clip.end - clip.start;
  const width = timeToPixels(duration, zoom);
  const left = timeToPixels(clip.start, zoom) + 120;

  const style = {
    width,
    left,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.7 : 1
  } as React.CSSProperties;

  const handleTrim = (edge: "start" | "end") =>
    (event: React.PointerEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const initialStart = clip.start;
      const initialEnd = clip.end;
      const initialIn = clip.inPoint;
      const initialOut = clip.outPoint;
      const minDuration = 0.5;

      const handleMove = (moveEvent: PointerEvent) => {
        const delta = (moveEvent.clientX - startX) / zoom;
        if (edge === "start") {
          const nextStart = clamp(
            initialStart + delta,
            0,
            initialEnd - minDuration
          );
          const nextIn = clamp(
            initialIn + delta,
            0,
            initialOut - minDuration
          );
          trimClip({ clipId: clip.id, start: nextStart, inPoint: nextIn });
        } else {
          const nextEnd = clamp(
            initialEnd + delta,
            initialStart + minDuration,
            initialStart + 9999
          );
          const nextOut = clamp(
            initialOut + delta,
            initialIn + minDuration,
            initialIn + 9999
          );
          trimClip({ clipId: clip.id, end: nextEnd, outPoint: nextOut });
        }
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp, { once: true });
    };

  return (
    <div
      ref={setNodeRef}
      className={
        selected
          ? `clip-brick clip-${tone} clip-selected`
          : `clip-brick clip-${tone}`
      }
      style={style}
      onClick={() => selectClip(clip.id)}
      onDoubleClick={() => selectClip(clip.id)}
      {...attributes}
      {...listeners}
    >
      <span className="clip-handle clip-handle-left" onPointerDown={handleTrim("start")} />
      <span className="clip-handle clip-handle-right" onPointerDown={handleTrim("end")} />
      <div className="clip-header">
        <span className="label-tech">{tone === "audio" ? "AUD" : "VID"}</span>
        <span className="clip-title">{clip.meta?.label ?? clip.name}</span>
        <span className="clip-duration">{formatDuration(clip.end - clip.start)}</span>
      </div>
      <div className="clip-body">
        {children}
        {!children && media?.thumbnail ? (
          <div
            className="clip-thumb"
            style={{ backgroundImage: `url(${media.thumbnail})` }}
          />
        ) : null}
        {clip.meta?.subtitle ? <div className="clip-subtitle">{clip.meta.subtitle}</div> : null}
      </div>
    </div>
  );
}
