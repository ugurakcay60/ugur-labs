import { Cloud, Database, GitBranch, Globe, Mail, Monitor, Sparkles, type LucideIcon } from "lucide-react";
import type { IconName } from "@/data/case-studies";

export const icons: Record<IconName, LucideIcon> = {
  globe: Globe,
  cloud: Cloud,
  database: Database,
  mail: Mail,
  branch: GitBranch,
  monitor: Monitor,
  sparkles: Sparkles,
};
