"use client";

import { useMemo, useState } from "react";
import { exportClip } from "@/lib/editor/export";
import { useEditorStore } from "@/lib/editor/store";

export function ExportDialog({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const exportJob = useEditorStore((state) => state.exportJob);
  const setExportJob = useEditorStore((state) => state.setExportJob);
  const clips = useEditorStore((state) => state.clips);
  const media = useEditorStore((state) => state.media);
  const selection = useEditorStore((state) => state.selection);

  const selectedClip = useMemo(
    () => clips.find((clip) => clip.id === selection.clipId),
    [clips, selection.clipId]
  );

  const selectedMedia = useMemo(() => {
    if (!selectedClip) {
      return null;
    }
    return media.find((item) => item.id === selectedClip.mediaId) ?? null;
  }, [media, selectedClip]);

  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!selectedMedia || !selectedMedia.file) {
      setError("Select an imported media clip to export.");
      return;
    }

    setError(null);
    setExportJob({ status: "loading", progress: 0 });

    try {
      const blob = await exportClip({
        file: selectedMedia.file,
        onProgress: (progress) =>
          setExportJob({ status: "processing", progress })
      });
      const url = URL.createObjectURL(blob);
      setExportJob({ status: "done", progress: 1, url });
    } catch (exportError) {
      setExportJob({ status: "error", progress: 0 });
      setError("Export failed. Try a smaller clip or re-import media.");
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="export-dialog">
      <div className="export-dialog-panel">
        <div className="editor-panel-header">
          <span className="label-tech">Export</span>
          <button type="button" className="editor-icon" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="editor-panel-body space-y-4">
          <div className="text-sm text-ink-muted">
            Render the selected clip or prepare a delivery inquiry using the
            browser-based export pipeline.
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="label-tech">Target</span>
              <span>{selectedClip?.name ?? "None"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="label-tech">Delivery</span>
              <span>H.264 MP4 / Inquiry</span>
            </div>
          </div>
          <button type="button" className="editor-button" onClick={handleExport}>
            Render Clip
          </button>
          {exportJob.status !== "idle" ? (
            <div className="space-y-2 text-xs">
              <div className="label-tech">Progress</div>
              <div className="export-progress">
                <span
                  className="export-progress-bar"
                  style={{ width: `${Math.round(exportJob.progress * 100)}%` }}
                />
              </div>
              <div className="text-ink-muted">
                {Math.round(exportJob.progress * 100)}%
              </div>
            </div>
          ) : null}
          {exportJob.url ? (
            <a
              className="editor-button"
              href={exportJob.url}
              download="sequence-export.mp4"
            >
              Download Export
            </a>
          ) : null}
          {error ? <div className="text-xs text-cyan">{error}</div> : null}
        </div>
      </div>
    </div>
  );
}
