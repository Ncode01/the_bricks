import Link from "next/link";
import { SequenceTabs } from "./sequence-tabs";
import { TimecodeLabel } from "./timecode-label";
import { Hand, Magnet, MousePointer, Scissors } from "lucide-react";

const tabs = [
  { label: "Home", href: "/", code: "SEQ A" },
  { label: "Work", href: "/work", code: "BIN 01" },
  { label: "About", href: "/about", code: "CTRL" },
  { label: "Contact", href: "/contact", code: "OUT" }
];

const menuItems = ["File", "Edit", "Clip", "Sequence", "Color", "Window"];
const tools = [
  { label: "Select", Icon: MousePointer, active: true },
  { label: "Trim", Icon: Scissors },
  { label: "Hand", Icon: Hand },
  { label: "Snap", Icon: Magnet }
];

export function TopMenuBar({ activeTab }: { activeTab?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-divider bg-panel/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-violet" />
            <Link href="/" className="text-sm font-semibold tracking-tight">
              The Bricks Studio
            </Link>
          </div>
          <nav className="hidden items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink-muted lg:flex">
            {menuItems.map((item) => (
              <span key={item} className="hover:text-ink">
                {item}
              </span>
            ))}
          </nav>
        </div>
        <SequenceTabs tabs={tabs} active={activeTab} />
        <div className="hidden items-center gap-4 text-xs text-ink-muted lg:flex">
          <div className="flex items-center gap-2">
            {tools.map(({ label, Icon, active }) => (
              <button
                key={label}
                type="button"
                className="tool-button"
                aria-label={label}
                data-active={active ? "true" : "false"}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <TimecodeLabel value="TC 01:04:22:15" />
          <span className="label-tech">24 FPS</span>
        </div>
      </div>
    </header>
  );
}
