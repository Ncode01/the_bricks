import Image from "next/image";
import { WorkspaceShell } from "@/components/workspace-shell";
import { SectionShell } from "@/components/section-shell";
import { InspectorSection } from "@/components/inspector-section";
import { MetadataPanel } from "@/components/metadata-panel";
import { MarkerChip } from "@/components/marker-chip";
import { PanelShell } from "@/components/panel-shell";
import { TimelineRuler } from "@/components/timeline-ruler";
import { TrackLane } from "@/components/track-lane";
import { ClipBrick } from "@/components/clip-brick";

export default function AboutPage() {
  return (
    <WorkspaceShell activeTab="About">
      <SectionShell label="Studio Profile">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <PanelShell title="System Profile" meta="NODE 04" status="ACTIVE">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold">
                An edit suite built around cinematography.
              </h1>
              <p className="text-sm text-ink-muted">
                The Bricks Studio operates like a premium nonlinear editing bay.
                We design every frame with the same discipline we bring to the
                timeline. Our crews are lean, collaborative, and tuned for
                precision.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <InspectorSection title="Philosophy">
                  <p>
                    Controlled light. Measured motion. Editorial rhythm that keeps
                    viewers locked into the narrative.
                  </p>
                </InspectorSection>
                <InspectorSection title="Workflow">
                  <p>
                    Pre-light, capture, and finish as one sequence. We build a
                    clean path from brief to final export.
                  </p>
                </InspectorSection>
              </div>
            </div>
          </PanelShell>
          <div className="space-y-4">
            <div className="frame relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80"
                alt="Studio still"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <MetadataPanel
              title="Core Units"
              items={[
                { label: "Team", value: "Director, DP, Producer" },
                { label: "Crew", value: "Camera, Lighting, Grip" },
                { label: "Post", value: "Edit, Color, Sound" }
              ]}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell label="Capabilities" className="mt-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <PanelShell title="Capability Stack" meta="MODULES">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Modular crews built around the story.
              </h2>
              <p className="text-sm text-ink-muted">
                We scale crews to match the intent. From controlled studio work to
                complex location shoots, our process keeps the visual language
                consistent and clean.
              </p>
              <div className="flex flex-wrap gap-2">
                <MarkerChip label="Commercial" tone="violet" />
                <MarkerChip label="Documentary" tone="lavender" />
                <MarkerChip label="Branded Film" tone="cyan" />
                <MarkerChip label="Fashion" tone="violet" />
              </div>
            </div>
          </PanelShell>
          <MetadataPanel
            title="Gear Stack"
            items={[
              { label: "Camera", value: "ARRI Alexa Mini LF" },
              { label: "Lenses", value: "Cooke S4, Atlas Orion" },
              { label: "Lighting", value: "Aputure, Astera" },
              { label: "Grip", value: "Matthews, Ronford" }
            ]}
          />
        </div>
      </SectionShell>

      <SectionShell label="Workflow Timeline" className="mt-10">
        <PanelShell title="Production Tracks" meta="SEQ PROFILE" bodyClassName="space-y-4">
          <TimelineRuler inPoint="00:00:00" outPoint="01:40:00" />
          <TrackLane label="V1" meta="Pre" type="video">
            <ClipBrick title="Briefing" label="SCENE 01" tone="neutral" size="sm" />
            <ClipBrick title="Look Dev" label="SCENE 02" tone="neutral" size="sm" />
          </TrackLane>
          <TrackLane label="V2" meta="Production" type="video">
            <ClipBrick title="Capture" label="SCENE 03" tone="neutral" size="sm" />
            <ClipBrick title="Edit" label="SCENE 04" tone="neutral" size="sm" />
          </TrackLane>
          <TrackLane label="A1" meta="Finish" type="audio">
            <ClipBrick title="Color" label="PASS" tone="audio" size="sm" />
            <ClipBrick title="Delivery" label="EXPORT" tone="audio" size="sm" />
          </TrackLane>
        </PanelShell>
      </SectionShell>
    </WorkspaceShell>
  );
}
