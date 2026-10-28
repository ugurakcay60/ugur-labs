// Ada (4,5 yaş, okul öncesi) için soru tabanlı oyunlar.
// Hepsi sesli yönergeyle çalışır; okuma bilmeden oynanabilir. Seviye 1–5 seçenek sayısını ve kavram çeşidini artırır.
(function () {
  "use strict";
  const { h, yard, soruOyunu } = OE;
  const { aralik, sec, karistir, secN, SAYI_AD } = yard;
  const bas = (s) => s.charAt(0).toLocaleUpperCase("tr") + s.slice(1);
  const emo = (e, sinif = "") => `<span class="emo ${sinif}">${e}</span>`;
  const sayilar = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

  // ---------------- Renkler ----------------
  const RENKLER = [
    { ad: "kırmızı", kod: "#E53935" },
    { ad: "mavi", kod: "#1E88E5" },
    { ad: "sarı", kod: "#FDD835" },
    { ad: "yeşil", kod: "#43A047" },
    { ad: "turuncu", kod: "#FB8C00" },
    { ad: "mor", kod: "#8E24AA" },
    { ad: "pembe", kod: "#F48FB1" },
    { ad: "kahverengi", kod: "#8D6E63" },
    { ad: "siyah", kod: "#263238" },
    { ad: "beyaz", kod: "#FFFFFF" },
    { ad: "gri", kod: "#9E9E9E" },
  ];
  const NESNE_RENK = [
    ["🍌", "Muz", "sarı"], ["🍓", "Çilek", "kırmızı"], ["🥕", "Havuç", "turuncu"], ["🐸", "Kurbağa", "yeşil"],
    ["🍆", "Patlıcan", "mor"], ["🍫", "Çikolata", "kahverengi"], ["☁️", "Bulut", "beyaz"], ["🍋", "Limon", "sarı"],
    ["🥦", "Brokoli", "yeşil"], ["🍇", "Üzüm", "mor"], ["🍊", "Portakal", "turuncu"], ["🐘", "Fil", "gri"],
    ["🚒", "İtfaiye aracı", "kırmızı"], ["🐻", "Ayı", "kahverengi"], ["🐳", "Balina", "mavi"], ["🌸", "Çiçek", "pembe"],
  ];
  const balon = (kod) =>
    `<svg viewBox="0 0 60 92" class="balon" aria-hidden="true"><path d="M30 64q-4 9 1 15t-1 13" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".55"/>` +
    `<ellipse cx="30" cy="31" rx="25" ry="30" fill="${kod}" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/><path d="M25 60l5 6 5-6z" fill="${kod}" stroke="rgba(0,0,0,.2)" stroke-width="1"/>` +
    `<ellipse cx="20" cy="19" rx="5" ry="9" fill="#fff" opacity=".45"/></svg>`;
  const renkTop = (kod) => `<span class="renk-top" style="background:${kod}"></span>`;
  const RENK_AYAR = [null, { n: 4, s: 3 }, { n: 6, s: 3 }, { n: 8, s: 4 }, { n: 11, s: 4 }, { n: 11, s: 5 }];

  OE.ekle({
    id: "renkler",
    ad: "Renkleri Bul",
    simge: "🎨",
    cocuk: "ada",
    grup: "Öğrenelim",
    aciklama: "Söylenen renkteki balonu bul",
    baslat: soruOyunu({
      uret(sv) {
        const a = RENK_AYAR[sv];
        const havuz = RENKLER.slice(0, a.n);
        if (sv >= 3 && Math.random() < 0.4) {
          const uygun = NESNE_RENK.filter((x) => havuz.some((r) => r.ad === x[2]));
          const [e, ad, rAd] = sec(uygun);
          const d = havuz.find((r) => r.ad === rAd);
          const secilen = [d, ...secN(havuz.filter((r) => r !== d), a.s - 1)];
          return {
            anahtar: "n" + e,
            metin: `${ad} ne renk?`,
            sesli: `${ad} ne renk? Doğru rengi seç.`,
            gorsel: emo(e, "dev"),
            tur: "buyuk",
            secenekler: secilen.map((r) => ({ html: renkTop(r.kod), dogru: r === d, etiket: r.ad })),
            dogruSesli: `Evet! ${ad} ${rAd}.`,
          };
        }
        const secilen = secN(havuz, a.s);
        const d = secilen[0];
        return {
          anahtar: d.ad,
          metin: `${bas(d.ad)} balonu bul!`,
          sesli: `${bas(d.ad)} balonu bul!`,
          tur: "buyuk",
          secenekler: secilen.map((r) => ({ html: balon(r.kod), dogru: r === d, etiket: r.ad + " balon" })),
          dogruSesli: `Evet, bu ${d.ad}!`,
        };
      },
    }),
  });

  // ---------------- Şekiller ----------------
  function cokgen(n, r, ic = 0, don = -90) {
    const adim = ic ? n * 2 : n;
    const p = [];
    for (let k = 0; k < adim; k++) {
      const rr = ic && k % 2 ? ic : r;
      const a = ((don + (k * 360) / adim) * Math.PI) / 180;
      p.push((50 + rr * Math.cos(a)).toFixed(1) + "," + (50 + rr * Math.sin(a)).toFixed(1));
    }
    return p.join(" ");
  }
  const SEKIL = [
    { ad: "daire", bul: "Daireyi", ciz: (c) => `<circle cx="50" cy="50" r="42" fill="${c}"/>` },
    { ad: "kare", bul: "Kareyi", in: "Karenin", k: 4, ciz: (c) => `<rect x="12" y="12" width="76" height="76" rx="3" fill="${c}"/>` },
    { ad: "üçgen", bul: "Üçgeni", in: "Üçgenin", k: 3, ciz: (c) => `<polygon points="50,8 94,88 6,88" fill="${c}"/>` },
    { ad: "dikdörtgen", bul: "Dikdörtgeni", in: "Dikdörtgenin", k: 4, ciz: (c) => `<rect x="4" y="26" width="92" height="48" rx="3" fill="${c}"/>` },
    { ad: "yıldız", bul: "Yıldızı", ciz: (c) => `<polygon points="${cokgen(5, 47, 20)}" fill="${c}"/>` },
    { ad: "kalp", bul: "Kalbi", ciz: (c) => `<path d="M50 88C22 68 5 52 9 32C13 15 34 9 50 27C66 9 87 15 91 32C95 52 78 68 50 88Z" fill="${c}"/>` },
    { ad: "oval", bul: "Ovali", ciz: (c) => `<ellipse cx="50" cy="50" rx="45" ry="29" fill="${c}"/>` },
    { ad: "beşgen", bul: "Beşgeni", in: "Beşgenin", k: 5, ciz: (c) => `<polygon points="${cokgen(5, 45)}" fill="${c}"/>` },
    { ad: "altıgen", bul: "Altıgeni", in: "Altıgenin", k: 6, ciz: (c) => `<polygon points="${cokgen(6, 45, 0, 0)}" fill="${c}"/>` },
  ];
  const SEKIL_RENK = ["#E53935", "#1E88E5", "#FDD835", "#43A047", "#FB8C00", "#8E24AA", "#F06292", "#00ACC1"];
  const sekilSvg = (s, renk, don = 0) =>
    `<svg viewBox="0 0 100 100" class="sekil" style="transform:rotate(${don}deg)" aria-hidden="true">` +
    `<g stroke="rgba(0,0,0,.28)" stroke-width="2.5" stroke-linejoin="round">${s.ciz(renk)}</g></svg>`;
  const SEKIL_AYAR = [null, { n: 3, s: 3 }, { n: 6, s: 3 }, { n: 7, s: 4 }, { n: 9, s: 4, don: 1 }, { n: 9, s: 5, don: 1 }];

  OE.ekle({
    id: "sekiller",
    ad: "Şekiller",
    simge: "🔺",
    cocuk: "ada",
    grup: "Öğrenelim",
    aciklama: "Daire, kare, üçgen ve dahası",
    baslat: soruOyunu({
      uret(sv) {
        const a = SEKIL_AYAR[sv];
        const havuz = SEKIL.slice(0, a.n);
        const donus = () => (a.don ? sec([0, 0, 15, -20, 30, 45]) : 0);
        if (sv >= 4 && Math.random() < 0.3) {
          const s = sec(havuz.filter((x) => x.k));
          const secenek = [s.k, ...secN([3, 4, 5, 6].filter((x) => x !== s.k), 2)];
          return {
            anahtar: "k" + s.ad,
            metin: "Bu şeklin kaç köşesi var?",
            sesli: "Bu şeklin kaç köşesi var? Köşeleri say!",
            gorsel: `<div class="tek-sekil">${sekilSvg(s, sec(SEKIL_RENK))}</div>`,
            tur: "rakam",
            secenekler: secenek.map((x) => ({ html: `<span class="rakam">${x}</span>`, dogru: x === s.k })),
            dogruSesli: `Evet! ${s.in} ${SAYI_AD[s.k]} köşesi var.`,
          };
        }
        const secilen = secN(havuz, a.s);
        const renkler = karistir(SEKIL_RENK);
        const d = secilen[0];
        return {
          anahtar: d.ad,
          metin: `${d.bul} bul!`,
          sesli: `${d.bul} bul!`,
          tur: "buyuk",
          secenekler: secilen.map((s, i) => ({ html: sekilSvg(s, renkler[i], donus()), dogru: s === d, etiket: s.ad })),
          dogruSesli: `Evet, bu bir ${d.ad}!`,
        };
      },
    }),
  });

  // ---------------- Sayılar ----------------
  const SAYILACAK = [
    ["🍎", "elma"], ["🐟", "balık"], ["⭐", "yıldız"], ["🐞", "uğur böceği"], ["🚗", "araba"],
    ["🎈", "balon"], ["🐥", "civciv"], ["🌸", "çiçek"], ["🍪", "kurabiye"], ["🦋", "kelebek"],
  ];
  const grup = (e, n, sinif = "") => `<span class="sayi-grup ${sinif}">${`<span class="emo">${e}</span>`.repeat(n)}</span>`;
  const rakam = (x) => ({ html: `<span class="rakam">${x}</span>`, etiket: String(x) });
  const yakinlar = (n, ust, adet) => {
    const aday = karistir(sayilar(1, ust).filter((x) => x !== n)).sort((a, b) => Math.abs(a - n) - Math.abs(b - n));
    return aday.slice(0, adet);
  };
  const SAYI_UST = [0, 3, 5, 7, 10, 10];

  OE.ekle({
    id: "sayilar",
    ad: "Sayı Sayalım",
    simge: "🔢",
    cocuk: "ada",
    grup: "Öğrenelim",
    aciklama: "Say, karşılaştır, topla",
    baslat: soruOyunu({
      uret(sv) {
        const ust = SAYI_UST[sv];
        const tur = sv === 1 ? "say" : sv <= 3 ? sec(["say", "say", "grup"]) : sec(["say", "grup", "cok", "topla"]);
        const [e, ad] = sec(SAYILACAK);
        if (tur === "grup") {
          const n = aralik(1, ust);
          const secenek = [n, ...yakinlar(n, ust, 2)];
          return {
            anahtar: "g" + n,
            metin: `${bas(SAYI_AD[n])} tane ${ad} olan kutuyu bul!`,
            tur: "grup",
            sutun: 3,
            secenekler: secenek.map((x) => ({ html: grup(e, x, "kucuk"), dogru: x === n, etiket: x + " tane" })),
            dogruSesli: `Evet! Burada ${SAYI_AD[n]} tane ${ad} var.`,
          };
        }
        if (tur === "cok") {
          const az = sv === 5 && Math.random() < 0.5;
          const a = aralik(1, ust - 2);
          const b = aralik(a + (sv === 5 ? 1 : 2), ust);
          return {
            anahtar: "c" + a + b + az,
            metin: `Hangisinde daha ${az ? "az" : "çok"} ${ad} var?`,
            tur: "grup",
            sutun: 2,
            secenekler: [
              { html: grup(e, a, "kucuk"), dogru: az, etiket: a + " tane" },
              { html: grup(e, b, "kucuk"), dogru: !az, etiket: b + " tane" },
            ],
            dogruSesli: az ? `Evet! ${bas(SAYI_AD[a])} tane, ${SAYI_AD[b]} taneden az.` : `Evet! ${bas(SAYI_AD[b])} tane, ${SAYI_AD[a]} taneden çok.`,
          };
        }
        if (tur === "topla") {
          const a = aralik(1, Math.min(5, ust - 1));
          const b = aralik(1, Math.min(5, ust - a));
          const n = a + b;
          return {
            anahtar: "t" + a + b,
            metin: "Hepsi kaç tane eder?",
            sesli: `${bas(SAYI_AD[a])} ${ad}, bir de ${SAYI_AD[b]} ${ad}. Hepsi kaç tane eder?`,
            gorsel: `<div class="toplama">${grup(e, a)}<span class="arti">+</span>${grup(e, b)}</div>`,
            tur: "rakam",
            secenekler: [n, ...yakinlar(n, 10, 2)].map((x) => ({ ...rakam(x), dogru: x === n })),
            dogruSesli: `Evet! ${bas(SAYI_AD[a])} artı ${SAYI_AD[b]}, ${SAYI_AD[n]} eder.`,
          };
        }
        const n = aralik(1, ust);
        return {
          anahtar: "s" + n,
          metin: `Kaç tane ${ad} var?`,
          sesli: `Kaç tane ${ad} var? Parmağınla say bakalım!`,
          gorsel: grup(e, n),
          tur: "rakam",
          secenekler: [n, ...yakinlar(n, ust, Math.min(2, ust - 1))].map((x) => ({ ...rakam(x), dogru: x === n })),
          dogruSesli: `Evet! ${bas(SAYI_AD[n])} tane ${ad}.`,
        };
      },
    }),
  });

  // ---------------- Hayvanlar ----------------
  const HAYVAN = [
    { e: "🐶", ad: "köpek", bul: "Köpeği", ses: "Hav hav!" },
    { e: "🐱", ad: "kedi", bul: "Kediyi", ses: "Miyav!" },
    { e: "🐮", ad: "inek", bul: "İneği", ses: "Mööö!" },
    { e: "🐑", ad: "koyun", bul: "Koyunu", ses: "Meee!" },
    { e: "🐓", ad: "horoz", bul: "Horozu", ses: "Üü-ürü-üüü!" },
    { e: "🦆", ad: "ördek", bul: "Ördeği", ses: "Vak vak!", su: 1, ucar: 1 },
    { e: "🐴", ad: "at", bul: "Atı", ses: "İhihihi!" },
    { e: "🦁", ad: "aslan", bul: "Aslanı", ses: "Grrraaav!" },
    { e: "🐸", ad: "kurbağa", bul: "Kurbağayı", ses: "Vırak vırak!", su: 1 },
    { e: "🐝", ad: "arı", bul: "Arıyı", ses: "Vızzz!", ucar: 1 },
    { e: "🦉", ad: "baykuş", bul: "Baykuşu", ses: "Hu huu!", ucar: 1 },
    { e: "🐥", ad: "civciv", bul: "Civcivi", ses: "Cik cik!" },
    { e: "🐍", ad: "yılan", bul: "Yılanı", ses: "Tıssss!" },
    { e: "🐘", ad: "fil", bul: "Fili" },
    { e: "🦒", ad: "zürafa", bul: "Zürafayı" },
    { e: "🐵", ad: "maymun", bul: "Maymunu" },
    { e: "🐰", ad: "tavşan", bul: "Tavşanı" },
    { e: "🐻", ad: "ayı", bul: "Ayıyı" },
    { e: "🐧", ad: "penguen", bul: "Pengueni", su: 1 },
    { e: "🐢", ad: "kaplumbağa", bul: "Kaplumbağayı", su: 1 },
    { e: "🐟", ad: "balık", bul: "Balığı", deniz: 1 },
    { e: "🐬", ad: "yunus", bul: "Yunusu", deniz: 1 },
    { e: "🐙", ad: "ahtapot", bul: "Ahtapotu", deniz: 1 },
    { e: "🐳", ad: "balina", bul: "Balinayı", deniz: 1 },
    { e: "🦋", ad: "kelebek", bul: "Kelebeği", ucar: 1 },
    { e: "🐦", ad: "kuş", bul: "Kuşu", ucar: 1 },
  ];
  const HAYVAN_AYAR = [null, { n: 8, s: 3 }, { n: 20, s: 3 }, { n: 26, s: 4 }, { n: 26, s: 4 }, { n: 26, s: 5 }];
  const hayvanSecenek = (liste, d) => liste.map((x) => ({ html: emo(x.e), dogru: x === d, etiket: x.ad }));

  OE.ekle({
    id: "hayvanlar",
    ad: "Hayvanlar",
    simge: "🐮",
    cocuk: "ada",
    grup: "Öğrenelim",
    aciklama: "Adını ve sesini bil",
    baslat: soruOyunu({
      uret(sv) {
        const a = HAYVAN_AYAR[sv];
        const havuz = HAYVAN.slice(0, a.n);
        const tur = sv === 1 ? "bul" : sv <= 3 ? sec(["bul", "ses"]) : sec(["bul", "ses", "yer"]);
        if (tur === "yer") {
          const ucan = Math.random() < 0.5;
          const uygun = havuz.filter((x) => (ucan ? x.ucar : x.deniz));
          const diger = havuz.filter((x) => (ucan ? !x.ucar && x.ad !== "penguen" : !x.deniz && !x.su) && x.ad !== "civciv");
          const d = sec(uygun);
          const secilen = [d, ...secN(diger, a.s - 1)];
          return {
            anahtar: "y" + d.ad,
            metin: ucan ? "Hangisi uçabilir?" : "Hangisi denizde yaşar?",
            tur: "buyuk",
            secenekler: hayvanSecenek(secilen, d),
            dogruSesli: ucan ? `Evet! ${bas(d.ad)} uçabilir.` : `Evet! ${bas(d.ad)} denizde yaşar.`,
          };
        }
        if (tur === "ses") {
          const d = sec(havuz.filter((x) => x.ses));
          const secilen = [d, ...secN(havuz.filter((x) => x !== d), a.s - 1)];
          return {
            anahtar: "s" + d.ad,
            metin: `“${d.ses}” diyen hangisi?`,
            sesli: `Kim şöyle der? ${d.ses}`,
            tur: "buyuk",
            secenekler: hayvanSecenek(secilen, d),
            dogruSesli: `Evet! ${bas(d.ad)} ${d.ses.toLocaleLowerCase("tr")} der.`,
          };
        }
        const secilen = secN(havuz, a.s);
        const d = secilen[0];
        return {
          anahtar: "b" + d.ad,
          metin: `${d.bul} bul!`,
          tur: "buyuk",
          secenekler: hayvanSecenek(secilen, d),
          dogruSesli: d.ses ? `Evet! Bu bir ${d.ad}. ${d.ses}` : `Evet! Bu bir ${d.ad}.`,
        };
      },
    }),
  });

  // ---------------- Harfler ----------------
  const ALFABE = [
    ["A", "a", "Arı", "🐝"], ["B", "be", "Balık", "🐟"], ["C", "ce", "Civciv", "🐥"], ["Ç", "çe", "Çilek", "🍓"],
    ["D", "de", "Dondurma", "🍦"], ["E", "e", "Elma", "🍎"], ["F", "fe", "Fil", "🐘"], ["G", "ge", "Güneş", "☀️"],
    ["Ğ", "yumuşak ge", "Dağ", "⛰️"], ["H", "he", "Havuç", "🥕"], ["I", "ı", "Ispanak", "🥬"], ["İ", "i", "İnek", "🐄"],
    ["J", "je", "Jöle", "🍮"], ["K", "ke", "Kedi", "🐱"], ["L", "le", "Limon", "🍋"], ["M", "me", "Muz", "🍌"],
    ["N", "ne", "Nota", "🎵"], ["O", "o", "Otobüs", "🚌"], ["Ö", "ö", "Ördek", "🦆"], ["P", "pe", "Penguen", "🐧"],
    ["R", "re", "Roket", "🚀"], ["S", "se", "Saat", "⏰"], ["Ş", "şe", "Şemsiye", "☂️"], ["T", "te", "Tavşan", "🐰"],
    ["U", "u", "Uçak", "✈️"], ["Ü", "ü", "Üzüm", "🍇"], ["V", "ve", "Vapur", "⛴️"], ["Y", "ye", "Yıldız", "⭐"],
    ["Z", "ze", "Zürafa", "🦒"],
  ].map(([b, oku, kelime, e]) => ({ b, k: b.toLocaleLowerCase("tr"), oku, kelime, e }));
  const SORULABILIR = ALFABE.filter((x) => x.b !== "Ğ"); // Ğ ile başlayan kelime yok
  const harfHtml = (x) => `<span class="harf">${x.b}<small>${x.k}</small></span>`;
  const kelimeHtml = (x) => {
    const i = x.kelime.toLocaleUpperCase("tr").indexOf(x.b);
    return `${x.kelime.slice(0, i)}<b>${x.kelime.charAt(i)}</b>${x.kelime.slice(i + 1)}`;
  };
  const HARF_AYAR = [null, { n: 8, s: 3 }, { n: 16, s: 3 }, { n: 28, s: 3 }, { n: 28, s: 4 }, { n: 28, s: 4 }];

  const harfQuiz = soruOyunu({
    uret(sv) {
      const a = HARF_AYAR[sv];
      const havuz = SORULABILIR.slice(0, a.n);
      const tur = sv === 1 ? "bul" : sv <= 3 ? sec(["bul", "baslar"]) : sec(["bul", "baslar", "resim"]);
      const secilen = secN(havuz, a.s);
      const d = secilen[0];
      if (tur === "baslar")
        return {
          anahtar: "b" + d.b,
          metin: `${d.kelime} hangi harfle başlar?`,
          sesli: `${d.kelime}. ${d.kelime} hangi harfle başlar?`,
          gorsel: emo(d.e, "dev"),
          tur: "buyuk",
          secenekler: secilen.map((x) => ({ html: harfHtml(x), dogru: x === d, etiket: x.b })),
          dogruSesli: `Evet! ${d.kelime}, ${d.oku} harfiyle başlar.`,
        };
      if (tur === "resim")
        return {
          anahtar: "r" + d.b,
          metin: `<b class="harf-satir">${d.b}</b> harfiyle başlayan resmi bul!`,
          sesli: `${d.oku} harfiyle başlayan resmi bul!`,
          tur: "buyuk",
          secenekler: secilen.map((x) => ({ html: emo(x.e), dogru: x === d, etiket: x.kelime })),
          dogruSesli: `Evet! ${d.kelime}, ${d.oku} harfiyle başlar.`,
        };
      return {
        anahtar: "h" + d.b,
        // 3. seviyeden sonra harf yazılmaz, yalnızca söylenir
        metin: sv <= 2 ? `<b class="harf-satir">${d.b}</b> harfini bul!` : "Söylenen harfi bul!",
        sesli: `${d.oku} harfini bul!`,
        tur: "buyuk",
        secenekler: secilen.map((x) => ({ html: harfHtml(x), dogru: x === d, etiket: x.b })),
        dogruSesli: `Evet, bu ${d.oku} harfi! ${d.kelime} gibi.`,
      };
    },
  });

  OE.ekle({
    id: "harfler",
    ad: "Harf Kutusu",
    simge: "🔤",
    cocuk: "ada",
    grup: "Öğrenelim",
    aciklama: "Harfleri dinle, sonra oyna",
    baslat(sahne, ctx) {
      let ic = null;
      const kart = h("div.harf-kart");
      const goster = (x) => {
        kart.innerHTML =
          `<span class="harf-dev">${x.b}<small>${x.k}</small></span>` +
          `<span class="emo harf-resim">${x.e}</span><span class="harf-kelime">${kelimeHtml(x)}</span>`;
        ctx.konus(x.b === "Ğ" ? "Yumuşak ge. Dağ kelimesinin sonunda var. Yumuşak ge ile başlayan kelime yoktur." : `${x.oku}. ${x.kelime}`);
      };
      sahne.replaceChildren(
        h(
          "div.harf-kesfet",
          h("p.soru-metin", "Bir harfe dokun, dinle!"),
          kart,
          h("div.harf-izgara", ALFABE.map((x, i) => h("button.harf-karo", { type: "button", "data-renk": i % 4, onclick: () => goster(x) }, x.b))),
          h("button.dugme.harf-oyna", { type: "button", onclick: () => (ic = harfQuiz(sahne, ctx)) }, h("span.emo", "🎯"), " Harf oyununu oyna")
        )
      );
      kart.innerHTML = `<span class="harf-dev">Aa</span><span class="emo harf-resim">🐝</span><span class="harf-kelime">Hazır mısın?</span>`;
      ctx.konus("Bir harfe dokun, dinle! Hazır olunca harf oyununu oyna.");
      return () => ic && ic();
    },
  });

  // ---------------- Örüntü ----------------
  const ORUNTU_HAVUZ = [
    ["🍎", "🍌", "🍇", "🍊", "🍓"],
    ["🐶", "🐱", "🐰", "🐻", "🐸"],
    ["🔴", "🔵", "🟡", "🟢", "🟣"],
    ["⭐", "🌙", "☀️", "☁️", "⚡"],
    ["🚗", "🚌", "🚲", "✈️", "🚀"],
    ["🟥", "🟦", "🟨", "🟩", "🟪"],
  ];
  const KALIP = { 1: ["AB"], 2: ["AB", "AAB", "ABB"], 3: ["ABC", "AAB", "ABB"], 4: ["ABC", "AABB", "ABBC"], 5: ["ABCD", "AABC", "ABCB", "AABB"] };

  OE.ekle({
    id: "oruntu",
    ad: "Sırada Ne Var?",
    simge: "🔁",
    cocuk: "ada",
    grup: "Zekâ oyunları",
    aciklama: "Örüntüyü tamamla",
    baslat: soruOyunu({
      uret(sv) {
        const kalip = sec(KALIP[sv]);
        const harfler = [...new Set(kalip)];
        const havuz = sec(ORUNTU_HAVUZ);
        const ogeler = secN(havuz, harfler.length + 1);
        const harita = Object.fromEntries(harfler.map((x, i) => [x, ogeler[i]]));
        const uzunluk = Math.min(9, Math.max(6, kalip.length * 2 + 1 + (sv >= 4 ? kalip.length - 1 : 0)));
        const dizi = Array.from({ length: uzunluk }, (_, i) => harita[kalip[i % kalip.length]]);
        const bosYer = sv >= 4 && Math.random() < 0.4 ? aralik(kalip.length, uzunluk - 1) : uzunluk - 1;
        const d = dizi[bosYer];
        const adaylar = [...new Set([...ogeler])].filter((x) => x !== d);
        const secilen = [d, ...secN(adaylar, sv <= 2 ? 2 : 3)];
        const satir = dizi.map((x, i) => (i === bosYer ? `<span class="bos">?</span>` : emo(x))).join("");
        return {
          anahtar: kalip + d + bosYer,
          metin: bosYer === uzunluk - 1 ? "Sırada hangisi gelecek?" : "Boşluğa hangisi gelmeli?",
          sesli: bosYer === uzunluk - 1 ? "Sırayı takip et. Sırada hangisi gelecek?" : "Sırayı takip et. Soru işaretinin yerine hangisi gelmeli?",
          gorsel: `<div class="oruntu">${satir}</div>`,
          tur: "buyuk",
          secenekler: secilen.map((x) => ({ html: emo(x), dogru: x === d })),
        };
      },
    }),
  });

  // ---------------- Gölge ----------------
  const GOLGE = [
    "🐘", "🦒", "🐢", "🐇", "🐈", "🐕", "🐎", "🐄", "🐓", "🦆", "🐟", "🐬", "🦋", "🐌", "🦀", "🐙", "🦕", "🦖", "🐪", "🦔",
    "🚗", "🚲", "✈️", "🚀", "🚂", "⛵", "🚁", "🍎", "🍌", "🍐", "🍇", "🥕", "🍄", "🌵", "🌳", "☂️", "🎸", "🔑", "✂️", "🏠",
  ];

  OE.ekle({
    id: "golge",
    ad: "Gölgeyi Bul",
    simge: "👤",
    cocuk: "ada",
    grup: "Zekâ oyunları",
    aciklama: "Gölge hangi resmin?",
    baslat: soruOyunu({
      uret(sv) {
        const adet = sv <= 2 ? 3 : sv <= 4 ? 4 : 5;
        const secilen = secN(GOLGE, adet);
        const d = secilen[0];
        if (sv >= 4 && Math.random() < 0.5)
          return {
            anahtar: "t" + d,
            metin: "Bu resmin gölgesi hangisi?",
            gorsel: `<div class="golge-sahne acik">${emo(d, "dev")}</div>`,
            tur: "buyuk",
            secenekler: secilen.map((x) => ({ html: `<span class="golge-kutu">${emo(x, "golge")}</span>`, dogru: x === d })),
          };
        return {
          anahtar: d,
          metin: "Bu gölge hangisinin?",
          sesli: "Bu gölge kimin? Doğru resmi bul!",
          gorsel: `<div class="golge-sahne">${emo(d, "dev golge")}</div>`,
          tur: "buyuk",
          secenekler: secilen.map((x) => ({ html: emo(x), dogru: x === d })),
        };
      },
    }),
  });

  // ---------------- Farklı olanı bul ----------------
  const KATEGORI = [
    { ad: "meyve", liste: ["🍎", "🍌", "🍇", "🍊", "🍓", "🍐", "🍒", "🍉", "🍑", "🍍"] },
    { ad: "hayvan", liste: ["🐶", "🐱", "🐰", "🐻", "🐼", "🦁", "🐮", "🐸", "🐵", "🐯"] },
    { ad: "taşıt", liste: ["🚗", "🚌", "🚲", "✈️", "🚂", "🚁", "⛵", "🚀", "🚑", "🚜"] },
    { ad: "giysi", liste: ["👕", "👖", "👗", "🧦", "🧢", "🧣", "🧤", "🧥", "👟"] },
    { ad: "sebze", liste: ["🥕", "🥦", "🌽", "🥒", "🍆", "🥔", "🧅", "🥬"] },
    { ad: "müzik aleti", liste: ["🎸", "🎺", "🥁", "🎹", "🎻", "🎷"] },
  ];
  // 5. seviyede birbirine yakın kategoriler
  const YAKIN = [["meyve", "sebze"], ["hayvan", "taşıt"], ["giysi", "müzik aleti"]];
  const kat = (ad) => KATEGORI.find((k) => k.ad === ad);

  OE.ekle({
    id: "farkli",
    ad: "Farklı Olanı Bul",
    simge: "🧐",
    cocuk: "ada",
    grup: "Zekâ oyunları",
    aciklama: "Hangisi gruba uymuyor?",
    baslat: soruOyunu({
      uret(sv) {
        let A, B;
        if (sv === 5) {
          const [x, y] = karistir(sec(YAKIN));
          A = kat(x);
          B = kat(y);
        } else [A, B] = secN(KATEGORI, 2);
        const fark = sec(B.liste);
        const ayni = sv <= 2 ? Array(sv === 1 ? 3 : 4).fill(sec(A.liste)) : secN(A.liste, sv === 3 ? 3 : 4);
        const secenekler = [...ayni.map((x) => ({ html: emo(x), dogru: false })), { html: emo(fark), dogru: true }];
        return {
          anahtar: fark + A.ad,
          metin: "Farklı olanı bul!",
          sesli: "Hangisi diğerlerinden farklı? Bul bakalım!",
          tur: "buyuk",
          sutun: secenekler.length === 4 ? 4 : 3,
          secenekler,
          dogruSesli: sv <= 2 ? "Evet! Bu diğerlerinden farklı." : `Evet! Diğerleri ${A.ad}, bu bir ${B.ad}.`,
        };
      },
    }),
  });
})();
