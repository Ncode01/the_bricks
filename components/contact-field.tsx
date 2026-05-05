import { cn } from "@/lib/utils";

export function ContactField({
  label,
  name,
  type = "text",
  options,
  placeholder,
  className
}: {
  label: string;
  name: string;
  type?: "text" | "email" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-2 text-sm", className)}>
      <span className="label-tech text-ink-muted">{label}</span>
      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          className="min-h-[140px] w-full border border-divider bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-cyan"
        />
      ) : type === "select" ? (
        <select
          name={name}
          className="w-full border border-divider bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-cyan"
          defaultValue=""
        >
          <option value="" disabled>
            Select
          </option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="w-full border border-divider bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-cyan"
        />
      )}
    </label>
  );
}
