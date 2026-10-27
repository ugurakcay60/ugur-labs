import type { ReactNode } from "react";
import type { Lang } from "@/i18n/dictionary";
import { icons } from "./icons";
import type { IconName } from "@/data/case-studies";

// Diyet-AI mimari diyagramı. Renkler tema değişkenlerinden gelir (açık/koyu otomatik).
// Rozet numaraları vaka çalışmasındaki "isteğin yolculuğu" adımlarıyla eşleşir.
const labels = {
  tr: {
    user: ["Kullanıcı", "Tarayıcı / telefon", "Kamera · sıkıştırma", "Hatırlatıcı · siren"],
    dns: ["DOMAIN & DNS", "Türkticaret.net", "ugur-labs.com · CNAME · DKIM/SPF"],
    vercel: ["HOSTING", "Vercel"],
    app: ["Next.js 16 · React 19", "CDN · HTTPS · arayüz"],
    fn: ["Sunucusuz fonksiyonlar", "gizli anahtarlı işler"],
    supabase: ["SUNUCU / BACKEND", "Supabase · Frankfurt"],
    db: ["Postgres", "RLS korumalı"],
    storage: ["Storage", "özel foto kovası"],
    cron: ["pg_cron", "saatlik temizlik"],
    auth: ["Auth", "giriş · onay"],
    github: ["KOD & CI", "GitHub", "Actions · Semgrep · Dependabot"],
    resend: ["E-POSTA", "Resend", "no-reply@ugur-labs.com · SMTP"],
    edges: {
      domain: "alan adı",
      https: "HTTPS",
      data: "veri · giriş · fotoğraf",
      smtp: "SMTP",
      mail: "onay / şifre e-postası",
      fn: "cron · admin",
      deploy: "push → deploy",
    },
  },
  en: {
    user: ["User", "Browser / phone", "Camera · compression", "Reminders · siren"],
    dns: ["DOMAIN & DNS", "Türkticaret.net", "ugur-labs.com · CNAME · DKIM/SPF"],
    vercel: ["HOSTING", "Vercel"],
    app: ["Next.js 16 · React 19", "CDN · HTTPS · UI"],
    fn: ["Serverless functions", "jobs needing secrets"],
    supabase: ["SERVER / BACKEND", "Supabase · Frankfurt"],
    db: ["Postgres", "RLS-protected"],
    storage: ["Storage", "private photo bucket"],
    cron: ["pg_cron", "hourly cleanup"],
    auth: ["Auth", "sign-in · confirm"],
    github: ["CODE & CI", "GitHub", "Actions · Semgrep · Dependabot"],
    resend: ["EMAIL", "Resend", "no-reply@ugur-labs.com · SMTP"],
    edges: {
      domain: "domain",
      https: "HTTPS",
      data: "data · sign-in · photos",
      smtp: "SMTP",
      mail: "confirm / reset email",
      fn: "cron · admin",
      deploy: "push → deploy",
    },
  },
} satisfies Record<Lang, unknown>;

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  eyebrow?: string;
  title: string;
  lines?: string[];
  icon?: IconName;
  muted?: boolean;
};

// Dış kutular (Vercel, Supabase) arka plan rengiyle, içteki/tekil kutular yüzey rengiyle çizilir
function Box({ x, y, w, h, eyebrow, title, lines = [], icon, muted }: BoxProps) {
  const Icon = icon ? icons[icon] : null;
  const titleY = y + (eyebrow ? 43 : 27);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        className={muted ? "fill-background stroke-line" : "fill-surface stroke-line"}
        strokeWidth={1.5}
      />
      {eyebrow && (
        <text x={x + 14} y={y + 22} className="fill-muted font-mono text-[10px] tracking-[0.12em]">
          {eyebrow}
        </text>
      )}
      {Icon && <Icon x={x + 14} y={titleY - 14} width={18} height={18} className="text-accent" />}
      <text x={x + (Icon ? 40 : 14)} y={titleY} className="fill-foreground text-[15px] font-medium">
        {title}
      </text>
      {lines.map((line, i) => (
        <text key={line} x={x + 14} y={titleY + 19 * (i + 1)} className="fill-muted text-[12px]">
          {line}
        </text>
      ))}
    </g>
  );
}

function Edge({ d, both, dashed }: { d: string; both?: boolean; dashed?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      className="stroke-accent"
      strokeWidth={1.5}
      strokeDasharray={dashed ? "5 5" : undefined}
      markerEnd="url(#arch-arrow)"
      markerStart={both ? "url(#arch-arrow)" : undefined}
    />
  );
}

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} className="fill-accent" />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-background text-[11px] font-semibold">
        {n}
      </text>
    </g>
  );
}

function EdgeLabel({ x, y, children, anchor = "start" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="fill-muted font-mono text-[11px]">
      {children}
    </text>
  );
}

export default function DiyetAiDiagram({ lang }: { lang: Lang }) {
  const l = labels[lang];
  const e = l.edges;

  return (
    <svg viewBox="0 0 1000 612" role="img" aria-label={lang === "tr" ? "Diyet-AI mimari diyagramı" : "Diyet-AI architecture diagram"} className="h-auto w-full">
      <defs>
        <marker id="arch-arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="fill-accent" />
        </marker>
      </defs>

      {/* Kutular */}
      <Box x={20} y={210} w={180} h={140} icon="monitor" title={l.user[0]} lines={l.user.slice(1)} />
      <Box x={300} y={20} w={260} h={90} icon="globe" eyebrow={l.dns[0]} title={l.dns[1]} lines={[l.dns[2]]} />

      <Box x={300} y={150} w={260} h={260} icon="cloud" eyebrow={l.vercel[0]} title={l.vercel[1]} muted />
      <Box x={320} y={206} w={220} h={76} title={l.app[0]} lines={[l.app[1]]} />
      <Box x={320} y={300} w={220} h={90} title={l.fn[0]} lines={[l.fn[1]]} />

      <Box x={660} y={150} w={320} h={260} icon="database" eyebrow={l.supabase[0]} title={l.supabase[1]} muted />
      <Box x={676} y={206} w={140} h={76} title={l.db[0]} lines={[l.db[1]]} />
      <Box x={824} y={206} w={140} h={76} title={l.storage[0]} lines={[l.storage[1]]} />
      <Box x={676} y={300} w={140} h={90} title={l.cron[0]} lines={[l.cron[1]]} />
      <Box x={824} y={300} w={140} h={90} title={l.auth[0]} lines={[l.auth[1]]} />

      <Box x={300} y={470} w={260} h={90} icon="branch" eyebrow={l.github[0]} title={l.github[1]} lines={[l.github[2]]} />
      <Box x={660} y={470} w={320} h={90} icon="mail" eyebrow={l.resend[0]} title={l.resend[1]} lines={[l.resend[2]]} />

      {/* Bağlantılar kutuların üstüne çizilir; çift yönlü okların uçları görünsün */}
      <Edge d="M110,210 V65 H296" dashed />
      <Badge x={110} y={128} n={1} />
      <EdgeLabel x={122} y={58}>{e.domain}</EdgeLabel>

      <Edge d="M430,110 V146" dashed />
      <EdgeLabel x={440} y={133}>CNAME</EdgeLabel>

      <Edge d="M316,240 H204" both />
      <Badge x={260} y={240} n={2} />
      <EdgeLabel x={260} y={225} anchor="middle">{e.https}</EdgeLabel>

      <Edge d="M204,320 H250 V436 H740 V414" both />
      <Badge x={620} y={436} n={3} />
      <EdgeLabel x={260} y={428}>{e.data}</EdgeLabel>

      <Edge d="M894,394 V466" />
      <Badge x={894} y={432} n={4} />
      <EdgeLabel x={910} y={436}>{e.smtp}</EdgeLabel>
      <Edge d="M820,560 V594 H110 V354" />
      <EdgeLabel x={600} y={588} anchor="middle">{e.mail}</EdgeLabel>

      <Edge d="M672,345 H544" both />
      <Badge x={608} y={345} n={5} />
      <EdgeLabel x={608} y={330} anchor="middle">{e.fn}</EdgeLabel>

      <Edge d="M430,470 V414" />
      <Badge x={430} y={456} n={6} />
      <EdgeLabel x={446} y={460}>{e.deploy}</EdgeLabel>
    </svg>
  );
}
