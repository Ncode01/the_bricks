import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ProjectMeta = {
  title: string;
  client: string;
  year: string;
  category: string;
  runtime: string;
  role: string;
  excerpt: string;
  heroImage: string;
  gallery?: string[];
  credits?: string[];
  technical?: Record<string, string>;
  featured?: boolean;
};

export type ProjectRecord = ProjectMeta & {
  slug: string;
};

const projectsDir = path.join(process.cwd(), "content", "projects");

function getProjectFiles() {
  if (!fs.existsSync(projectsDir)) {
    return [] as string[];
  }

  return fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".mdx"));
}

export function getAllProjects(): ProjectRecord[] {
  return getProjectFiles()
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(projectsDir, file), "utf8");
      const { data } = matter(raw);

      return {
        slug,
        ...(data as ProjectMeta)
      };
    })
    .sort((a, b) => Number(b.year) - Number(a.year));
}

export function getFeaturedProjects(): ProjectRecord[] {
  return getAllProjects().filter((project) => project.featured);
}

export function getProjectSlugs(): string[] {
  return getProjectFiles().map((file) => file.replace(/\.mdx$/, ""));
}

export function getProjectBySlug(slug: string) {
  const fullPath = path.join(projectsDir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    meta: data as ProjectMeta,
    content
  };
}
