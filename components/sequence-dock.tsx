"use client";

import { cn } from "@/lib/utils";

export type SequenceDockItem = {
  id: string;
  label: string;
  status?: string;
};

export function SequenceDock({
  items,
  activeId,
  onSelect
}: {
  items: SequenceDockItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="sequence-dock">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.id)}
            className={cn("sequence-tab", isActive && "sequence-tab-active")}
            aria-pressed={isActive}
          >
            <span>{item.label}</span>
            {item.status ? (
              <span className="sequence-status">{item.status}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
