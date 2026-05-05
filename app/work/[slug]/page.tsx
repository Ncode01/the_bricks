import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { WorkspaceShell } from "@/components/workspace-shell";
import { SectionShell } from "@/components/section-shell";
import { MonitorFrame } from "@/components/monitor-frame";
import { MetadataPanel } from "@/components/metadata-panel";
import { MarkerChip } from "@/components/marker-chip";
import { PanelShell } from "@/components/panel-shell";
import { TimelineRuler } from "@/components/timeline-ruler";
import { TrackLane } from "@/components/track-lane";
import { ClipBrick } from "@/components/clip-brick";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectPage({
  params
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  const { content, meta } = project;

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm]
      }
    },
    components: mdxComponents
  });

  const primaryItems = [
    { label: "Client", value: meta.client },
    { label: "Year", value: meta.year },
    { label: "Category", value: meta.category },
    { label: "Runtime", value: meta.runtime },
    { label: "Role", value: meta.role }
  ];

  const creditItems = meta.credits?.length
    ? [{ label: "Credits", value: meta.credits }]
    : [];

  const technicalItems = meta.technical
    ? Object.entries(meta.technical).map(([label, value]) => ({
        label,
        value
      }))
    : [];

  const sections = [
    "Brief",
    "Concept",
    "Production",
    "Cinematography",
    "Edit Rhythm",
    "Color / Finishing",
    "Outcome"
  ];

  return (
    <WorkspaceShell activeTab="Work">
      <SectionShell label="Project / Case Study">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <MonitorFrame label="Program Monitor" meta={meta.title} status="ACTIVE">
            <Image
              src={meta.heroImage}
              alt={meta.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </MonitorFrame>
          <div className="space-y-4">
            <PanelShell title="Sequence Info" meta="CUT 04" status="LOCKED">
              <div className="space-y-3">
                <span className="label-tech text-ink-muted">Project</span>
                <h1 className="text-3xl font-semibold">{meta.title}</h1>
                <p className="text-sm text-ink-muted">{meta.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  <MarkerChip label={meta.category} tone="violet" />
                  <MarkerChip label={meta.runtime} tone="lavender" />
                  <MarkerChip label={meta.year} tone="cyan" />
                </div>
              </div>
            </PanelShell>
            <MetadataPanel title="Project Metadata" items={primaryItems} />
            {creditItems.length ? (
              <MetadataPanel title="Credits" items={creditItems} />
            ) : null}
            {technicalItems.length ? (
              <MetadataPanel title="Technical" items={technicalItems} />
            ) : null}
          </div>
        </div>
      </SectionShell>

      <SectionShell label="Sequence Timeline" className="mt-10">
        <PanelShell
          title="Timeline"
          meta={`SEQ ${meta.title}`}
          tools={[{ label: "TC", value: "00:00:00" }]}
          bodyClassName="space-y-4"
        >
          <TimelineRuler inPoint="00:00:06" outPoint="02:18:12" />
          <TrackLane label="V1" meta="Narrative" type="video" status="LOCKED">
            {sections.map((section, index) => (
              <ClipBrick
                key={section}
                title={section}
                label={`SCENE ${String(index + 1).padStart(2, "0")}`}
                runtime="00:20:00"
                tone="neutral"
                size="sm"
              />
            ))}
          </TrackLane>
          <TrackLane label="A1" meta="Notes" type="audio">
            <ClipBrick
              title="Director Notes"
              label="NOTE"
              tone="audio"
              size="sm"
              runtime="00:45:00"
              status="SYNC"
            />
            <ClipBrick
              title="Client Feedback"
              label="NOTE"
              tone="audio"
              size="sm"
              runtime="00:30:00"
              status="REV"
            />
          </TrackLane>
        </PanelShell>
      </SectionShell>

      <SectionShell label="Inspector / Sequence Lanes" className="mt-10">
        <article className="max-w-none">{mdxContent}</article>
      </SectionShell>

      {meta.gallery?.length ? (
        <SectionShell label="Gallery" className="mt-10">
          <div className="grid gap-4 md:grid-cols-2">
            {meta.gallery.map((image) => (
              <div key={image} className="frame relative aspect-video">
                <Image
                  src={image}
                  alt={`${meta.title} still`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </SectionShell>
      ) : null}
    </WorkspaceShell>
  );
}
