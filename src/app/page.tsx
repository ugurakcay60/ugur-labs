import { ArrowDown, ArrowUpRight, BrainCircuit, Layers, Smartphone, Sprout } from "lucide-react";
import Logo from "@/components/Logo";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const focusAreas = [
  { icon: Smartphone, title: "Web & Mobile Apps", text: "Fast, modern products built with AI in the loop." },
  { icon: Layers, title: "Software Architecture", text: "Clean, scalable systems that are easy to grow." },
  { icon: Sprout, title: "Personal Growth", text: "Tools and notes for building better habits." },
];

export default function Home() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex gap-6 text-sm text-muted">
          <a href="#projects" className="transition hover:text-foreground">Projects</a>
          <a href="#contact" className="transition hover:text-foreground">Contact</a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="bg-grid pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 sm:pt-28">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
              <BrainCircuit className="size-3.5 text-accent" />
              AI-first product lab
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Building smart software with{" "}
              <span className="bg-gradient-to-r from-accent to-sky-400 bg-clip-text text-transparent">AI</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              AI-Powered Web & Mobile App Development, Software Architecture, and Personal Growth.
            </p>
            <a
              href="#projects"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
            >
              See projects <ArrowDown className="size-4" />
            </a>
          </div>
        </section>

        {/* Odak alanları */}
        <section className="mx-auto grid max-w-5xl gap-4 px-6 sm:grid-cols-3">
          {focusAreas.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-line p-6">
              <Icon className="size-5 text-accent" />
              <h2 className="mt-4 font-medium">{title}</h2>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </section>

        {/* Projeler: src/data/projects.ts dosyasından beslenir */}
        <section id="projects" className="mx-auto max-w-5xl scroll-mt-8 px-6 py-24">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
            <span className="font-mono text-xs text-muted">{projects.length} shipped</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.link} {...project} />
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Ugur Labs</span>
          <a href="https://github.com/ugurakcay60" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-foreground">
            github.com/ugurakcay60 <ArrowUpRight className="size-4" />
          </a>
        </div>
      </footer>
    </>
  );
}
