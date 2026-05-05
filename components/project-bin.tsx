import { cn } from "@/lib/utils";

export function ProjectBin({
  title,
  items,
  activeItem,
  onSelect,
  variant = "standalone",
  className
}: {
  title: string;
  items: string[];
  activeItem?: string;
  onSelect?: (item: string) => void;
  variant?: "standalone" | "embedded";
  className?: string;
}) {
  return (
    <div
      className={cn(
        variant === "embedded" ? "p-3" : "panel p-4",
        className
      )}
    >
      <div className="label-tech text-ink-muted">{title}</div>
      <ul className="bin-list mt-3 space-y-2 text-sm">
        {items.map((item) => {
          const isActive = item === activeItem;
          return (
            <li key={item}>
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className={cn(
                    "bin-item",
                    isActive && "bin-item-active"
                  )}
                >
                  <span>{item}</span>
                  <span className="text-xs text-ink-muted">BIN</span>
                </button>
              ) : (
                <div
                  className={cn(
                    "bin-item",
                    isActive && "bin-item-active"
                  )}
                >
                  <span>{item}</span>
                  <span className="text-xs text-ink-muted">BIN</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
