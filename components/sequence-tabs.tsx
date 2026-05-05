import Link from "next/link";
import { cn } from "@/lib/utils";

export type SequenceTab = {
  label: string;
  href: string;
  code?: string;
};

export function SequenceTabs({
  tabs,
  active
}: {
  tabs: SequenceTab[];
  active?: string;
}) {
  return (
    <nav className="hidden items-center gap-2 md:flex">
      {tabs.map((tab) => {
        const isActive = tab.label === active;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              "sequence-tab",
              isActive
                ? "sequence-tab-active"
                : ""
            )}
          >
            <span>{tab.label}</span>
            {tab.code ? (
              <span className="sequence-status">{tab.code}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
