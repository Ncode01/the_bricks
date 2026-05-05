import { cn } from "@/lib/utils";

export function InspectorSection({
  title,
  children,
  className
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel p-4", className)}>
      <div className="label-tech text-ink-muted">{title}</div>
      <div className="mt-3 space-y-3 text-sm text-ink">{children}</div>
    </section>
  );
}
