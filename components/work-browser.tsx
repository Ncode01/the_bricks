"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ProjectRecord } from "@/lib/projects";
import { PanelShell } from "./panel-shell";
import { FilterBar } from "./filter-bar";
import { ClipBrick } from "./clip-brick";
import { MonitorFrame } from "./monitor-frame";
import { ProjectBin } from "./project-bin";
import { MarkerChip } from "./marker-chip";

export function WorkBrowser({ projects }: { projects: ProjectRecord[] }) {
  const router = useRouter();
  const categories = useMemo(() => {
    const unique = new Set(projects.map((project) => project.category));
    return ["All", ...Array.from(unique)];
  }, [projects]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");

  const filtered = useMemo(() => {
    if (activeCategory === "All") {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  useEffect(() => {
    if (!filtered.find((project) => project.slug === activeSlug)) {
      setActiveSlug(filtered[0]?.slug ?? "");
    }
  }, [filtered, activeSlug]);

  const activeProject =
    filtered.find((project) => project.slug === activeSlug) ?? filtered[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1.6fr)_320px]">
      <div className="space-y-4">
        <PanelShell title="Bins" meta="ARCHIVE" bodyClassName="p-0">
          <ProjectBin
            title="Categories"
            items={categories}
            activeItem={activeCategory}
            onSelect={setActiveCategory}
            variant="embedded"
          />
        </PanelShell>
        <PanelShell title="Smart Bins" meta="FILTERS">
          <div className="space-y-3 text-xs text-ink-muted">
            <div className="flex items-center justify-between">
              <span className="label-tech">Approved</span>
              <span>12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="label-tech">In Progress</span>
              <span>6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="label-tech">Locked</span>
              <span>4</span>
            </div>
          </div>
        </PanelShell>
      </div>

      <div className="space-y-4">
        <MonitorFrame
          label="Program Monitor"
          meta={activeProject?.title}
          status="BROWSE"
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="label-tech text-ink-muted">Preview</span>
              <span className="label-tech text-cyan">TC 00:00:12:08</span>
            </div>
          }
        >
          {activeProject ? (
            <Image
              src={activeProject.heroImage}
              alt={activeProject.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          ) : null}
        </MonitorFrame>

        <PanelShell
          title="Media Browser"
          meta={`${filtered.length} clips`}
          bodyClassName="space-y-4"
          tools={[{ label: "View", value: "Grid" }]}
        >
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search clips"
              className="input-field"
            />
            <FilterBar
              options={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <ClipBrick
                key={project.slug}
                title={project.title}
                client={project.client}
                year={project.year}
                category={project.category}
                runtime={project.runtime}
                role={project.role}
                thumbnail={project.heroImage}
                selected={project.slug === activeSlug}
                onSelect={() => setActiveSlug(project.slug)}
                onOpen={() => router.push(`/work/${project.slug}`)}
                tone="video"
                size="lg"
                status={project.featured ? "FEATURED" : "ARCHIVE"}
              />
            ))}
          </div>
        </PanelShell>
      </div>

      <div className="space-y-4">
        <PanelShell
          title="Inspector"
          meta={activeProject?.category}
          status={activeProject?.year}
        >
          {activeProject ? (
            <div className="space-y-4 text-sm">
              <div>
                <div className="label-tech text-ink-muted">Project</div>
                <div className="mt-2 text-base font-semibold">
                  {activeProject.title}
                </div>
                <p className="mt-2 text-xs text-ink-muted">
                  {activeProject.excerpt}
                </p>
              </div>
              <div className="space-y-2 text-xs text-ink-muted">
                <div className="flex items-center justify-between">
                  <span className="label-tech">Client</span>
                  <span>{activeProject.client}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="label-tech">Runtime</span>
                  <span>{activeProject.runtime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="label-tech">Role</span>
                  <span>{activeProject.role}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <MarkerChip label={activeProject.category} tone="violet" />
                <MarkerChip label={activeProject.year} tone="lavender" />
                <MarkerChip label={activeProject.runtime} tone="cyan" />
              </div>
            </div>
          ) : null}
        </PanelShell>
      </div>
    </div>
  );
}
