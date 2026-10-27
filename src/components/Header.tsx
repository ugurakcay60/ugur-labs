import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { dictionary, homeHref, type Lang } from "@/i18n/dictionary";

const langs: Lang[] = ["tr", "en"];

export default function Header({ lang }: { lang: Lang }) {
  const t = dictionary[lang];

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo href={homeHref[lang]} />
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden gap-6 text-sm text-muted sm:flex">
            <a href="#projects" className="transition hover:text-foreground">{t.nav.projects}</a>
            <a href="#links" className="transition hover:text-foreground">{t.nav.links}</a>
          </nav>
          {/* Dil seçici: her dil ayrı statik sayfa (/ ve /en/) */}
          <div className="flex rounded-full border border-line p-0.5 font-mono text-xs">
            {langs.map((l) => (
              <Link
                key={l}
                href={homeHref[l]}
                hrefLang={l}
                aria-current={l === lang ? "page" : undefined}
                className={`rounded-full px-2.5 py-1 uppercase transition ${
                  l === lang ? "bg-foreground text-background" : "text-muted hover:text-foreground"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>
          <ThemeToggle label={t.theme} />
        </div>
      </div>
    </header>
  );
}
