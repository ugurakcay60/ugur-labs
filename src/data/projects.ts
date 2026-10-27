import type { Lang } from "@/i18n/dictionary";

// Yeni proje eklemek için listeye bir nesne eklemen yeterli; arayüz otomatik güncellenir.
export type Project = {
  title: string;
  description: Record<Lang, string>;
  link: string;
  tags?: string[];
  status?: "live" | "beta" | "wip";
};

export const projects: Project[] = [
  {
    title: "Diyet-AI",
    description: {
      tr: "Yapay zekâ destekli diyet ve alışkanlık takip uygulaması.",
      en: "AI-powered diet and habit tracking application.",
    },
    link: "https://diyet-ai.ugur-labs.com",
    tags: ["Next.js", "Supabase", "AI"],
    status: "live",
  },
  {
    title: "Tık Sayacı",
    description: {
      tr: "Sayaç, çoklu sayaç, kronometre, tempo ölçer ve metin sayacı; yanında klavye yazım, tık hızı, tepki süresi ve hedef testleri.",
      en: "Counter, multi-counter, stopwatch, tap tempo and text counter, plus typing, click-speed, reaction time and aim tests (in Turkish).",
    },
    // Dosya Tik Sayaci/siteye-aktar.mjs ile public/tik-sayaci/ içine üretilir
    link: "https://ugur-labs.com/tik-sayaci/",
    tags: ["HTML", "CSS", "JavaScript"],
    status: "live",
  },
  {
    title: "Finans Paneli",
    description: {
      tr: "Gelir ve giderleri kaydedip bakiyeyi ve kategorilere göre harcamaları grafikle gösteren kişisel finans paneli. Veriler tarayıcıda kalır.",
      en: "Personal finance dashboard that tracks income and expenses and charts balance and spending by category. Data stays in your browser (in Turkish).",
    },
    // finans.ugur-labs.com DNS kaydı eklenince o adrese geçilecek
    link: "https://finans-dashboard-pi.vercel.app",
    tags: ["React", "Vite", "Recharts"],
    status: "live",
  },
];
