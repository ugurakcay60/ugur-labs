"use client";

import { useRef, useState, type FormEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { CheckCircle2, LoaderCircle, MessageSquare, X } from "lucide-react";
import { HCAPTCHA_SITEKEY, MESSAGE_MAX, sendFeedback } from "@/lib/feedback";
import { dictionary, type Lang } from "@/i18n/dictionary";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[15px] transition placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

// Sayfa altındaki geri bildirim alanı. Form yerinde açılır (modal <dialog> değil): hCaptcha
// bulmacası body'ye eklenir ve modalın üst katmanının arkasında tıklanamaz kalırdı.
export default function Feedback({ lang }: { lang: Lang }) {
  const t = dictionary[lang].feedback;
  const captcha = useRef<HCaptcha>(null);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [token, setToken] = useState("");
  const [captchaMissing, setCaptchaMissing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  function toggle() {
    if (!open) {
      // hCaptcha kutusu sayfanın o anki temasıyla açılır
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
      setStatus("idle");
    }
    setOpen(!open);
    setToken("");
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setCaptchaMissing(true);
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const ok = await sendFeedback(
      {
        message: String(data.get("message") ?? "").trim(),
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        botcheck: data.get("botcheck") !== null,
      },
      token,
      lang,
    );
    // hCaptcha jetonu tek kullanımlık
    setToken("");
    captcha.current?.resetCaptcha();
    if (ok) form.reset();
    setStatus(ok ? "sent" : "error");
  }

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">{t.prompt}</h2>
          <p className="mt-1.5 text-muted">{t.promptSub}</p>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="feedback-form"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-line px-5 py-3 text-sm font-medium transition hover:border-foreground/30 sm:self-auto"
        >
          {open ? <X className="size-4" /> : <MessageSquare className="size-4" />}
          {open ? t.close : t.cta}
        </button>
      </div>

      {open && (
        <div id="feedback-form" className="mt-8 max-w-2xl">
          {status === "sent" ? (
            <p role="status" className="flex items-start gap-3 rounded-xl border border-line bg-surface p-5">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
              <span>
                <span className="block font-medium">{t.sentTitle}</span>
                <span className="text-sm text-muted">{t.sentText}</span>
              </span>
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">{t.message}</span>
                <textarea
                  name="message"
                  required
                  minLength={5}
                  maxLength={MESSAGE_MAX}
                  rows={5}
                  placeholder={t.messagePlaceholder}
                  className={`${field} resize-y`}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">{t.name}</span>
                  <input name="name" maxLength={80} autoComplete="name" className={field} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">{t.email}</span>
                  <input name="email" type="email" maxLength={120} autoComplete="email" className={field} />
                </label>
              </div>

              {/* Bal küpü: insanlar görmez, botlar doldurur; Web3Forms dolu gelirse mesajı atar */}
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <div>
                <HCaptcha
                  ref={captcha}
                  sitekey={HCAPTCHA_SITEKEY}
                  theme={theme}
                  languageOverride={lang}
                  sentry={false}
                  reCaptchaCompat={false}
                  onVerify={(v) => {
                    setToken(v);
                    setCaptchaMissing(false);
                  }}
                  onExpire={() => setToken("")}
                  onError={() => setToken("")}
                />
                {captchaMissing && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{t.captchaMissing}</p>}
              </div>

              {status === "error" && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {t.error}
                </p>
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-muted">
                  {t.privacy}{" "}
                  <a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                    {t.privacyLink}
                  </a>{" "}
                  ·{" "}
                  <a href="https://www.hcaptcha.com/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                    {t.termsLink}
                  </a>
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-[0_8px_24px_-10px_var(--accent)] transition hover:brightness-110 disabled:opacity-60"
                >
                  {status === "sending" && <LoaderCircle className="size-4 animate-spin" />}
                  {status === "sending" ? t.sending : t.send}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
