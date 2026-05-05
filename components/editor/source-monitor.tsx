"use client";

import { useMemo } from "react";
import { useEditorStore } from "@/lib/editor/store";
import { formatTimecode } from "@/lib/editor/timeline";

export function SourceMonitor() {
  const media = useEditorStore((state) => state.media);
  const sourceMediaId = useEditorStore((state) => state.sourceMediaId);
  const sequence = useEditorStore((state) => state.sequence);

  const activeMedia = useMemo(
    () => media.find((item) => item.id === sourceMediaId) ?? null,
    [media, sourceMediaId]
  );

  return (
    <div className="editor-panel">
      <div className="editor-panel-header">
        <span className="label-tech">Source: {activeMedia?.name ?? "—"}</span>
      </div>
      <div className="editor-monitor">
        {!activeMedia ? (
          <div className="editor-empty">Select a bin item to preview.</div>
        ) : activeMedia.type === "image" ? (
          <img
            src={activeMedia.src}
            alt={activeMedia.name}
            className="monitor-media"
          />
        ) : activeMedia.type === "audio" ? (
          <audio src={activeMedia.src} controls className="monitor-media" />
        ) : (
          <video
            src={activeMedia.src}
            controls
            className="monitor-media"
          />
        )}
      </div>
      <div className="editor-panel-footer">
        <span className="label-tech">SRC</span>
        <span className="label-tech">
          {activeMedia ? formatTimecode(activeMedia.duration, sequence.fps) : formatTimecode(0, sequence.fps)}
        </span>
      </div>
    </div>
  );
}
