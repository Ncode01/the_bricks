import { cn } from "@/lib/utils";

export function MonitorFrame({
  label,
  meta,
  status,
  footer,
  children,
  className,
  contentClassName
}: {
  label: string;
  meta?: string;
  status?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={cn("frame flex flex-col", className)}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-dot" />
          <span className="label-tech text-ink-muted">{label}</span>
          {status ? <span className="panel-status">{status}</span> : null}
        </div>
        {meta ? <span className="label-tech text-ink-muted">{meta}</span> : null}
      </div>
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden bg-panel",
          contentClassName
        )}
      >
        {children}
      </div>
      {footer ? <div className="panel-footer">{footer}</div> : null}
    </div>
  );
}
