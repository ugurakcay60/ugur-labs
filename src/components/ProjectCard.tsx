import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

const statusLabel = { live: "Live", beta: "Beta", wip: "In progress" };

export default function ProjectCard({ title, description, link, tags, status }: Project) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-accent/60"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <ArrowUpRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
      </div>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 font-mono text-xs">
        {status && (
          <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            {statusLabel[status]}
          </span>
        )}
        {tags?.map((tag) => (
          <span key={tag} className="rounded-full border border-line px-2.5 py-1 text-muted">
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}
