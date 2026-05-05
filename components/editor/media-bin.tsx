"use client";

import { useMemo, useRef, useState } from "react";
import { Folder, Search, Upload } from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { parseMediaFile } from "@/lib/editor/media";
import { BinItem } from "./bin-item";
import { getPortfolioSequence } from "@/lib/editor/portfolio-data";

export function MediaBin() {
  const media = useEditorStore((state) => state.media);
  const sourceMediaId = useEditorStore((state) => state.sourceMediaId);
  const addMediaItems = useEditorStore((state) => state.addMediaItems);
  const setSourceMediaId = useEditorStore((state) => state.setSourceMediaId);
  const setProjectState = useEditorStore((state) => state.setProjectState);
  const setActiveSequenceId = useEditorStore(
    (state) => state.setActiveSequenceId
  );

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query) {
      return media;
    }

    return media.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [media, query]);

  const handleImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    const parsed = await Promise.all(files.map(parseMediaFile));
    addMediaItems(parsed);
    event.target.value = "";
  };

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((item) => {
      const group = item.group ?? "Ungrouped";
      const current = map.get(group) ?? [];
      map.set(group, [...current, item]);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const handleOpen = (itemId: string) => {
    const sequenceId = itemId === "media-seq-arc" ? "seq-arc" : "seq-main";
    const sequence = getPortfolioSequence(sequenceId);
    setProjectState({
      sequence: sequence.sequence,
      tracks: sequence.tracks,
      clips: sequence.clips,
      markers: sequence.markers,
      sequenceId: sequence.id
    });
    setActiveSequenceId(sequence.id);
  };

  return (
    <>
      <div className="panel-tabs">
        <div className="panel-tab panel-tab-active">
          <Folder className="h-4 w-4" />
          <span>Project: The Bricks</span>
        </div>
        <button type="button" className="panel-tab">
          <Folder className="h-4 w-4" />
          <span>Media Browser</span>
        </button>
      </div>
      <div className="editor-panel-body bin-body">
        <div className="editor-input-row">
          <Search className="h-4 w-4 text-ink-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="editor-input"
            placeholder="Search..."
          />
          <button
            type="button"
            className="editor-icon"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="video/*,audio/*,image/*"
            multiple
            className="hidden"
            onChange={handleImport}
          />
        </div>
        <div className="bin-list">
          {grouped.map(([group, items]) => (
            <div key={group} className="bin-group">
              <div className="bin-group-header">
                <Folder className="h-4 w-4" />
                <span>{group}</span>
              </div>
              <div className="bin-group-items">
                {items.map((item) => (
                  <BinItem
                    key={item.id}
                    item={item}
                    active={item.id === sourceMediaId}
                    onSelect={() => setSourceMediaId(item.id)}
                    onOpen={
                      item.kind === "sequence" ? () => handleOpen(item.id) : undefined
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {!filtered.length ? (
          <div className="editor-empty">Import media to begin editing.</div>
        ) : null}
      </div>
      <div className="editor-panel-footer bin-footer">
        <span>{filtered.length} Items</span>
      </div>
    </>
  );
}
