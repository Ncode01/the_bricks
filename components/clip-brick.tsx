import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, formatTimecode } from "@/lib/utils";
import { TimecodeLabel } from "./timecode-label";
import { MarkerChip } from "./marker-chip";

const clipStyles = cva(
  "clip-brick group relative flex min-h-[150px] flex-1 flex-col justify-between border border-divider px-4 py-3 transition-colors",
  {
    variants: {
      tone: {
        video: "bg-violet/15",
        audio: "bg-lavender/15",
        neutral: "bg-surface/80"
      },
      size: {
        sm: "min-w-[180px]",
        md: "min-w-[220px]",
        lg: "min-w-[260px]"
      },
      selected: {
        true: "clip-selected"
      }
    },
    defaultVariants: {
      tone: "video",
      size: "md"
    }
  }
);

export type ClipBrickProps = {
  title: string;
  label?: string;
  client?: string;
  year?: string;
  category?: string;
  runtime?: string;
  role?: string;
  href?: string;
  tags?: string[];
  scene?: string;
  status?: string;
  thumbnail?: string;
  onSelect?: () => void;
  onOpen?: () => void;
  className?: string;
} & VariantProps<typeof clipStyles>;

export function ClipBrick({
  title,
  label = "CLIP",
  client,
  year,
  category,
  runtime,
  role,
  href,
  tags,
  scene,
  status,
  thumbnail,
  onSelect,
  onOpen,
  tone,
  size,
  selected,
  className
}: ClipBrickProps) {
  const content = (
    <div className={cn(clipStyles({ tone, size, selected }), className)}>
      <span className="clip-handle clip-handle-left" />
      <span className="clip-handle clip-handle-right" />
      <div className="clip-preview">
        <div
          className="clip-scrub"
          style={
            thumbnail
              ? { backgroundImage: `url(${thumbnail})` }
              : { backgroundImage: "none" }
          }
        />
        <div className="clip-frames" />
      </div>
      <div className="flex items-center justify-between text-[10px] text-ink-muted">
        <span className="label-tech">{label}</span>
        {runtime ? <TimecodeLabel value={formatTimecode(runtime)} /> : null}
      </div>
      <div className="mt-3 space-y-2">
        <h3 className="text-base font-semibold leading-tight text-ink">
          {title}
        </h3>
        <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">
          {scene ? `${scene} / ` : ""}
          {client ? `${client} / ` : ""}
          {category ? `${category} / ` : ""}
          {year ?? ""}
        </div>
        {role ? <div className="text-xs text-ink-muted">{role}</div> : null}
      </div>
      {tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <MarkerChip key={tag} label={tag} tone="lavender" />
          ))}
        </div>
      ) : null}
      {status ? (
        <div className="clip-status label-tech text-ink-muted">{status}</div>
      ) : null}
    </div>
  );

  if (href && !onSelect && !onOpen) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="block text-left"
      onClick={onSelect}
      onDoubleClick={onOpen}
    >
      {content}
    </button>
  );
}

export function AudioClipBrick(props: Omit<ClipBrickProps, "tone">) {
  return <ClipBrick {...props} tone="audio" label={props.label ?? "AUDIO"} />;
}

export function VideoClipBrick(props: Omit<ClipBrickProps, "tone">) {
  return <ClipBrick {...props} tone="video" label={props.label ?? "VIDEO"} />;
}
