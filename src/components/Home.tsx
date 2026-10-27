import { ArrowDown, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import HtmlLang from "@/components/HtmlLang";
import ProjectRow from "@/components/ProjectRow";
import { linkGroups } from "@/data/links";
import { projects } from "@/data/projects";
import { dictionary, type Lang } from "@/i18n/dictionary";

const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const github = "https://github.com/ugurakcay60";

// Tek sayfalık site; / (TR) ve /en/ (EN) bu bileşeni farklı `lang` ile render eder
export default function Home({ lang }: { lang: Lang }) {
  const t = dictionary[lang];
  const [before, accent, after] = t.hero.title;

  return (
    <>
      <HtmlLang lang={lang} />
      <Header lang={lang} />

      <main className="flex-1">
        {/* Hero */}
        <section className={`${container} pb-20 pt-16 sm:pb-28 sm:pt-28`}>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="h-px w-8 bg-foreground/40" />
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-8 max-w-5xl text-balance text-[clamp(2.6rem,7.5vw,6rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            {before}{" "}
            <em className="font-serif font-normal tracking-[-0.02em] text-muted">{accent}</em>{" "}
            {after}
          </h1>
          <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-lg leading-relaxed text-muted">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3 text-sm font-medium">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-accent-foreground shadow-[0_8px_24px_-10px_var(--accent)] transition hover:brightness-110"
              >
                {t.hero.cta} <ArrowDown className="size-4" />
              </a>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 transition hover:border-foreground/30"
              >
                GitHub <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Odak alanları */}
        <section className="border-y border-line">
          <div className={`${container} grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0`}>
            {t.focus.map(({ title, text }, i) => (
              <div key={title} className="py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h2 className="mt-3 font-medium">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projeler: src/data/projects.ts dosyasından beslenir */}
        <section id="projects" className={`${container} scroll-mt-20 py-24`}>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-3xl font-medium tracking-tight">{t.projects.title}</h2>
            <span className="font-mono text-xs text-muted">{t.projects.count(projects.length)}</span>
          </div>
          <ul className="border-t border-line">
            {projects.map((project, i) => (
              <ProjectRow key={project.link} project={project} index={i + 1} lang={lang} />
            ))}
          </ul>
        </section>

        {/* Faydalı linkler: src/data/links.ts dosyasından beslenir */}
        <section id="links" className="scroll-mt-20 border-t border-line bg-surface">
          <div className={`${container} py-20`}>
            <h2 className="text-3xl font-medium tracking-tight">{t.links.title}</h2>
            <p className="mt-2 text-muted">{t.links.subtitle}</p>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {linkGroups.map((group) => (
                <div key={group.title.en}>
                  <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-muted">{group.title[lang]}</h3>
                  <ul className="mt-4">
                    {group.links.map(({ name, href }) => (
                      <li key={href}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between border-b border-line py-2.5 text-[15px] text-foreground/80 transition-colors hover:text-foreground"
                        >
                          {name}
                          <ArrowUpRight className="size-3.5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className={`${container} flex flex-col gap-3 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between`}>
          <span>
            © {new Date().getFullYear()} Ugur Labs. {t.footer.rights}
          </span>
          <a href={github} target="_blank" rel="noopener noreferrer" className="transition hover:text-foreground">
            github.com/ugurakcay60
          </a>
        </div>
      </footer>
    </>
  );
}
