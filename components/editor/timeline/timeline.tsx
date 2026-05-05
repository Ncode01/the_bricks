"use client";

import { useMemo, useRef } from "react";
import { useEditorStore } from "@/lib/editor/store";
import { timeToPixels } from "@/lib/editor/timeline";
import { TimelineRuler } from "./timeline-ruler";
import { TrackLane } from "./track-lane";
import { Playhead } from "./playhead";

export function Timeline({ snapTime }: { snapTime: number | null }) {
  const tracks = useEditorStore((state) => state.tracks);
  const clips = useEditorStore((state) => state.clips);
  const zoom = useEditorStore((state) => state.zoom);
  const playhead = useEditorStore((state) => state.playhead);
  const markers = useEditorStore((state) => state.markers);
  const addMarker = useEditorStore((state) => state.addMarker);
  const setZoom = useEditorStore((state) => state.setZoom);
  const sequence = useEditorStore((state) => state.sequence);

  const scrollRef = useRef<HTMLDivElement>(null);

  const duration = useMemo(() => {
    return Math.max(10, ...clips.map((clip) => clip.end));
  }, [clips]);

  const canvasWidth = timeToPixels(duration, zoom) + 400;

  return (
    <div className="timeline-shell">
      <div className="timeline-head">
        <div className="timeline-head-tab timeline-head-tab-active">
          <span className="label-tech">SEQ</span>
          <span>{sequence.name}</span>
        </div>
        <div className="timeline-head-time label-tech">{Math.round(playhead * sequence.fps).toString().padStart(4, "0")}</div>
      </div>
      <div className="timeline-toolbar">
        <span className="label-tech">Timeline</span>
        <div className="timeline-toolbar-actions">
          <button
            type="button"
            className="editor-button"
            onClick={() => addMarker({ time: playhead })}
          >
            Add Marker
          </button>
          <div className="timeline-zoom">
            <button
              type="button"
              className="editor-icon"
              onClick={() => setZoom(zoom - 10)}
              aria-label="Zoom out"
            >
              -
            </button>
            <input
              type="range"
              min={20}
              max={240}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="zoom-range"
            />
            <button
              type="button"
              className="editor-icon"
              onClick={() => setZoom(zoom + 10)}
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
          <span className="label-tech">{Math.round(zoom)}%</span>
        </div>
      </div>
      <TimelineRuler
        duration={duration}
        zoom={zoom}
        scrollRef={scrollRef}
        markers={markers}
      />
      <div className="timeline-scroll" ref={scrollRef}>
        <div className="timeline-canvas" style={{ width: canvasWidth }}>
          <div className="timeline-playhead-line" style={{ left: timeToPixels(playhead, zoom) + 120 }} />
          <Playhead
            playhead={playhead}
            zoom={zoom}
            scrollRef={scrollRef}
          />
          {snapTime !== null ? (
            <div
              className="timeline-snap"
              style={{ left: timeToPixels(snapTime, zoom) + 120 }}
            />
          ) : null}
          {tracks.map((track) => (
            <TrackLane
              key={track.id}
              track={track}
              clips={clips.filter((clip) => clip.trackId === track.id)}
              zoom={zoom}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
