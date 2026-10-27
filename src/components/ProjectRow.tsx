import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { dictionary, type Lang } from "@/i18n/dictionary";

type Props = { project: Project; index: number; lang: Lang };

export default function ProjectRow({ project, index, lang }: Props) {
  const { title, description, link, tags, status } = project;
  const t = dictionary[lang].projects;

  return (
    <li>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid grid-cols-[2.5rem_1fr_auto] gap-x-4 border-b border-line py-8 transition-colors hover:bg-surface sm:grid-cols-[4rem_1fr_auto] sm:px-4"
      >
        <span className="pt-2 font-mono text-sm text-muted">{String(index).padStart(2, "0")}</span>
        <div>
          <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
            {title}
          </h3>
          <p className="mt-2 max-w-xl leading-relaxed text-muted">{description[lang]}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted">
            {status && (
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="size-1.5 rounded-full bg-accent" />
                {t.status[status]}
              </span>
            )}
            {tags?.map((tag) => <span key={tag}>{tag}</span>)}
            <span className="hidden sm:inline">{new URL(link).host}</span>
          </div>
        </div>
        <ArrowUpRight className="mt-1.5 size-6 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </a>
    </li>
  );
}
