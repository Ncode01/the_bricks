"use client";

import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward
} from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";

export function TransportControls() {
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const setPlaying = useEditorStore((state) => state.setPlaying);
  const playhead = useEditorStore((state) => state.playhead);
  const setPlayhead = useEditorStore((state) => state.setPlayhead);
  const sequence = useEditorStore((state) => state.sequence);

  const step = 1 / sequence.fps;

  return (
    <div className="transport-bar">
      <button
        type="button"
        className="editor-icon"
        onClick={() => setPlayhead(0)}
      >
        <SkipBack className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="editor-icon"
        onClick={() => setPlayhead(Math.max(0, playhead - step))}
      >
        <StepBack className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="editor-icon primary"
        onClick={() => setPlaying(!isPlaying)}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button
        type="button"
        className="editor-icon"
        onClick={() => setPlayhead(playhead + step)}
      >
        <StepForward className="h-4 w-4" />
      </button>
      <button type="button" className="editor-icon">
        <SkipForward className="h-4 w-4" />
      </button>
      <div className="transport-spacer" />
      <span className="label-tech">Playback {isPlaying ? "PLAY" : "STOP"}</span>
    </div>
  );
}
