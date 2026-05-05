import { create } from "zustand";
import type {
  ClipTransform,
  ClipMeta,
  ExportJob,
  Marker,
  MediaItem,
  Selection,
  Sequence,
  TimelineClip,
  Track,
  TrackType
} from "./types";
import { clamp, DEFAULT_FPS, DEFAULT_ZOOM } from "./timeline";
import { createId } from "./utils";

const defaultSequence: Sequence = {
  id: createId("sequence"),
  name: "Untitled Sequence",
  fps: DEFAULT_FPS,
  width: 1280,
  height: 720
};

const defaultTracks: Track[] = [
  {
    id: "v1",
    name: "V1",
    type: "video",
    muted: false,
    solo: false,
    locked: false,
    visible: true
  },
  {
    id: "v2",
    name: "V2",
    type: "video",
    muted: false,
    solo: false,
    locked: false,
    visible: true
  },
  {
    id: "a1",
    name: "A1",
    type: "audio",
    muted: false,
    solo: false,
    locked: false,
    visible: true
  },
  {
    id: "a2",
    name: "A2",
    type: "audio",
    muted: false,
    solo: false,
    locked: false,
    visible: true
  }
];

const defaultTransform: ClipTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  opacity: 1
};

export type EditorState = {
  sequence: Sequence;
  activeSequenceId: string;
  media: MediaItem[];
  tracks: Track[];
  clips: TimelineClip[];
  markers: Marker[];
  selection: Selection;
  sourceMediaId?: string;
  activeMonitor: "source" | "program";
  playhead: number;
  zoom: number;
  isPlaying: boolean;
  exportJob: ExportJob;
  addMediaItems: (items: MediaItem[]) => void;
  setMediaItems: (items: MediaItem[]) => void;
  setProjectState: (payload: {
    sequence: Sequence;
    tracks: Track[];
    clips: TimelineClip[];
    markers: Marker[];
    sequenceId?: string;
  }) => void;
  setActiveSequenceId: (id: string) => void;
  setSourceMediaId: (id?: string) => void;
  selectClip: (id?: string) => void;
  addClipFromMedia: (payload: {
    mediaId: string;
    trackId: string;
    start: number;
  }) => void;
  moveClip: (payload: {
    clipId: string;
    trackId: string;
    start: number;
  }) => void;
  trimClip: (payload: {
    clipId: string;
    start?: number;
    end?: number;
    inPoint?: number;
    outPoint?: number;
  }) => void;
  updateClipTransform: (payload: {
    clipId: string;
    transform: Partial<ClipTransform>;
  }) => void;
  updateClipName: (payload: { clipId: string; name: string }) => void;
  updateClipMeta: (payload: { clipId: string; meta: Partial<ClipMeta> }) => void;
  setPlayhead: (time: number) => void;
  setZoom: (zoom: number) => void;
  setPlaying: (value: boolean) => void;
  setActiveMonitor: (monitor: "source" | "program") => void;
  toggleTrackState: (trackId: string, key: keyof Track) => void;
  addMarker: (payload: { time: number; label?: string }) => void;
  removeMarker: (id: string) => void;
  setExportJob: (job: ExportJob) => void;
};

function createClip({
  media,
  trackId,
  trackType,
  start
}: {
  media: MediaItem;
  trackId: string;
  trackType: TrackType;
  start: number;
}): TimelineClip {
  const duration = Math.max(1, Math.min(media.duration || 5, 30));
  const end = start + duration;

  return {
    id: createId("clip"),
    mediaId: media.id,
    trackId,
    name: media.name,
    type: trackType,
    start,
    end,
    inPoint: 0,
    outPoint: duration,
    transform: { ...defaultTransform }
  };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  sequence: defaultSequence,
  activeSequenceId: defaultSequence.id,
  media: [],
  tracks: defaultTracks,
  clips: [],
  markers: [],
  selection: {},
  sourceMediaId: undefined,
  activeMonitor: "program",
  playhead: 0,
  zoom: DEFAULT_ZOOM,
  isPlaying: false,
  exportJob: { status: "idle", progress: 0 },
  addMediaItems: (items) =>
    set((state) => ({ media: [...state.media, ...items] })),
  setMediaItems: (items) => set({ media: items }),
  setProjectState: (payload) =>
    set({
      sequence: payload.sequence ?? defaultSequence,
      tracks: payload.tracks ?? defaultTracks,
      clips: payload.clips ?? [],
      markers: payload.markers ?? [],
      activeSequenceId: payload.sequenceId ?? payload.sequence?.id ?? defaultSequence.id
    }),
  setActiveSequenceId: (id) => set({ activeSequenceId: id }),
  setSourceMediaId: (id) =>
    set((state) => ({
      sourceMediaId: id,
      selection: { ...state.selection, mediaId: id },
      activeMonitor: "source"
    })),
  selectClip: (id) =>
    set((state) => ({
      selection: { ...state.selection, clipId: id },
      activeMonitor: "program"
    })),
  addClipFromMedia: ({ mediaId, trackId, start }) => {
    const { media, tracks } = get();
    const item = media.find((entry) => entry.id === mediaId);
    const track = tracks.find((entry) => entry.id === trackId);
    if (!item || !track) {
      return;
    }

    const clip = createClip({
      media: item,
      trackId,
      trackType: track.type,
      start
    });

    set((state) => ({
      clips: [...state.clips, clip],
      selection: { ...state.selection, clipId: clip.id },
      activeMonitor: "program"
    }));
  },
  moveClip: ({ clipId, trackId, start }) =>
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              trackId,
              start,
              end: start + (clip.end - clip.start)
            }
          : clip
      )
    })),
  trimClip: ({ clipId, start, end, inPoint, outPoint }) =>
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              start: start ?? clip.start,
              end: end ?? clip.end,
              inPoint: inPoint ?? clip.inPoint,
              outPoint: outPoint ?? clip.outPoint
            }
          : clip
      )
    })),
  updateClipTransform: ({ clipId, transform }) =>
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? { ...clip, transform: { ...clip.transform, ...transform } }
          : clip
      )
    })),
  updateClipName: ({ clipId, name }) =>
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId ? { ...clip, name } : clip
      )
    })),
  updateClipMeta: ({ clipId, meta }) =>
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              meta: {
                category: clip.meta?.category ?? "notes",
                label: clip.meta?.label ?? clip.name,
                ...clip.meta,
                ...meta
              }
            }
          : clip
      )
    })),
  setPlayhead: (time) => set({ playhead: Math.max(0, time) }),
  setZoom: (zoom) => set({ zoom: clamp(zoom, 20, 240) }),
  setPlaying: (value) => set({ isPlaying: value }),
  setActiveMonitor: (monitor) => set({ activeMonitor: monitor }),
  toggleTrackState: (trackId, key) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === trackId
          ? { ...track, [key]: !track[key] }
          : track
      )
    })),
  addMarker: ({ time, label }) =>
    set((state) => ({
      markers: [
        ...state.markers,
        {
          id: createId("marker"),
          time,
          label: label ?? `MK ${String(state.markers.length + 1).padStart(2, "0")}`
        }
      ]
    })),
  removeMarker: (id) =>
    set((state) => ({
      markers: state.markers.filter((marker) => marker.id !== id)
    })),
  setExportJob: (job) => set({ exportJob: job })
}));
