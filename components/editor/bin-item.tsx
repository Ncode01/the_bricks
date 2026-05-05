"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Clapperboard,
  FileAudio,
  FileVideo,
  Film,
  FolderOpen,
  Image as ImageIcon,
  StickyNote
} from "lucide-react";
import type { MediaItem } from "@/lib/editor/types";
import { formatTimecode } from "@/lib/editor/timeline";

const icons = {
  video: FileVideo,
  audio: FileAudio,
  image: ImageIcon,
  portfolio: Film
};

export function BinItem({
  item,
  active,
  onSelect,
  onOpen
}: {
  item: MediaItem;
  active: boolean;
  onSelect: () => void;
  onOpen?: () => void;
}) {
  const isSequence = item.kind === "sequence";
  const isNote = item.kind === "note";
  const isDraggable = !isSequence && !isNote;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: { type: "media", mediaId: item.id },
      disabled: !isDraggable
    });

  const Icon = isSequence
    ? Clapperboard
    : isNote
    ? StickyNote
    : item.kind === "project"
    ? FolderOpen
    : icons[item.type];
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1
  };

  const durationLabel = item.duration
    ? formatTimecode(item.duration)
    : "";

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={active ? "bin-row bin-row-active" : "bin-row"}
      style={style}
      onClick={onSelect}
      onDoubleClick={onOpen}
      {...listeners}
      {...attributes}
    >
      <span className="bin-icon">
        <Icon className="h-4 w-4" />
      </span>
      <span className="bin-name">{item.name}</span>
      <span className="bin-meta">
        {durationLabel}
      </span>
    </button>
  );
}
