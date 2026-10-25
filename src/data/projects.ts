// Yeni proje eklemek için listeye bir nesne eklemen yeterli; arayüz otomatik güncellenir.
export type Project = {
  title: string;
  description: string;
  link: string;
  tags?: string[];
  status?: "live" | "beta" | "wip";
};

export const projects: Project[] = [
  {
    title: "Diyet-AI",
    description: "AI-powered diet and habit tracking application.",
    link: "https://diyet-ai.ugur-labs.com",
    tags: ["Next.js", "Supabase", "AI"],
    status: "live",
  },
];
