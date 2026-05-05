"use client";

import { useEffect, useMemo, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { ProgramComposition } from "./remotion/program-composition";
import { useEditorStore } from "@/lib/editor/store";
import { clamp, formatTimecode } from "@/lib/editor/timeline";
import { getPortfolioSequence } from "@/lib/editor/portfolio-data";

export function ProgramMonitor() {
  const sequence = useEditorStore((state) => state.sequence);
  const media = useEditorStore((state) => state.media);
  const clips = useEditorStore((state) => state.clips);
  const selection = useEditorStore((state) => state.selection);
  const playhead = useEditorStore((state) => state.playhead);
  const activeSequenceId = useEditorStore((state) => state.activeSequenceId);

  const activeClip = useMemo(() => {
    if (selection.clipId) {
      return clips.find((clip) => clip.id === selection.clipId) ?? null;
    }

    return (
      clips.find((clip) => playhead >= clip.start && playhead <= clip.end) ??
      clips[0] ??
      null
    );
  }, [clips, playhead, selection.clipId]);

  const activeMedia = useMemo(() => {
    if (!activeClip) {
      return null;
    }

    return media.find((item) => item.id === activeClip.mediaId) ?? null;
  }, [activeClip, media]);

  const sequenceData = getPortfolioSequence(activeSequenceId);

  const activeSection = useMemo(() => {
    if (!activeClip) {
      return null;
    }
    return activeClip.meta ?? null;
  }, [activeClip]);

  const activeSummary = activeSection?.description ?? activeSection?.summary ?? activeClip?.name ?? "";

  const durationSeconds = activeClip
    ? Math.max(1, activeClip.end - activeClip.start)
    : 5;
  const durationInFrames = Math.ceil(durationSeconds * sequence.fps);
  const frame = activeClip
    ? Math.floor((playhead - activeClip.start) * sequence.fps)
    : 0;
  const clampedFrame = clamp(frame, 0, durationInFrames - 1);

  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }
    playerRef.current.seekTo(clampedFrame);
  }, [clampedFrame]);

  return (
    <div className="editor-panel">
      <div className="editor-panel-header">
        <span className="label-tech">Program: {sequence.name}</span>
        <span className="label-tech text-ink-muted">{activeClip?.name ?? "No clip"}</span>
      </div>
      <div className="editor-monitor program-monitor-surface">
        {activeMedia ? (
          <Player
            ref={playerRef}
            component={ProgramComposition}
            durationInFrames={durationInFrames}
            fps={sequence.fps}
            compositionWidth={sequence.width}
            compositionHeight={sequence.height}
            inputProps={{ media: activeMedia, clip: activeClip, sequence }}
            controls={false}
            autoPlay={false}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div className="program-empty">
            <div className="label-tech">THE BRICKS</div>
            <div className="program-empty-title">
              {sequenceData.sequence.name}
            </div>
            <p className="program-empty-copy">
              Move the playhead across the timeline to browse the studio, work,
              services, clients, and delivery states.
            </p>
          </div>
        )}
        {activeSection ? (
          <div className="monitor-overlay monitor-overlay-brick">
            <span className="label-tech">{activeSection.label}</span>
            <span className="monitor-overlay-copy">{activeSummary}</span>
          </div>
        ) : null}
      </div>
      <div className="editor-panel-footer">
        <span className="label-tech">PGM</span>
        <span className="label-tech">
          {formatTimecode(playhead, sequence.fps)}
        </span>
      </div>
    </div>
  );
}
