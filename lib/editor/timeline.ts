export const DEFAULT_FPS = 24;
export const DEFAULT_ZOOM = 60;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function timeToPixels(time: number, pxPerSecond: number) {
  return time * pxPerSecond;
}

export function pixelsToTime(px: number, pxPerSecond: number) {
  return px / pxPerSecond;
}

function pad(value: number, size = 2) {
  return value.toString().padStart(size, "0");
}

export function formatTimecode(seconds: number, fps = DEFAULT_FPS) {
  const totalFrames = Math.max(0, Math.floor(seconds * fps));
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  return `${pad(hours)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}
