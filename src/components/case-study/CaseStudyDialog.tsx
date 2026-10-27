"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Workflow, X } from "lucide-react";
import { caseStudies, type CaseStudyId, type IconName } from "@/data/case-studies";
import { dictionary, type Lang } from "@/i18n/dictionary";
import DiyetAiDiagram from "./DiyetAiDiagram";
import { icons } from "./icons";

const diagrams: Record<CaseStudyId, typeof DiyetAiDiagram> = { "diyet-ai": DiyetAiDiagram };

type Props = { id: CaseStudyId; lang: Lang; link: string };

// Proje satırının altındaki küçük link + mimariyi anlatan açılır pencere (yerel <dialog>)
export default function CaseStudyDialog({ id, lang, link }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const cs = caseStudies[id][lang];
  const t = dictionary[lang].caseStudy;
  const Diagram = diagrams[id];
  const titleId = `case-study-${id}`;
  // Diyagramdaki kutu ve sekmeler aynı seçimi paylaşır; ilk parça varsayılan
  const [active, setActive] = useState<IconName>(cs.parts[0].icon);
  const part = cs.parts.find((p) => p.icon === active) ?? cs.parts[0];
  const PartIcon = icons[part.icon];

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted underline decoration-line underline-offset-4 transition hover:text-accent hover:decoration-accent"
      >
        <Workflow className="size-3.5" />
        {t.open}
      </button>

      <dialog
        ref={ref}
        aria-labelledby={titleId}
        // Pencerenin dışına (arka plana) tıklayınca kapanır
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(64rem,calc(100%-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-background/90 px-5 py-4 backdrop-blur sm:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{t.eyebrow}</p>
            <h2 id={titleId} className="mt-1 text-2xl font-medium tracking-tight">
              {cs.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t.close}
            className="rounded-full border border-line p-2 text-muted transition hover:border-foreground/30 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-12 px-5 py-8 sm:px-8">
          <div className="space-y-5">
            <p className="max-w-3xl text-balance text-[clamp(1.6rem,4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em]">
              {cs.tagline}
            </p>
            <p className="max-w-3xl text-lg leading-relaxed text-muted">{cs.intro}</p>
          </div>

          <section>
            <h3 className="text-xl font-medium tracking-tight">{cs.partsTitle}</h3>
            <p className="mt-1 text-sm text-muted">{cs.partsHint}</p>

            <figure className="mt-5">
              <div className="overflow-x-auto rounded-xl border border-line bg-surface p-3 shadow-sm sm:p-5">
                <div className="min-w-[44rem]">
                  <Diagram lang={lang} active={active} onSelect={setActive} />
                </div>
              </div>
              <figcaption className="mt-2 font-mono text-xs text-muted sm:hidden">← {cs.diagramHint} →</figcaption>
            </figure>

            <div role="tablist" aria-label={cs.partsTitle} className="mt-5 flex flex-wrap gap-2">
              {cs.parts.map(({ icon, role }) => {
                const Icon = icons[icon];
                const selected = icon === active;
                return (
                  <button
                    key={icon}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(icon)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition ${
                      selected
                        ? "border-accent bg-accent text-background"
                        : "border-line text-muted hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {role}
                  </button>
                );
              })}
            </div>

            <article
              role="tabpanel"
              aria-live="polite"
              className="mt-4 rounded-xl border border-line border-l-2 border-l-accent bg-surface p-5 shadow-sm sm:p-6"
            >
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted">
                <PartIcon className="size-4 text-accent" />
                {part.role}
              </p>
              <h4 className="mt-3 text-2xl font-medium tracking-tight">{part.name}</h4>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted">{part.text}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {part.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section>
            <h3 className="text-xl font-medium tracking-tight">{cs.flowTitle}</h3>
            <ol className="mt-5 space-y-3">
              {cs.flow.map((step, i) => (
                <li key={step} className="flex gap-3 leading-relaxed">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-background">
                    {i + 1}
                  </span>
                  <span className="text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl leading-relaxed">{cs.outro}</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-85"
            >
              {t.visit} <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
