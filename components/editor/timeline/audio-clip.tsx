"use client";

import type { MediaItem, TimelineClip } from "@/lib/editor/types";
import { TimelineClip as BaseClip } from "./timeline-clip";
import { Waveform } from "../waveform";

export function AudioClip({
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
      tone="audio"
    >
      {media?.src ? <Waveform url={media.src} /> : null}
    </BaseClip>
  );
}
