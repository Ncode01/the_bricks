"use client";

import { useMemo } from "react";
import { useEditorStore } from "@/lib/editor/store";
import { formatTimecode } from "@/lib/editor/timeline";

export function StatusBar({ onExport }: { onExport: () => void }) {
  const sequence = useEditorStore((state) => state.sequence);
  const playhead = useEditorStore((state) => state.playhead);
  const zoom = useEditorStore((state) => state.zoom);
  const clips = useEditorStore((state) => state.clips);
  const selection = useEditorStore((state) => state.selection);

  const selectedClip = useMemo(
    () => clips.find((clip) => clip.id === selection.clipId),
    [clips, selection.clipId]
  );

  return (
    <footer className="editor-status">
      <div className="editor-status-left">
        <span className="label-tech">READY</span>
        <span>{sequence.width}x{sequence.height}</span>
        <span>{sequence.fps} FPS</span>
        <span>Zoom {Math.round(zoom)}%</span>
      </div>
      <div className="editor-status-center">
        <span className="label-tech">TC {formatTimecode(playhead, sequence.fps)}</span>
      </div>
      <div className="editor-status-right">
        <span className="label-tech">
          {selectedClip ? `CLIP ${selectedClip.name}` : "NO CLIP"}
        </span>
        <button type="button" className="editor-button" onClick={onExport}>
          Render / Inquiry
        </button>
      </div>
    </footer>
  );
}
