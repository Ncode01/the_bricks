import Link from "next/link";
import { TimecodeLabel } from "./timecode-label";

export function FooterStatusBar() {
  return (
    <footer className="border-t border-divider bg-panel/70">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-3 text-xs text-ink-muted lg:px-10">
        <div className="flex items-center gap-4">
          <span className="label-tech">READY</span>
          <span>Autosave 00:38 / Scratch OK</span>
        </div>
        <div className="flex items-center gap-4">
          <TimecodeLabel value="OUT 01:12:08:04" />
          <span className="label-tech">RENDER QUEUE 02</span>
          <Link href="/contact" className="label-tech text-ink">
            BOOKING
          </Link>
        </div>
      </div>
    </footer>
  );
}
