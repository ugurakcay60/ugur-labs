"use client";

import { Moon, Sun } from "lucide-react";

// Hangi ikonun görüneceğini CSS (dark:) belirler; böylece sunucu/istemci HTML'i aynı kalır
export default function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:border-foreground/30 hover:text-foreground"
    >
      <Moon className="size-4 dark:hidden" />
      <Sun className="hidden size-4 dark:block" />
    </button>
  );
}
