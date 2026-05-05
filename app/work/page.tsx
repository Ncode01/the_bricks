import { WorkspaceShell } from "@/components/workspace-shell";
import { SectionShell } from "@/components/section-shell";
import { WorkBrowser } from "@/components/work-browser";
import { getAllProjects } from "@/lib/projects";

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <WorkspaceShell activeTab="Work">
      <SectionShell label="Project Bin">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Archive Sequences</h1>
              <p className="mt-2 text-sm text-ink-muted">
                Browse the full library of commercial, documentary, and branded
                projects. Clips load into the preview monitor and inspector.
              </p>
            </div>
            <span className="label-tech text-ink-muted">
              BIN 01 / CURATED
            </span>
          </div>
          <WorkBrowser projects={projects} />
        </div>
      </SectionShell>
    </WorkspaceShell>
  );
}
