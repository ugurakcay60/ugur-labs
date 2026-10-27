import type { Metadata } from "next";

export type Lang = "tr" | "en";

// Türkçe kaynak metin; `en` aynı şekle uymak zorunda (eksik çeviri derleme hatası verir)
const tr = {
  meta: {
    title: "Ugur Labs — Düşük Maliyetli, Yapay Zekâ Destekli Web & Mobil Ürünler",
    description:
      "Fikrinizi bakımı kolay, ölçeklenebilir ve işletme maliyeti düşük, yapay zekâ destekli bir web veya mobil ürüne dönüştürüyoruz.",
  },
  nav: { projects: "Projeler", links: "Linkler" },
  theme: "Açık / koyu tema",
  hero: {
    eyebrow: "Yazılım laboratuvarı · Fikirden yayına",
    title: ["Düşük maliyetle çalışan,", "yapay zekâ destekli", "ölçeklenebilir ürünler."],
    subtitle:
      "Fikrinizi; bakımı kolay, büyüdükçe ölçeklenen ve işletme maliyeti düşük bir web ya da mobil ürüne dönüştürüyoruz. Tasarım, mimari ve yayın tek elden.",
    cta: "Projeleri incele",
  },
  focus: [
    { title: "Fikirden çalışan ürüne", text: "Yapay zekâyı sürecin içine alarak fikri hızla, gerçek kullanıcıların deneyebileceği bir ürüne dönüştürmek." },
    { title: "Düşük işletme maliyeti", text: "Sunucusuz altyapı ve ücretsiz katmanlarla başlayan, büyüdükçe ölçeklenen mimari." },
    { title: "Güvenli ve sürdürülebilir", text: "Kullanıcı bazlı veri güvenliği, otomatik güvenlik taramaları ve devralınabilir, sade kod." },
  ],
  projects: {
    title: "Projeler",
    count: (n: number) => `${n} proje`,
    status: { live: "Yayında", beta: "Beta", wip: "Geliştiriliyor" },
  },
  caseStudy: { open: "Vaka çalışması · Mimari", eyebrow: "Vaka çalışması", close: "Kapat", visit: "Uygulamayı aç", inDiagram: "Diyagramda gör" },
  links: { title: "Faydalı linkler", subtitle: "Sık kullandığım adresler, tek yerde." },
  footer: { rights: "Tüm hakları saklıdır." },
};

const en: typeof tr = {
  meta: {
    title: "Ugur Labs — Low-Cost, AI-Powered Web & Mobile Products",
    description:
      "We turn your idea into an AI-powered web or mobile product that is easy to maintain, scales as you grow and is cheap to run.",
  },
  nav: { projects: "Projects", links: "Links" },
  theme: "Light / dark theme",
  hero: {
    eyebrow: "Software lab · Idea to launch",
    title: ["Low-cost,", "AI-powered", "products that scale."],
    subtitle:
      "We turn your idea into a web or mobile product that is easy to maintain, scales as you grow and stays cheap to run. Design, architecture and launch in one place.",
    cta: "See projects",
  },
  focus: [
    { title: "From idea to working product", text: "With AI in the loop, an idea quickly becomes something real users can try." },
    { title: "Low running costs", text: "Serverless infrastructure that starts on free tiers and scales as you grow." },
    { title: "Secure and maintainable", text: "Per-user data security, automated security scans and clean code anyone can take over." },
  ],
  projects: {
    title: "Projects",
    count: (n: number) => `${n} ${n === 1 ? "project" : "projects"}`,
    status: { live: "Live", beta: "Beta", wip: "In progress" },
  },
  caseStudy: { open: "Case study · Architecture", eyebrow: "Case study", close: "Close", visit: "Open the app", inDiagram: "See in diagram" },
  links: { title: "Useful links", subtitle: "Sites I use often, in one place." },
  footer: { rights: "All rights reserved." },
};

export const dictionary = { tr, en };

export const homeHref = { tr: "/", en: "/en/" } satisfies Record<Lang, string>;

export function pageMetadata(lang: Lang): Metadata {
  const { title, description } = dictionary[lang].meta;
  return {
    title,
    description,
    alternates: { canonical: homeHref[lang], languages: homeHref },
    openGraph: {
      title,
      description,
      url: homeHref[lang],
      siteName: "Ugur Labs",
      locale: lang === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },
  };
}
