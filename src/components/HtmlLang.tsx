"use client";

import { useEffect } from "react";
import type { Lang } from "@/i18n/dictionary";

// Kök layout lang="tr" yazar; /en/ sayfasında <html lang> değerini düzeltir
export default function HtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
