"use client";

import { useDroppable } from "@dnd-kit/core";
import type { TimelineClip, Track } from "@/lib/editor/types";
import { TrackHeader } from "./track-header";
import { VideoClip } from "./video-clip";
import { AudioClip } from "./audio-clip";
import { useEditorStore } from "@/lib/editor/store";
import { useEffect } from "react";

export function TrackLane({
  track,
  clips,
  zoom
}: {
  track: Track;
  clips: TimelineClip[];
  zoom: number;
}) {
  const media = useEditorStore((state) => state.media);
  const { setNodeRef, isOver } = useDroppable({ id: track.id });
  const selectedClipId = useEditorStore((state) => state.selection.clipId);
  const selectedMediaId = useEditorStore((state) => state.selection.mediaId);
  const setSourceMediaId = useEditorStore((state) => state.setSourceMediaId);

  useEffect(() => {
    if (!selectedMediaId) {
      return;
    }

    setSourceMediaId(selectedMediaId);
  }, [selectedMediaId, setSourceMediaId]);

  return (
    <div className="timeline-track">
      <TrackHeader track={track} />
      <div
        ref={setNodeRef}
        className={isOver ? "timeline-track-body over" : "timeline-track-body"}
      >
        {clips.map((clip) => {
          const item = media.find((entry) => entry.id === clip.mediaId) ?? null;
          const isSelected = clip.id === selectedClipId;

          return track.type === "audio" ? (
            <AudioClip
              key={clip.id}
              clip={clip}
              media={item}
              zoom={zoom}
              selected={isSelected}
            />
          ) : (
            <VideoClip
              key={clip.id}
              clip={clip}
              media={item}
              zoom={zoom}
              selected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
}
