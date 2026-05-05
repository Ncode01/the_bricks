import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;

async function loadFFmpeg() {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
  }

  if (!ffmpeg.loaded) {
    const baseUrl = "https://unpkg.com/@ffmpeg/core@0.12.6/dist";
    const coreURL = await toBlobURL(`${baseUrl}/ffmpeg-core.js`, "text/javascript");
    const wasmURL = await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, "application/wasm");
    const workerURL = await toBlobURL(
      `${baseUrl}/ffmpeg-core.worker.js`,
      "text/javascript"
    );

    await ffmpeg.load({ coreURL, wasmURL, workerURL });
  }

  return ffmpeg;
}

function getExtension(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop() : "mp4";
}

export async function exportClip({
  file,
  onProgress
}: {
  file: File;
  onProgress?: (progress: number) => void;
}) {
  const instance = await loadFFmpeg();
  const inputName = `input.${getExtension(file.name)}`;
  const outputName = "output.mp4";

  instance.on("progress", ({ progress }) => {
    onProgress?.(progress ?? 0);
  });

  await instance.writeFile(inputName, await fetchFile(file));
  await instance.exec([
    "-i",
    inputName,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-movflags",
    "faststart",
    outputName
  ]);

  const data = await instance.readFile(outputName);
  await instance.deleteFile(inputName);
  await instance.deleteFile(outputName);

  const bytes =
    typeof data === "string"
      ? new TextEncoder().encode(data)
      : data instanceof Uint8Array
      ? data
      : new Uint8Array(data as ArrayBuffer);
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;

  return new Blob([buffer], {
    type: "video/mp4"
  });
}
