import { cn } from "@/lib/utils";

export function SectionShell({
  label,
  children,
  className
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "surface relative overflow-hidden px-6 py-6 md:px-8",
        className
      )}
    >
      {label ? (
        <div className="mb-4 flex items-center justify-between text-xs text-ink-muted">
          <span className="label-tech">{label}</span>
          <span className="label-tech">CUT 02</span>
        </div>
      ) : null}
      {children}
    </section>
  );
}
