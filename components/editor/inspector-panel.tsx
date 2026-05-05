"use client";

import { useMemo } from "react";
import { useEditorStore } from "@/lib/editor/store";
import { formatTimecode } from "@/lib/editor/timeline";

function InspectorField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string | number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="inspector-field">
      <span className="label-tech text-ink-muted">{label}</span>
      <input
        type="number"
        className="inspector-input"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function InspectorPanel() {
  const clips = useEditorStore((state) => state.clips);
  const media = useEditorStore((state) => state.media);
  const selection = useEditorStore((state) => state.selection);
  const updateClipTransform = useEditorStore((state) => state.updateClipTransform);
  const updateClipName = useEditorStore((state) => state.updateClipName);
  const trimClip = useEditorStore((state) => state.trimClip);
  const updateClipMeta = useEditorStore((state) => state.updateClipMeta);

  const clip = useMemo(
    () => clips.find((entry) => entry.id === selection.clipId) ?? null,
    [clips, selection.clipId]
  );

  const mediaItem = useMemo(() => {
    if (!clip) {
      return null;
    }
    return media.find((item) => item.id === clip.mediaId) ?? null;
  }, [clip, media]);

  if (!clip) {
    return (
      <>
        <div className="panel-tabs">
          <div className="panel-tab panel-tab-active">Effect Controls</div>
          <button type="button" className="panel-tab">Metadata</button>
        </div>
        <div className="editor-panel-body">
          <div className="inspector-empty-shell">
            <div className="label-tech">NO CLIP SELECTED</div>
            <p>Select a clip on the timeline to edit its controls.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="panel-tabs">
        <div className="panel-tab panel-tab-active">Effect Controls</div>
        <button type="button" className="panel-tab">Metadata</button>
      </div>
      <div className="editor-panel-body space-y-4">
        <div className="inspector-hero">
          <div>
            <div className="label-tech text-ink-muted">Selected Clip</div>
            <div className="inspector-title">{clip.name}</div>
            <div className="inspector-subtitle">
              {clip.meta?.subtitle ?? mediaItem?.summary ?? mediaItem?.type ?? "Portfolio clip"}
            </div>
          </div>
          <div className="inspector-badge">{clip.meta?.category ?? "clip"}</div>
        </div>
        <div className="inspector-stack">
          <label className="inspector-field">
            <span className="label-tech text-ink-muted">Clip Name</span>
            <input
              className="inspector-input"
              value={clip.name}
              onChange={(event) =>
                updateClipName({ clipId: clip.id, name: event.target.value })
              }
            />
          </label>
          <div className="inspector-grid">
            <InspectorField
              label="Start"
              value={clip.start.toFixed(2)}
              onChange={(value) => trimClip({ clipId: clip.id, start: Number(value) })}
            />
            <InspectorField
              label="End"
              value={clip.end.toFixed(2)}
              onChange={(value) => trimClip({ clipId: clip.id, end: Number(value) })}
            />
            <InspectorField
              label="In"
              value={clip.inPoint.toFixed(2)}
              onChange={(value) => trimClip({ clipId: clip.id, inPoint: Number(value) })}
            />
            <InspectorField
              label="Out"
              value={clip.outPoint.toFixed(2)}
              onChange={(value) => trimClip({ clipId: clip.id, outPoint: Number(value) })}
            />
          </div>
          <div className="inspector-grid">
            <InspectorField
              label="Pos X"
              value={clip.transform.x}
              onChange={(value) => updateClipTransform({ clipId: clip.id, transform: { x: value } })}
            />
            <InspectorField
              label="Pos Y"
              value={clip.transform.y}
              onChange={(value) => updateClipTransform({ clipId: clip.id, transform: { y: value } })}
            />
            <InspectorField
              label="Scale"
              value={clip.transform.scale}
              onChange={(value) => updateClipTransform({ clipId: clip.id, transform: { scale: value } })}
            />
            <InspectorField
              label="Rotation"
              value={clip.transform.rotation}
              onChange={(value) => updateClipTransform({ clipId: clip.id, transform: { rotation: value } })}
            />
            <InspectorField
              label="Opacity"
              value={clip.transform.opacity}
              onChange={(value) => updateClipTransform({ clipId: clip.id, transform: { opacity: value } })}
            />
          </div>
        </div>
        <div className="inspector-meta-grid">
          <label className="inspector-field">
            <span className="label-tech text-ink-muted">Section Type</span>
            <input
              className="inspector-input"
              value={clip.meta?.category ?? ""}
              onChange={(event) =>
                updateClipMeta({ clipId: clip.id, meta: { category: event.target.value as never } })
              }
            />
          </label>
          <label className="inspector-field">
            <span className="label-tech text-ink-muted">Color Label</span>
            <input
              className="inspector-input"
              value={clip.meta?.color ?? "violet"}
              onChange={(event) =>
                updateClipMeta({ clipId: clip.id, meta: { color: event.target.value as never } })
              }
            />
          </label>
          <label className="inspector-field">
            <span className="label-tech text-ink-muted">Display Mode</span>
            <input
              className="inspector-input"
              value={clip.meta?.display ?? "slate"}
              onChange={(event) =>
                updateClipMeta({ clipId: clip.id, meta: { display: event.target.value as never } })
              }
            />
          </label>
          <label className="inspector-field">
            <span className="label-tech text-ink-muted">Tags</span>
            <input
              className="inspector-input"
              value={(clip.meta?.tags ?? []).join(", ")}
              onChange={(event) =>
                updateClipMeta({ clipId: clip.id, meta: { tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) } })
              }
            />
          </label>
        </div>
        <div className="inspector-summary inspector-summary-rich">
          <div><span className="label-tech">Duration</span><span>{formatTimecode(clip.end - clip.start)}</span></div>
          <div><span className="label-tech">Media</span><span>{mediaItem?.name ?? clip.meta?.label ?? "Portfolio clip"}</span></div>
          <div><span className="label-tech">Summary</span><span>{clip.meta?.summary ?? mediaItem?.summary ?? ""}</span></div>
          <div><span className="label-tech">Notes</span><span>{clip.meta?.notes ?? "In-house studio pipeline"}</span></div>
        </div>
      </div>
    </>
  );
}
