"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ProjectRecord } from "@/lib/projects";
import { ClipBrick } from "./clip-brick";
import { FilterBar } from "./filter-bar";

export function WorkArchive({ projects }: { projects: ProjectRecord[] }) {
  const categories = useMemo(() => {
    const unique = new Set(projects.map((project) => project.category));
    return ["All", ...Array.from(unique)];
  }, [projects]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") {
      return projects;
    }

    return projects.filter((project) => project.category === active);
  }, [active, projects]);

  return (
    <section className="space-y-6">
      <FilterBar options={categories} active={active} onChange={setActive} />
      <motion.div
        layout
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
            >
              <ClipBrick
                title={project.title}
                client={project.client}
                year={project.year}
                category={project.category}
                runtime={project.runtime}
                role={project.role}
                href={`/work/${project.slug}`}
                thumbnail={project.heroImage}
                tone="video"
                size="lg"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
