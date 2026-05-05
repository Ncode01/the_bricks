"use client";

import type { MediaItem, TimelineClip } from "@/lib/editor/types";
import { TimelineClip as BaseClip } from "./timeline-clip";

export function VideoClip({
  clip,
  media,
  zoom,
  selected
}: {
  clip: TimelineClip;
  media: MediaItem | null;
  zoom: number;
  selected: boolean;
}) {
  return (
    <BaseClip
      clip={clip}
      media={media}
      zoom={zoom}
      selected={selected}
      tone="video"
    />
  );
}
