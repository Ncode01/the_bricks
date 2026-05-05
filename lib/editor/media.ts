import type { MediaItem } from "./types";
import { createId, getMediaType } from "./utils";

async function loadMediaMetadata(url: string, type: "video" | "audio") {
  return new Promise<{
    duration: number;
    width?: number;
    height?: number;
  }>((resolve, reject) => {
    const element = document.createElement(type);
    element.preload = "metadata";
    element.src = url;

    const handleLoaded = () => {
      const duration = Number.isFinite(element.duration) ? element.duration : 0;
      const width = "videoWidth" in element ? element.videoWidth : undefined;
      const height = "videoHeight" in element ? element.videoHeight : undefined;
      resolve({ duration, width, height });
    };

    const handleError = () => {
      reject(new Error("Failed to load media metadata."));
    };

    element.addEventListener("loadedmetadata", handleLoaded, { once: true });
    element.addEventListener("error", handleError, { once: true });
  });
}

async function loadImageMetadata(url: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => reject(new Error("Failed to load image metadata."));
  });
}

export async function parseMediaFile(file: File): Promise<MediaItem> {
  const type = getMediaType(file);
  const src = URL.createObjectURL(file);
  const createdAt = Date.now();

  let duration = 0;
  let width: number | undefined;
  let height: number | undefined;

  if (type === "video" || type === "audio") {
    const meta = await loadMediaMetadata(src, type);
    duration = meta.duration;
    width = meta.width;
    height = meta.height;
  }

  if (type === "image") {
    const meta = await loadImageMetadata(src);
    width = meta.width;
    height = meta.height;
  }

  return {
    id: createId("media"),
    name: file.name,
    type,
    duration,
    src,
    file,
    thumbnail: src,
    width,
    height,
    createdAt
  };
}
