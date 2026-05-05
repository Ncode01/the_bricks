import { AbsoluteFill, Audio, Img, Video } from "remotion";
import type { MediaItem, Sequence, TimelineClip } from "@/lib/editor/types";

export function ProgramComposition({
  media,
  clip,
  sequence
}: {
  media: MediaItem;
  clip: TimelineClip | null;
  sequence: Sequence;
}) {
  if (!media || !media.src) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "rgb(245, 244, 250)",
          color: "rgb(75, 68, 82)",
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        No media loaded
      </AbsoluteFill>
    );
  }

  const transform = clip?.transform ?? {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 1
  };

  const commonStyle: React.CSSProperties = {
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
    opacity: transform.opacity,
    width: "100%",
    height: "100%",
    objectFit: "cover"
  };

  if (media.type === "image") {
    return (
      <AbsoluteFill>
        <Img src={media.src} style={commonStyle} />
      </AbsoluteFill>
    );
  }

  if (media.type === "audio") {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "rgb(215, 215, 235)",
          color: "rgb(25, 27, 41)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18
        }}
      >
        <Audio src={media.src} />
        Audio Clip Loaded
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <Video
        src={media.src}
        startFrom={Math.floor((clip?.inPoint ?? 0) * sequence.fps)}
        style={commonStyle}
      />
    </AbsoluteFill>
  );
}
