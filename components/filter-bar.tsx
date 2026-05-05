"use client";

import { cn } from "@/lib/utils";

export function FilterBar({
  options,
  active,
  onChange
}: {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border border-divider bg-panel/70 p-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "label-tech border border-divider px-3 py-2 transition",
            active === option
              ? "bg-surface text-ink"
              : "bg-panel/60 text-ink-muted hover:text-ink"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
