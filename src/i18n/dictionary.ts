import type { Metadata } from "next";

export type Lang = "tr" | "en";

// Türkçe kaynak metin; `en` aynı şekle uymak zorunda (eksik çeviri derleme hatası verir)
const tr = {
  meta: {
    title: "Ugur Labs — Yapay Zekâ Destekli Web & Mobil Geliştirme",
    description: "Yapay zekâ destekli web ve mobil uygulama geliştirme, yazılım mimarisi ve kişisel gelişim.",
  },
  nav: { projects: "Projeler", links: "Linkler" },
  theme: "Açık / koyu tema",
  hero: {
    eyebrow: "Bağımsız yazılım laboratuvarı",
    title: ["Fikirleri yapay zekâ ile", "çalışan ürünlere", "dönüştürüyorum."],
    subtitle: "Yapay zekâ destekli web ve mobil uygulama geliştirme, yazılım mimarisi ve kişisel gelişim.",
    cta: "Projeleri incele",
  },
  focus: [
    { title: "Web & Mobil Uygulamalar", text: "Yapay zekâyı sürecin içine alan, hızlı ve modern ürünler." },
    { title: "Yazılım Mimarisi", text: "Büyümeye hazır, sade ve sürdürülebilir sistemler." },
    { title: "Kişisel Gelişim", text: "Daha iyi alışkanlıklar için araçlar ve notlar." },
  ],
  projects: {
    title: "Projeler",
    count: (n: number) => `${n} proje`,
    status: { live: "Yayında", beta: "Beta", wip: "Geliştiriliyor" },
  },
  links: { title: "Faydalı linkler", subtitle: "Sık kullandığım adresler, tek yerde." },
  footer: { rights: "Tüm hakları saklıdır." },
};

const en: typeof tr = {
  meta: {
    title: "Ugur Labs — AI-Powered Web & Mobile Development",
    description: "AI-powered web & mobile app development, software architecture, and personal growth.",
  },
  nav: { projects: "Projects", links: "Links" },
  theme: "Light / dark theme",
  hero: {
    eyebrow: "Independent software lab",
    title: ["Turning ideas into", "working products", "with AI."],
    subtitle: "AI-powered web & mobile app development, software architecture, and personal growth.",
    cta: "See projects",
  },
  focus: [
    { title: "Web & Mobile Apps", text: "Fast, modern products built with AI in the loop." },
    { title: "Software Architecture", text: "Clean, scalable systems that are easy to grow." },
    { title: "Personal Growth", text: "Tools and notes for building better habits." },
  ],
  projects: {
    title: "Projects",
    count: (n: number) => `${n} ${n === 1 ? "project" : "projects"}`,
    status: { live: "Live", beta: "Beta", wip: "In progress" },
  },
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
