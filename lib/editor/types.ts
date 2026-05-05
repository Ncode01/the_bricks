export type MediaType = "video" | "audio" | "image" | "portfolio";

export type MediaKind = "clip" | "sequence" | "project" | "note";

export type MediaItem = {
  id: string;
  name: string;
  type: MediaType;
  duration: number;
  src?: string;
  file?: File;
  thumbnail?: string;
  width?: number;
  height?: number;
  createdAt: number;
  group?: string;
  kind?: MediaKind;
  summary?: string;
  tags?: string[];
};

export type TrackType = "video" | "audio";

export type Track = {
  id: string;
  name: string;
  type: TrackType;
  muted: boolean;
  solo: boolean;
  locked: boolean;
  visible: boolean;
};

export type ClipTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
};

export type ClipCategory =
  | "brand"
  | "about"
  | "work"
  | "services"
  | "process"
  | "clients"
  | "testimonials"
  | "contact"
  | "booking"
  | "delivery"
  | "project"
  | "notes"
  | "audio";

export type ClipMeta = {
  category: ClipCategory;
  label: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  services?: string[];
  deliverables?: string[];
  notes?: string;
  display?: "slate" | "grid" | "stack";
  sequenceId?: string;
  color?: "violet" | "lavender" | "cyan" | "neutral";
};

export type TimelineClip = {
  id: string;
  mediaId?: string;
  trackId: string;
  name: string;
  type: TrackType;
  start: number;
  end: number;
  inPoint: number;
  outPoint: number;
  transform: ClipTransform;
  meta?: ClipMeta;
};

export type Sequence = {
  id: string;
  name: string;
  fps: number;
  width: number;
  height: number;
};

export type Selection = {
  clipId?: string;
  mediaId?: string;
};

export type Marker = {
  id: string;
  time: number;
  label: string;
  tone?: "cyan" | "violet" | "lavender";
};

export type ExportJob = {
  status: "idle" | "loading" | "processing" | "done" | "error";
  progress: number;
  url?: string;
  error?: string;
};
