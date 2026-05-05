import { cn } from "@/lib/utils";
import { TrackControls } from "./track-controls";

export function TrackLane({
  label,
  meta,
  status,
  type = "video",
  children,
  className
}: {
  label: string;
  meta?: string;
  status?: string;
  type?: "video" | "audio";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "timeline-lane grid grid-cols-[120px_1fr] gap-4 border-b border-divider py-4",
        className
      )}
    >
      <div className="space-y-3 text-ink-muted">
        <div className="flex items-center justify-between">
          <div>
            <div className="label-tech">{label}</div>
            {meta ? (
              <div className="mt-2 text-[10px] uppercase tracking-[0.18em]">
                {meta}
              </div>
            ) : null}
          </div>
          {status ? (
            <span className="label-tech text-[10px] text-ink-muted">
              {status}
            </span>
          ) : null}
        </div>
        <TrackControls variant={type} />
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}
