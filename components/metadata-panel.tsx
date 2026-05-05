import { cn } from "@/lib/utils";

export type MetadataItem = {
  label: string;
  value: string | string[];
};

export function MetadataPanel({
  title = "Metadata",
  items,
  className
}: {
  title?: string;
  items: MetadataItem[];
  className?: string;
}) {
  return (
    <div className={cn("panel", className)}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-dot" />
          <span className="label-tech text-ink-muted">{title}</span>
        </div>
      </div>
      <dl className="panel-body space-y-3 text-sm">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              {item.label}
            </dt>
            <dd className="text-ink">
              {Array.isArray(item.value) ? (
                <div className="space-y-1">
                  {item.value.map((entry) => (
                    <div key={entry}>{entry}</div>
                  ))}
                </div>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
