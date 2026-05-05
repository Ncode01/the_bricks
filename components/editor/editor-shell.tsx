"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import { TopMenuBar } from "./top-menu-bar";
import { MediaBin } from "./media-bin";
import { SourceMonitor } from "./source-monitor";
import { ProgramMonitor } from "./program-monitor";
import { TransportControls } from "./transport-controls";
import { InspectorPanel } from "./inspector-panel";
import { Timeline } from "./timeline/timeline";
import { StatusBar } from "./status-bar";
import { ExportDialog } from "./export-dialog";
import { useEditorStore } from "@/lib/editor/store";
import { clamp } from "@/lib/editor/timeline";

const SNAP_THRESHOLD = 0.25;

export function EditorShell() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    })
  );

  const playhead = useEditorStore((state) => state.playhead);
  const zoom = useEditorStore((state) => state.zoom);
  const addClipFromMedia = useEditorStore((state) => state.addClipFromMedia);
  const moveClip = useEditorStore((state) => state.moveClip);
  const selectClip = useEditorStore((state) => state.selectClip);
  const clips = useEditorStore((state) => state.clips);

  const [snapTime, setSnapTime] = useState<number | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const clipLookup = useMemo(() => {
    return new Map(clips.map((clip) => [clip.id, clip]));
  }, [clips]);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === "clip") {
      selectClip(data.clipId as string);
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const data = event.active.data.current;
    if (data?.type !== "clip") {
      setSnapTime(null);
      return;
    }

    const initialStart = Number(data.start ?? 0);
    const proposed = clamp(initialStart + event.delta.x / zoom, 0, 9999);

    if (Math.abs(proposed - playhead) <= SNAP_THRESHOLD) {
      setSnapTime(playhead);
    } else {
      setSnapTime(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setSnapTime(null);

    const data = active.data.current;
    if (!data || !over) {
      return;
    }

    if (data.type === "media") {
      addClipFromMedia({
        mediaId: data.mediaId as string,
        trackId: String(over.id),
        start: playhead
      });
      return;
    }

    if (data.type === "clip") {
      const clip = clipLookup.get(data.clipId as string);
      if (!clip) {
        return;
      }
      const initialStart = Number(data.start ?? clip.start);
      let nextStart = clamp(initialStart + delta.x / zoom, 0, 9999);

      if (Math.abs(nextStart - playhead) <= SNAP_THRESHOLD) {
        nextStart = playhead;
      }

      moveClip({
        clipId: clip.id,
        trackId: String(over.id),
        start: nextStart
      });
    }
  };

  return (
    <div className="editor-shell">
      <TopMenuBar />
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <div className="editor-body">
          <aside className="editor-panel editor-panel-left">
            <MediaBin />
          </aside>
          <section className="editor-center">
            <div className="editor-monitor-grid">
              <SourceMonitor />
              <ProgramMonitor />
            </div>
            <TransportControls />
          </section>
          <aside className="editor-panel editor-panel-right">
            <InspectorPanel />
          </aside>
          <section className="editor-timeline-area">
            <Timeline snapTime={snapTime} />
          </section>
        </div>
      </DndContext>
      <StatusBar onExport={() => setExportOpen(true)} />
      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}
