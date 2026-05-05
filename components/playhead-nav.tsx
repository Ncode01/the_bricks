import { cn } from "@/lib/utils";

export type PlayheadMarker = {
  label: string;
  position: string;
  tone?: "violet" | "lavender" | "cyan";
};

const toneStyles: Record<NonNullable<PlayheadMarker["tone"]>, string> = {
  violet: "bg-violet",
  lavender: "bg-lavender",
  cyan: "bg-cyan"
};

export function PlayheadNav({
  markers,
  position,
  activeLabel,
  onMarkerSelect
}: {
  markers: PlayheadMarker[];
  position?: string;
  activeLabel?: string;
  onMarkerSelect?: (marker: PlayheadMarker) => void;
}) {
  const playheadLeft = position ?? "var(--playhead-progress)";

  return (
    <div className="relative mt-6 h-12 w-full">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-divider" />
      <div
        className="absolute top-0 h-full"
        style={{ left: playheadLeft }}
        data-playhead
      >
        <div className="relative h-full">
          <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-cyan" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan bg-surface" />
        </div>
      </div>
      {markers.map((marker) => (
        <div
          key={marker.label}
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: marker.position }}
        >
          <button
            type="button"
            onClick={() => onMarkerSelect?.(marker)}
            className="flex flex-col items-center gap-2"
            aria-pressed={marker.label === activeLabel}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                toneStyles[marker.tone ?? "violet"],
                marker.label === activeLabel && "marker-active"
              )}
            />
            <span className="label-tech text-[10px] text-ink-muted">
              {marker.label}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
