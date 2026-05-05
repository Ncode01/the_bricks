"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Hand,
  Magnet,
  MousePointer,
  Scissors,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { PanelShell } from "./panel-shell";
import { SequenceDock } from "./sequence-dock";
import { MonitorFrame } from "./monitor-frame";
import { TransportControls } from "./transport-controls";
import { PlayheadNav } from "./playhead-nav";
import { TimelineRuler } from "./timeline-ruler";
import { TrackLane } from "./track-lane";
import { ClipBrick, AudioClipBrick, VideoClipBrick } from "./clip-brick";
import { ProjectBin } from "./project-bin";
import { MarkerChip } from "./marker-chip";
import { TimecodeLabel } from "./timecode-label";
import type { PlayheadMarker } from "./playhead-nav";
import type { ProjectRecord } from "@/lib/projects";

const toolset = [
  { label: "Select", Icon: MousePointer, active: true },
  { label: "Trim", Icon: Scissors },
  { label: "Hand", Icon: Hand },
  { label: "Magnet", Icon: Magnet },
  { label: "Zoom In", Icon: ZoomIn },
  { label: "Zoom Out", Icon: ZoomOut }
];

const clipStatuses: Record<string, string> = {
  "arc-fjord": "APPROVED",
  "signal-choir": "GRADE"
};

export function HomeWorkspace({
  featured,
  projects
}: {
  featured: ProjectRecord[];
  projects: ProjectRecord[];
}) {
  const router = useRouter();
  const initialSlug = featured[0]?.slug ?? projects[0]?.slug ?? "";
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [sourceIndex, setSourceIndex] = useState(0);

  const activeProject = useMemo(() => {
    return projects.find((project) => project.slug === activeSlug) ?? featured[0];
  }, [activeSlug, featured, projects]);

  const sourceFrames = useMemo(() => {
    if (!activeProject) {
      return [];
    }

    return [activeProject.heroImage, ...(activeProject.gallery ?? [])].slice(0, 4);
  }, [activeProject]);

  const activeIndex = Math.max(
    0,
    featured.findIndex((project) => project.slug === activeSlug)
  );

  const playheadPosition = `${12 + activeIndex * 18}%`;

  const markers: PlayheadMarker[] = featured.map((project, index) => ({
    label: project.title.split(" ")[0].toUpperCase(),
    position: `${12 + index * 18}%`,
    tone: index % 2 === 0 ? "violet" : "lavender"
  }));

  const sequenceItems = featured.map((project) => ({
    id: project.slug,
    label: project.title,
    status: clipStatuses[project.slug] ?? "CUT"
  }));

  const handleSelect = (slug: string) => {
    setActiveSlug(slug);
    setSourceIndex(0);
  };

  const handleOpen = (slug: string) => {
    router.push(`/work/${slug}`);
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1.6fr)_320px]">
        <div className="space-y-4">
          <PanelShell title="Project Bin" meta="BIN 01" bodyClassName="p-0">
            <ProjectBin
              title="Sequences"
              items={featured.map((project) => project.title)}
              activeItem={activeProject?.title}
              variant="embedded"
            />
          </PanelShell>
          <PanelShell title="Tools" meta="EDIT" bodyClassName="grid grid-cols-3 gap-2">
            {toolset.map(({ label, Icon, active }) => (
              <button
                key={label}
                type="button"
                className="tool-button"
                aria-label={label}
                data-active={active ? "true" : "false"}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </PanelShell>
          <PanelShell
            title="System"
            meta="SYNC"
            tools={[{ label: "CPU", value: "38%" }, { label: "RAM", value: "62%" }]}
          >
            <div className="space-y-3 text-xs text-ink-muted">
              <div className="flex items-center justify-between">
                <span className="label-tech">Autosave</span>
                <span>00:42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="label-tech">Scratch</span>
                <span>OK</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="label-tech">Sequence</span>
                <span>{activeProject?.year}</span>
              </div>
            </div>
          </PanelShell>
        </div>

        <div className="space-y-4">
          <PanelShell
            title="Sequence Dock"
            meta="MASTER CUT"
            bodyClassName="p-2"
            tools={[{ label: "Rate", value: "24 FPS" }]}
          >
            <SequenceDock
              items={sequenceItems}
              activeId={activeSlug}
              onSelect={handleSelect}
            />
          </PanelShell>

          <div className="grid gap-4 lg:grid-cols-2">
            <MonitorFrame
              label="Program Monitor"
              meta={activeProject?.title}
              status={clipStatuses[activeProject?.slug ?? ""] ?? "ACTIVE"}
              footer={
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <TransportControls />
                  <TimecodeLabel value="TC 01:12:08:04" />
                </div>
              }
            >
              {activeProject ? (
                <>
                  <Image
                    src={activeProject.heroImage}
                    alt={activeProject.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <div className="monitor-overlay">
                    <span className="label-tech text-ink-muted">REC</span>
                    <span className="label-tech text-cyan">LIVE</span>
                  </div>
                </>
              ) : null}
            </MonitorFrame>

            <MonitorFrame
              label="Source Monitor"
              meta="ALT / BTS"
              footer={
                <div className="flex items-center gap-2 overflow-x-auto">
                  {sourceFrames.map((frame, index) => (
                    <button
                      key={frame}
                      type="button"
                      onClick={() => setSourceIndex(index)}
                      className={
                        index === sourceIndex
                          ? "source-thumb source-thumb-active"
                          : "source-thumb"
                      }
                      style={{ backgroundImage: `url(${frame})` }}
                      aria-label={`Source frame ${index + 1}`}
                    />
                  ))}
                </div>
              }
            >
              {sourceFrames[sourceIndex] ? (
                <Image
                  src={sourceFrames[sourceIndex]}
                  alt="Source frame"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : null}
            </MonitorFrame>
          </div>
        </div>

        <div className="space-y-4">
          <PanelShell
            title="Inspector"
            meta={activeProject?.category}
            status={clipStatuses[activeProject?.slug ?? ""] ?? "CUT"}
          >
            <div className="space-y-4 text-sm">
              <div>
                <div className="label-tech text-ink-muted">Project</div>
                <div className="mt-2 text-base font-semibold">
                  {activeProject?.title}
                </div>
                <p className="mt-2 text-xs text-ink-muted">
                  {activeProject?.excerpt}
                </p>
              </div>
              <div className="grid gap-3">
                <div>
                  <div className="label-tech text-ink-muted">Video</div>
                  <div className="mt-2 text-xs text-ink">
                    {activeProject?.technical?.camera ?? "ARRI Alexa Mini LF"}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {activeProject?.technical?.format ?? "4.5K ProRes"}
                  </div>
                </div>
                <div>
                  <div className="label-tech text-ink-muted">Credits</div>
                  <div className="mt-2 text-xs text-ink">
                    {activeProject?.credits?.[0] ?? "Director / DP"}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {activeProject?.credits?.[1] ?? "Producer"}
                  </div>
                </div>
                <div>
                  <div className="label-tech text-ink-muted">Deliverables</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <MarkerChip label="4K Master" tone="violet" />
                    <MarkerChip label="Cutdowns" tone="lavender" />
                    <MarkerChip label="Stills" tone="cyan" />
                  </div>
                </div>
              </div>
            </div>
          </PanelShell>
          <PanelShell title="Notes" meta="Client">
            <div className="space-y-3 text-xs text-ink-muted">
              <p>
                Confirm final color pass and sound mix alignment. Awaiting
                feedback on new logo lockup.
              </p>
              <div className="flex items-center justify-between">
                <span className="label-tech">Status</span>
                <span>{clipStatuses[activeProject?.slug ?? ""] ?? "CUT"}</span>
              </div>
            </div>
          </PanelShell>
        </div>
      </div>

      <PanelShell
        title="Timeline"
        meta="SEQ A"
        tools={[{ label: "TC", value: "00:00:00" }, { label: "Zoom", value: "40%" }]}
        bodyClassName="space-y-4"
      >
        <div data-scroll-sequence className="space-y-4">
          <TimelineRuler inPoint="00:00:12" outPoint="02:40:08" />
          <TrackLane label="V1" meta="Picture" type="video" status="LIVE">
            {featured.map((project) => (
              <VideoClipBrick
                key={project.slug}
                title={project.title}
                client={project.client}
                category={project.category}
                year={project.year}
                runtime={project.runtime}
                role={project.role}
                thumbnail={project.heroImage}
                selected={project.slug === activeSlug}
                onSelect={() => handleSelect(project.slug)}
                onOpen={() => handleOpen(project.slug)}
                size="lg"
                status={clipStatuses[project.slug] ?? "CUT"}
              />
            ))}
          </TrackLane>
          <TrackLane label="B2" meta="Insert" type="video">
            {featured.slice(1, 3).map((project) => (
              <ClipBrick
                key={project.slug}
                title={project.title}
                client={project.client}
                category={project.category}
                year={project.year}
                runtime={project.runtime}
                thumbnail={project.heroImage}
                tone="neutral"
                selected={project.slug === activeSlug}
                onSelect={() => handleSelect(project.slug)}
                onOpen={() => handleOpen(project.slug)}
              />
            ))}
            <ClipBrick
              title="Studio Texture Plates"
              client="Internal"
              category="Light Studies"
              year="2026"
              runtime="00:20:00"
              tone="neutral"
              status="ALT"
            />
          </TrackLane>
          <TrackLane label="A1" meta="Audio" type="audio">
            <AudioClipBrick
              title="Score Pass 04"
              client="Composer Network"
              category="Sound"
              year="2026"
              runtime="02:08:14"
              role="Sound and mix"
              status="MIX"
            />
            <AudioClipBrick
              title="Field Texture Roll"
              client="Location Unit"
              category="Ambience"
              year="2026"
              runtime="01:40:09"
              role="Capture and design"
              status="PRINT"
            />
          </TrackLane>
        </div>
        <PlayheadNav
          markers={markers}
          position={playheadPosition}
          activeLabel={markers[activeIndex]?.label}
        />
      </PanelShell>
    </section>
  );
}
