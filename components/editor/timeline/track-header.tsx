"use client";

import { Eye, Lock, Volume2 } from "lucide-react";
import type { Track } from "@/lib/editor/types";
import { useEditorStore } from "@/lib/editor/store";

export function TrackHeader({ track }: { track: Track }) {
  const toggleTrackState = useEditorStore((state) => state.toggleTrackState);

  return (
    <div className="timeline-track-header">
      <div className="track-header-top">
        <div className="track-header-icons">
          <button
            type="button"
            className={track.locked ? "track-btn active" : "track-btn"}
            onClick={() => toggleTrackState(track.id, "locked")}
            aria-label="Lock track"
          >
            <Lock className="h-3 w-3" />
          </button>
          <button
            type="button"
            className={track.visible ? "track-btn" : "track-btn active"}
            onClick={() => toggleTrackState(track.id, "visible")}
            aria-label="Toggle visibility"
          >
            {track.type === "audio" ? <Volume2 className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </button>
        </div>
        <span className="track-name">{track.name}</span>
      </div>
      <div className="track-controls">
        <button
          type="button"
          className={track.muted ? "track-btn active" : "track-btn"}
          onClick={() => toggleTrackState(track.id, "muted")}
        >
          M
        </button>
        <button
          type="button"
          className={track.solo ? "track-btn active" : "track-btn"}
          onClick={() => toggleTrackState(track.id, "solo")}
        >
          S
        </button>
      </div>
    </div>
  );
}
