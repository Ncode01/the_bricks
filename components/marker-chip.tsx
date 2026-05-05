import { cn } from "@/lib/utils";

const toneStyles = {
  violet: "border-violet/40 bg-violet/15 text-ink",
  lavender: "border-lavender/40 bg-lavender/15 text-ink",
  cyan: "border-cyan/40 bg-cyan/15 text-ink"
};

export function MarkerChip({
  label,
  tone = "violet",
  className
}: {
  label: string;
  tone?: "violet" | "lavender" | "cyan";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-2 py-1 text-[10px] uppercase tracking-[0.2em]",
        toneStyles[tone],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
