import type { Lang } from "@/i18n/dictionary";

// Sayfanın altındaki "Faydalı linkler" bölümü; grup veya link eklemek için bu listeyi düzenle.
export type LinkGroup = {
  title: Record<Lang, string>;
  links: { name: string; href: string }[];
};

export const linkGroups: LinkGroup[] = [
  {
    title: { tr: "Kamu", en: "Government (TR)" },
    links: [
      { name: "e-Devlet", href: "https://www.turkiye.gov.tr" },
      { name: "e-Nabız", href: "https://enabiz.gov.tr" },
      { name: "MHRS", href: "https://www.mhrs.gov.tr" },
      { name: "GİB Dijital Vergi Dairesi", href: "https://dijital.gib.gov.tr" },
    ],
  },
  {
    title: { tr: "Yapay Zekâ", en: "AI" },
    links: [
      { name: "Claude", href: "https://claude.ai" },
      { name: "Claude Code", href: "https://claude.com/product/claude-code" },
      { name: "ChatGPT", href: "https://chatgpt.com" },
      { name: "Gemini", href: "https://gemini.google.com" },
    ],
  },
  {
    title: { tr: "Geliştirici", en: "Developer" },
    links: [
      { name: "GitHub", href: "https://github.com" },
      { name: "MDN Web Docs", href: "https://developer.mozilla.org" },
      { name: "Next.js Docs", href: "https://nextjs.org/docs" },
      { name: "Supabase", href: "https://supabase.com" },
    ],
  },
  {
    title: { tr: "Öğrenme", en: "Learning" },
    links: [
      { name: "BTK Akademi", href: "https://www.btkakademi.gov.tr" },
      { name: "freeCodeCamp", href: "https://www.freecodecamp.org" },
      { name: "Coursera", href: "https://www.coursera.org" },
      { name: "Khan Academy", href: "https://www.khanacademy.org" },
    ],
  },
];
