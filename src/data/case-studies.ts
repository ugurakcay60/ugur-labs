import type { Lang } from "@/i18n/dictionary";

// Proje altındaki "Vaka çalışması" penceresinin metinleri. Diyagram: components/case-study/
export type CaseStudyId = "diyet-ai";

export type IconName = "globe" | "cloud" | "database" | "mail" | "branch" | "monitor" | "sparkles";

type Part = { icon: IconName; role: string; name: string; text: string; bullets: string[] };

export type CaseStudy = {
  title: string;
  intro: string;
  diagramHint: string;
  flowTitle: string;
  flow: string[];
  partsTitle: string;
  parts: Part[];
  outro: string;
};

const diyetAi: Record<Lang, CaseStudy> = {
  tr: {
    title: "Diyet-AI mimarisi",
    intro:
      "Diyet-AI, öğün, egzersiz ve tartı fotoğraflarıyla doğrulanan kişisel bir diyet takip uygulaması. Ayrı bir uygulama sunucusu yok: arayüz Vercel'den gelir, tarayıcı veriler için doğrudan Supabase ile konuşur, güvenliği veritabanı kuralları sağlar. Tamamı ücretsiz katmanlarda çalışıyor.",
    diagramHint: "Diyagramı yana kaydırabilirsin",
    flowTitle: "Bir isteğin yolculuğu",
    flow: [
      "Kullanıcı diyet-ai.ugur-labs.com yazar; Türkticaret DNS'indeki CNAME kaydı adresi Vercel'e yönlendirir.",
      "Vercel, Next.js ile derlenmiş arayüzü en yakın CDN noktasından HTTPS ile gönderir. Sayfalar tamamen tarayıcıda çalışır.",
      "Giriş, öğün kayıtları ve fotoğraflar tarayıcıdan doğrudan Supabase'e gider. Her tabloda satır düzeyinde güvenlik (RLS) açık; herkes yalnızca kendi verisini görür.",
      "Kayıt onayı ve şifre sıfırlama e-postalarını Supabase Auth, Resend SMTP üzerinden no-reply@ugur-labs.com adresiyle gönderir.",
      "Gizli anahtar gereken az sayıdaki iş Vercel'deki sunucusuz fonksiyonlarda yapılır. Örneğin Supabase'in zamanlanmış görevi her saat onaylanmamış hesapları temizletir.",
      "Kod GitHub'da tutulur; main dalına her push Vercel'de otomatik olarak yeni sürümü yayına alır.",
    ],
    partsTitle: "Hangi iş için ne kullanıldı",
    parts: [
      {
        icon: "globe",
        // İngilizce kelimeler büyük yazılır; TR'de CSS uppercase "i"yi "İ" yapar
        role: "DOMAIN & DNS",
        name: "Türkticaret.net",
        text: "ugur-labs.com alan adı burada kayıtlı. DNS kayıtları alt alan adlarını servislere bağlar ve e-postanın güvenilir sayılmasını sağlar.",
        bullets: [
          "CNAME diyet-ai → Vercel",
          "DKIM, SPF ve DMARC kayıtları → Resend",
          "Ana alan adının posta (MX) kayıtları Türkticaret'te kalır",
        ],
      },
      {
        icon: "cloud",
        role: "HOSTING & sunucusuz fonksiyonlar",
        name: "Vercel",
        text: "Next.js uygulamasını derler, dünya genelindeki CDN'den sunar ve SSL sertifikasını otomatik yeniler. Gizli anahtar isteyen birkaç API ucu da burada fonksiyon olarak çalışır.",
        bullets: [
          "Her push'ta otomatik deploy, dallar için önizleme adresleri",
          "Ortam değişkenleri (gizli anahtarlar) yalnızca sunucuda",
          "Hobby planı: ücretsiz",
        ],
      },
      {
        icon: "database",
        role: "Sunucu / backend",
        name: "Supabase (Frankfurt)",
        text: "Uygulamanın arka ucu: PostgreSQL veritabanı, kullanıcı girişi ve fotoğraf depolama tek pakette. Avrupa'daki Frankfurt bölgesinde, Vercel Marketplace üzerinden kuruldu.",
        bullets: [
          "Postgres + satır düzeyinde güvenlik (RLS)",
          "Auth: e-posta onayı, şifre sıfırlama",
          "Storage: özel fotoğraf kovası, yalnızca JPEG ve en fazla 1 MB",
          "pg_cron: saatlik temizlik görevi",
        ],
      },
      {
        icon: "mail",
        role: "E-posta",
        name: "Resend",
        text: "Supabase'in kendi e-posta servisi yalnızca ekip üyelerine gönderebiliyor. Bu yüzden özel SMTP olarak Resend bağlandı ve e-postalar kendi alan adımızdan gidiyor.",
        bullets: [
          "Gönderen: DiyetAI <no-reply@ugur-labs.com>",
          "Ücretsiz plan: ayda 3.000, günde 100 e-posta",
          "DKIM/SPF ile spam klasörüne düşmeme",
        ],
      },
      {
        icon: "monitor",
        role: "Arayüz",
        name: "Next.js 16 · React 19",
        text: "Mobil öncelikli, TR/EN iki dilli arayüz. Kamera, fotoğraf sıkıştırma ve hatırlatıcı sireni gibi işler cihazda yapılır, böylece sunucu maliyeti doğmaz.",
        bullets: [
          "Tailwind CSS v4, shadcn/ui (Base UI), Zustand",
          "Fotoğraflar yüklenmeden önce ~15–100 KB'a sıkıştırılır",
          "Görev fotoğrafları 7 gün sonra otomatik silinir",
        ],
      },
      {
        icon: "sparkles",
        role: "Yapay zekâ katmanı",
        name: "Vision LLM (hazırlık)",
        text: "Fotoğrafın gerçekten yemek, egzersiz ya da tartı olup olmadığını kontrol eden ve kan değerlerini yorumlayan katman. Şu an simülasyonla çalışıyor; gerçek model, API anahtarı tarayıcıya hiç inmeden sunucu fonksiyonu üzerinden bağlanacak şekilde tasarlandı.",
        bullets: ["Arayüz ve hata kodları hazır", "Tıbbi uyarılar her AI çıktısında gösterilir"],
      },
      {
        icon: "branch",
        role: "Kod & güvenlik",
        name: "GitHub",
        text: "Kaynak kod gizli bir depoda. GitHub Actions her push'ta ve her gün Semgrep ile güvenlik taraması yapar, Dependabot bağımlılıkları izler.",
        bullets: [
          "Yayın öncesi 20 maddelik erişim testi (kullanıcılar arası okuma/yazma/silme)",
          "Actions sürümleri commit SHA'ya sabitlendi",
        ],
      },
    ],
    outro: "Sonuç: alan adı dışında aylık maliyeti olmayan, kimlik doğrulaması ve veri güvenliği gerçek bir ürün seviyesinde çalışan bir uygulama.",
  },
  en: {
    title: "Diyet-AI architecture",
    intro:
      "Diyet-AI is a personal diet tracker where meals, workouts and weigh-ins are confirmed with photos. There is no separate app server: Vercel serves the UI, the browser talks to Supabase directly for data, and database rules enforce security. Everything runs on free tiers.",
    diagramHint: "Scroll the diagram sideways",
    flowTitle: "How a request travels",
    flow: [
      "The user opens diyet-ai.ugur-labs.com; a CNAME record in the Türkticaret DNS points the address at Vercel.",
      "Vercel serves the Next.js build over HTTPS from the nearest CDN location. Pages run entirely in the browser.",
      "Sign-in, meal logs and photos go from the browser straight to Supabase. Row-level security (RLS) is on for every table, so each user only sees their own data.",
      "Supabase Auth sends confirmation and password-reset emails through Resend SMTP, from no-reply@ugur-labs.com.",
      "The few jobs that need a secret key run as serverless functions on Vercel. For example, a Supabase scheduled job calls one every hour to delete unconfirmed accounts.",
      "The code lives on GitHub; every push to main ships a new version on Vercel automatically.",
    ],
    partsTitle: "What each piece is for",
    parts: [
      {
        icon: "globe",
        role: "Domain & DNS",
        name: "Türkticaret.net",
        text: "The ugur-labs.com domain is registered here. DNS records connect subdomains to services and make the email trustworthy.",
        bullets: [
          "CNAME diyet-ai → Vercel",
          "DKIM, SPF and DMARC records → Resend",
          "The root domain's mail (MX) stays with Türkticaret",
        ],
      },
      {
        icon: "cloud",
        role: "Hosting & serverless functions",
        name: "Vercel",
        text: "Builds the Next.js app, serves it from a global CDN and renews the SSL certificate automatically. The few API endpoints that need a secret key also run here as functions.",
        bullets: [
          "Auto-deploy on every push, preview URLs for branches",
          "Environment variables (secrets) stay on the server",
          "Hobby plan: free",
        ],
      },
      {
        icon: "database",
        role: "Server / backend",
        name: "Supabase (Frankfurt)",
        text: "The app's backend: a PostgreSQL database, user auth and photo storage in one package, in the Frankfurt region in Europe, provisioned through the Vercel Marketplace.",
        bullets: [
          "Postgres + row-level security (RLS)",
          "Auth: email confirmation, password reset",
          "Storage: private photo bucket, JPEG only, 1 MB max",
          "pg_cron: hourly cleanup job",
        ],
      },
      {
        icon: "mail",
        role: "Email",
        name: "Resend",
        text: "Supabase's built-in mailer only reaches team members, so Resend is connected as custom SMTP and email goes out from our own domain.",
        bullets: [
          "Sender: DiyetAI <no-reply@ugur-labs.com>",
          "Free plan: 3,000 emails a month, 100 a day",
          "DKIM/SPF keep it out of spam folders",
        ],
      },
      {
        icon: "monitor",
        role: "Frontend",
        name: "Next.js 16 · React 19",
        text: "A mobile-first, bilingual (TR/EN) UI. The camera, photo compression and the reminder siren run on the device, so they cost nothing on the server.",
        bullets: [
          "Tailwind CSS v4, shadcn/ui (Base UI), Zustand",
          "Photos are compressed to ~15–100 KB before upload",
          "Task photos are deleted automatically after 7 days",
        ],
      },
      {
        icon: "sparkles",
        role: "AI layer",
        name: "Vision LLM (prepared)",
        text: "The layer that checks a photo really shows a meal, a workout or a scale, and comments on blood test values. It runs on a simulation for now; the real model is designed to plug in through a serverless function so the API key never reaches the browser.",
        bullets: ["UI and error codes are in place", "Medical disclaimers are shown on every AI output"],
      },
      {
        icon: "branch",
        role: "Code & security",
        name: "GitHub",
        text: "The source code is in a private repository. GitHub Actions runs a Semgrep security scan on every push and daily, and Dependabot watches dependencies.",
        bullets: [
          "A 20-check access test before launch (cross-user read/write/delete)",
          "Actions pinned to commit SHAs",
        ],
      },
    ],
    outro: "The result: apart from the domain, an app with no monthly cost, and auth and data security at real-product level.",
  },
};

export const caseStudies: Record<CaseStudyId, Record<Lang, CaseStudy>> = { "diyet-ai": diyetAi };
