import { Pause, Play, SkipBack, SkipForward, Square } from "lucide-react";

const controls = [
  { label: "Back", Icon: SkipBack },
  { label: "Play", Icon: Play },
  { label: "Pause", Icon: Pause },
  { label: "Stop", Icon: Square },
  { label: "Forward", Icon: SkipForward }
];

export function TransportControls() {
  return (
    <div className="flex items-center gap-2">
      {controls.map(({ label, Icon }) => (
        <button
          key={label}
          type="button"
          className="flex h-9 w-9 items-center justify-center border border-divider bg-surface text-ink transition hover:border-cyan"
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
