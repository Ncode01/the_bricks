import { Eye, Lock, Volume2 } from "lucide-react";

export function TrackControls({ variant = "video" }: { variant?: "video" | "audio" }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" className="track-btn" aria-label="Mute">
        M
      </button>
      <button type="button" className="track-btn" aria-label="Solo">
        S
      </button>
      <button
        type="button"
        className="track-btn"
        aria-label={variant === "audio" ? "Audio monitor" : "Visibility"}
      >
        {variant === "audio" ? (
          <Volume2 className="h-3 w-3" />
        ) : (
          <Eye className="h-3 w-3" />
        )}
      </button>
      <button type="button" className="track-btn" aria-label="Lock">
        <Lock className="h-3 w-3" />
      </button>
    </div>
  );
}
