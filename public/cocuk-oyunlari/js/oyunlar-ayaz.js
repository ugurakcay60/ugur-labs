// Ayaz (9 yaş, 4. sınıf) için soru tabanlı oyunlar: matematik, Türkçe, İngilizce, Fen ve Sosyal.
// Konular MEB 4. sınıf programını izler; seviye 1–5 sayı büyüklüğünü ve soru çeşidini artırır.
(function () {
  "use strict";
  const { yard, soruOyunu, sayiSecenekleri, veri } = OE;
  const { aralik, sec, karistir, secN, bicim } = yard;
  const bas = (s) => s.charAt(0).toLocaleUpperCase("tr") + s.slice(1);
  const emo = (e, sinif = "") => `<span class="emo ${sinif}">${e}</span>`;
  const iki = (n) => String(n).padStart(2, "0");
  const ters = (n) => (n >= 10 ? +String(n).split("").reverse().join("") : n + 1);

  // ---------- Türkçe sayı okuma ve ekleri ----------
  const BIR = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
  const ON = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
  function ucBasamak(n) {
    const y = Math.floor(n / 100);
    const o = Math.floor((n % 100) / 10);
    const b = n % 10;
    return [y ? (y === 1 ? "yüz" : BIR[y] + " yüz") : "", ON[o], BIR[b]].filter(Boolean).join(" ");
  }
  function sayiOku(n) {
    if (n === 0) return "sıfır";
    const boluk = ["", "bin", "milyon", "milyar"];
    const p = [];
    for (let i = 0; n > 0; i++, n = Math.floor(n / 1000)) {
      const g = n % 1000;
      if (g) p.unshift(i === 1 && g === 1 ? "bin" : ucBasamak(g) + (boluk[i] ? " " + boluk[i] : ""));
    }
    return p.join(" ");
  }
  // 24 → "24'ün", 12 → "12'nin": sayının okunuşundaki son ünlüye göre ilgi eki
  function ekIn(n) {
    const son = sayiOku(n).split(" ").pop();
    const unlu = son.match(/[aeıioöuü]/g).pop();
    const ek = { a: "ın", ı: "ın", e: "in", i: "in", o: "un", u: "un", ö: "ün", ü: "ün" }[unlu];
    return bicim(n) + "'" + (/[aeıioöuü]$/.test(son) ? "n" : "") + ek;
  }
  const PAYDA_DE = { 2: "ikide", 3: "üçte", 4: "dörtte", 5: "beşte", 6: "altıda", 7: "yedide", 8: "sekizde", 9: "dokuzda", 10: "onda", 12: "on ikide" };
  const PAY_I = { 1: "biri", 2: "ikisi", 3: "üçü", 4: "dördü", 5: "beşi", 6: "altısı", 7: "yedisi", 8: "sekizi", 9: "dokuzu" };
  const kesirSoz = (k, p) => (k === 1 && p === 2 ? "yarısı" : `${PAYDA_DE[p]} ${PAY_I[k]}`);
  const kesir = (a, b) => `<span class="kesir"><span>${a}</span><span>${b}</span></span>`;
  const tamli = (t, a, b) => `<span class="tamli">${t}${kesir(a, b)}</span>`;

  // Kesir seçenekleri: [[pay, payda], ...] ilk eleman doğru
  function kesirSecenek(liste, html = (x) => kesir(x[0], x[1])) {
    const gor = new Set();
    const sonuc = [];
    liste.forEach((x, i) => {
      const k = x.join("/");
      if (gor.has(k) || x.some((v) => v <= 0) || sonuc.length >= 4) return;
      gor.add(k);
      sonuc.push({ html: html(x), dogru: i === 0, etiket: x.join(" bölü ") });
    });
    return sonuc;
  }

  // ---------------- Çarpım Ustası ----------------
  OE.ekle({
    id: "carpim",
    ad: "Çarpım Ustası",
    simge: "✖️",
    cocuk: "ayaz",
    grup: "Matematik",
    aciklama: "Çarpma ve bölme, süre tutuluyor",
    baslat: soruOyunu({
      sureli: true,
      uret(sv) {
        const tip = sv <= 2 ? "carp" : sv === 3 ? sec(["carp", "carp", "bol", "eksik"]) : sec(["carp", "bol", "bol", "eksik"]);
        if (tip === "eksik") {
          const a = aralik(2, 10);
          const b = aralik(2, 10);
          return {
            anahtar: `e${a}x${b}`,
            metin: `${a} × <span class="kutu">?</span> = ${a * b}`,
            denklem: true,
            secenekler: sayiSecenekleri(b, [b + 1, b - 1, a, b + 2]),
            aciklama: `${a} × ${b} = ${a * b}`,
          };
        }
        let a, b;
        if (sv === 1) [a, b] = [aralik(2, 5), aralik(1, 10)];
        else if (sv <= 3) [a, b] = [aralik(2, 10), aralik(2, 10)];
        else if (sv === 4) [a, b] = [aralik(11, 99), aralik(2, 9)];
        else if (tip === "bol" || Math.random() < 0.5) [a, b] = [aralik(100, 999), aralik(2, 9)];
        else [a, b] = [aralik(11, 40), aralik(11, 25)];
        const c = a * b;
        if (tip === "bol")
          return {
            anahtar: `b${c}/${b}`,
            metin: `${bicim(c)} ÷ ${b} = ?`,
            denklem: true,
            secenekler: sayiSecenekleri(a, [a + 1, a - 1, a + 10, a - 10, ters(a)]),
            aciklama: `${b} × ${bicim(a)} = ${bicim(c)} olduğu için ${bicim(c)} ÷ ${b} = ${bicim(a)}.`,
          };
        return {
          anahtar: `c${Math.min(a, b)}x${Math.max(a, b)}`,
          metin: `${bicim(a)} × ${bicim(b)} = ?`,
          denklem: true,
          secenekler: sayiSecenekleri(c, [c + a, c - a, c + b, c - b, c + 10, c - 10, ters(c)]),
          aciklama: `${bicim(a)} × ${bicim(b)} = ${bicim(c)}`,
        };
      },
    }),
  });

  // ---------------- Zihinden İşlem ----------------
  function eldesiz(a, b) {
    let s = 0;
    for (let m = 1; a || b; m *= 10, a = Math.floor(a / 10), b = Math.floor(b / 10)) s += ((a % 10) + (b % 10)) % 10 * m;
    return s;
  }
  function onluksuz(a, b) {
    let s = 0;
    for (let m = 1; a || b; m *= 10, a = Math.floor(a / 10), b = Math.floor(b / 10)) s += Math.abs((a % 10) - (b % 10)) * m;
    return s;
  }
  OE.ekle({
    id: "islemler",
    ad: "Zihinden İşlem",
    simge: "➕",
    cocuk: "ayaz",
    grup: "Matematik",
    aciklama: "Toplama, çıkarma, kısa yoldan çarpma, tahmin",
    baslat: soruOyunu({
      uret(sv) {
        const basamak = [0, 2, 3, 4, 4, 5][sv];
        const alt = 10 ** (basamak - 1);
        const ust = 10 ** basamak - 1;
        const tip = sec(sv === 1 ? ["topla", "cikar"] : sv <= 3 ? ["topla", "cikar", "eksik"] : ["topla", "cikar", "eksik", "kisa", "tahmin"]);
        if (tip === "kisa") {
          const k = sec([10, 100, 1000]);
          if (Math.random() < 0.5) {
            const a = aralik(2, 999);
            const c = a * k;
            return {
              anahtar: `k${a}x${k}`,
              metin: `${bicim(a)} × ${bicim(k)} = ?`,
              denklem: true,
              secenekler: sayiSecenekleri(c, [c * 10, c / 10, a + k]),
              aciklama: `${bicim(k)} ile çarparken sayının sağına ${String(k).length - 1} sıfır ekleriz.`,
            };
          }
          const a = aralik(2, 99);
          const c = a * k;
          return {
            anahtar: `k${c}/${k}`,
            metin: `${bicim(c)} ÷ ${bicim(k)} = ?`,
            denklem: true,
            secenekler: sayiSecenekleri(a, [a * 10, c / 10 === a ? a * 100 : c / 10, a + 1]),
            aciklama: `Sonu sıfırla biten bir sayıyı ${bicim(k)}'e bölerken sondan ${String(k).length - 1} sıfır sileriz.`,
          };
        }
        if (tip === "tahmin") {
          const a = aralik(101, 989);
          const b = aralik(101, 989);
          const y = (x) => Math.round(x / 100) * 100;
          const c = y(a) + y(b);
          return {
            anahtar: `t${a}+${b}`,
            metin: `En yakın yüzlüğe yuvarlayarak tahmin et:<br><span class="denklem-ic">${a} + ${b} ≈ ?</span>`,
            secenekler: sayiSecenekleri(c, [a + b, c + 100, c - 100, c + 200]),
            aciklama: `${a} → ${y(a)} ve ${b} → ${y(b)}. ${y(a)} + ${y(b)} = ${bicim(c)}.`,
          };
        }
        if (tip === "eksik") {
          const a = aralik(alt, ust);
          const b = aralik(alt, ust);
          if (Math.random() < 0.5)
            return {
              anahtar: `e${a}+${b}`,
              metin: `<span class="kutu">?</span> + ${bicim(b)} = ${bicim(a + b)}`,
              denklem: true,
              secenekler: sayiSecenekleri(a, [a + 10, a - 10, a + b, a + 1]),
              aciklama: `Bilinmeyen toplananı bulmak için toplamdan diğer toplananı çıkarırız: ${bicim(a + b)} − ${bicim(b)} = ${bicim(a)}.`,
            };
          const [x, y] = a > b ? [a, b] : [b, a];
          return {
            anahtar: `e${x}-${y}`,
            metin: `${bicim(x)} − <span class="kutu">?</span> = ${bicim(x - y)}`,
            denklem: true,
            secenekler: sayiSecenekleri(y, [y + 10, y - 10, x + (x - y), y + 1]),
            aciklama: `Eksilenden farkı çıkarırız: ${bicim(x)} − ${bicim(x - y)} = ${bicim(y)}.`,
          };
        }
        if (tip === "topla") {
          const a = aralik(alt, ust);
          const b = aralik(alt, ust);
          const c = a + b;
          return {
            anahtar: `${a}+${b}`,
            metin: `${bicim(a)} + ${bicim(b)} = ?`,
            denklem: true,
            secenekler: sayiSecenekleri(c, [eldesiz(a, b), c + 10, c - 10, c + 100, c - 1]),
            aciklama: "Birler basamağından başla; 10'u geçince eldeyi bir sonraki basamağa ekle.",
          };
        }
        const a = aralik(alt + 1, ust);
        const b = aralik(alt, a - 1);
        const c = a - b;
        return {
          anahtar: `${a}-${b}`,
          metin: `${bicim(a)} − ${bicim(b)} = ?`,
          denklem: true,
          secenekler: sayiSecenekleri(c, [onluksuz(a, b), c + 10, c - 10, c + 100, c + 1]),
          aciklama: "Üstteki rakam küçükse bir sonraki basamaktan 1 onluk (ya da yüzlük) alırız.",
        };
      },
    }),
  });

  // ---------------- Problem Çöz ----------------
  const PROBLEMLER = [
    (sv) => {
      const a = aralik(20, 40 * sv), b = aralik(10, 20 * sv), c = aralik(5, Math.min(a + b - 1, 30 * sv));
      return { metin: `Ayaz'ın kumbarasında ${a} TL vardı. Babası ${b} TL daha verdi. Ayaz ${c} TL'lik bir kitap aldı. Ayaz'ın kaç TL'si kaldı?`, cevap: a + b - c, birim: " TL", hatalar: [a + b + c, a + b, a - c], aciklama: `Önce topla: ${a} + ${b} = ${a + b}. Sonra çıkar: ${a + b} − ${c} = ${a + b - c}.` };
    },
    (sv) => {
      const k = aralik(3, 5 + sv), t = aralik(6, 8 + sv * 2);
      return { metin: `Ada'nın ${k} kutu boya kalemi var. Her kutuda ${t} kalem varsa Ada'nın toplam kaç boya kalemi vardır?`, cevap: k * t, birim: " kalem", hatalar: [k + t, k * t + t, k * t - k], aciklama: `${k} kutu × ${t} kalem = ${k * t} kalem.` };
    },
    (sv) => {
      const k = aralik(2, 4 + sv), her = aralik(3, 6 + sv * 2), t = k * her;
      return { metin: `${t} ceviz ${k} çocuğa eşit olarak paylaştırılıyor. Her çocuk kaç ceviz alır?`, cevap: her, birim: " ceviz", hatalar: [t - k, her + 1, her - 1, k], aciklama: `Eşit paylaştırma bölmedir: ${t} ÷ ${k} = ${her}.` };
    },
    (sv) => {
      const g = aralik(5, 10 + sv * 3), d = aralik(4, 6 + sv * 2);
      return { metin: `Bir kitap ${g * d} sayfadır. Ayaz her gün ${g} sayfa okursa kitabı kaç günde bitirir?`, cevap: d, birim: " gün", hatalar: [d + 1, d - 1, d + 2, g], aciklama: `${g * d} ÷ ${g} = ${d} gün.` };
    },
    (sv) => {
      const a = aralik(20, 30 + 10 * sv), b = aralik(5, 15), c = aralik(3, 15);
      return { metin: `Bir otobüste ${a} yolcu vardı. İlk durakta ${b} yolcu indi, ${c} yolcu bindi. Otobüste kaç yolcu oldu?`, cevap: a - b + c, birim: " yolcu", hatalar: [a + b - c, a + b + c, a - b - c], aciklama: `İnenler çıkar, binenler eklenir: ${a} − ${b} + ${c} = ${a - b + c}.` };
    },
    (sv) => {
      const t = aralik(3, 6 + sv * 2), i = aralik(2, 4 + sv);
      return { metin: `Bir çiftlikte ${t} tavuk ve ${i} inek var. Bu hayvanların toplam kaç ayağı vardır?`, cevap: t * 2 + i * 4, birim: " ayak", hatalar: [(t + i) * 4, (t + i) * 2, t * 4 + i * 2], aciklama: `Tavukların ${t} × 2 = ${t * 2}, ineklerin ${i} × 4 = ${i * 4} ayağı var. Toplam ${t * 2 + i * 4}.` };
    },
    (sv) => {
      const n = aralik(2, 3 + sv), f = aralik(5, 10 + sv * 5), o = Math.ceil((n * f + 1) / 50) * 50;
      return { metin: `Ayaz tanesi ${f} TL olan defterlerden ${n} tane aldı ve kasaya ${o} TL verdi. Kaç TL para üstü alır?`, cevap: o - n * f, birim: " TL", hatalar: [o - f, n * f, o - n - f], aciklama: `Defterler ${n} × ${f} = ${n * f} TL. Para üstü ${o} − ${n * f} = ${o - n * f} TL.` };
    },
    (sv) => {
      const p = sec([2, 3, 4, 5]), t = p * aralik(3, 5 + sv * 3);
      return { metin: `${t} sayfalık bir kitabın ${kesirSoz(1, p)} okundu. Kaç sayfa okundu?`, cevap: t / p, birim: " sayfa", hatalar: [t - p, t / p + 1, t * p, t / p - 1], aciklama: `${t} ÷ ${p} = ${t / p} sayfa.` };
    },
    (sv) => {
      const k = aralik(10, 16), e = aralik(10, 16), s = aralik(2, 3 + sv);
      return { metin: `Bir sınıfta ${k} kız ve ${e} erkek öğrenci var. Okulda bu sınıf kadar öğrencisi olan ${s} sınıf varsa toplam kaç öğrenci vardır?`, cevap: (k + e) * s, birim: " öğrenci", hatalar: [k + e + s, (k + e) * (s + 1), k * s + e], aciklama: `Bir sınıfta ${k} + ${e} = ${k + e} öğrenci var. ${k + e} × ${s} = ${(k + e) * s}.` };
    },
    (sv) => {
      const p = aralik(3, 6), n = aralik(4, 6 + sv * 2), b = aralik(2, 9), a = p * n + b;
      return { metin: `Manavda ${a} elma vardı. Bunların ${b} tanesi çürük çıktı. Kalan elmalar her poşete ${p} elma konarak paketlenecek. Kaç poşet gerekir?`, cevap: n, birim: " poşet", hatalar: [n + 1, n - 1, n + 2, a - b], aciklama: `Kalan elma ${a} − ${b} = ${a - b}. ${a - b} ÷ ${p} = ${n} poşet.` };
    },
    (sv) => {
      const kg = aralik(2, 4 + sv), f = aralik(15, 25 + sv * 10);
      return { metin: `Annesi pazardan ${kg} kilogram domates aldı. Domatesin kilogramı ${f} TL ise kaç TL ödedi?`, cevap: kg * f, birim: " TL", hatalar: [kg + f, kg * f + f, kg * f - kg], aciklama: `${kg} × ${f} = ${kg * f} TL.` };
    },
    (sv) => {
      const b = aralik(200, 400 * sv), a = b + aralik(50, 150 * sv);
      return { metin: `Bir yürüyüşte Ayaz ${a} adım, Ada ${b} adım attı. Ayaz, Ada'dan kaç adım fazla attı?`, cevap: a - b, birim: " adım", hatalar: [a + b, a - b + 10, a - b - 10], aciklama: `“Kaç fazla” sorusu çıkarma ister: ${a} − ${b} = ${a - b}.` };
    },
    (sv) => {
      const g = aralik(20, 50 * sv);
      return { metin: `Bir fırın her gün ${g} ekmek üretiyor. Bu fırın bir haftada kaç ekmek üretir?`, cevap: g * 7, birim: " ekmek", hatalar: [g * 5, g * 30, g + 7, g * 6], aciklama: `Bir hafta 7 gündür: ${g} × 7 = ${g * 7}.` };
    },
  ];
  OE.ekle({
    id: "problemler",
    ad: "Problem Çöz",
    simge: "🧮",
    cocuk: "ayaz",
    grup: "Matematik",
    aciklama: "Günlük hayattan problemler",
    baslat: soruOyunu({
      soruSayisi: 8,
      uret(sv) {
        const i = Math.floor(Math.random() * PROBLEMLER.length);
        const p = PROBLEMLER[i](sv);
        return {
          anahtar: "p" + i,
          metin: p.metin,
          tur: "metin-sayi",
          sutun: 2,
          secenekler: sayiSecenekleri(p.cevap, p.hatalar, { sonek: p.birim }),
          aciklama: p.aciklama,
        };
      },
    }),
  });

  // ---------------- Kesirler ----------------
  function pasta(p, k) {
    let s = "";
    for (let i = 0; i < p; i++) {
      const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / p;
      const a1 = a0 + (2 * Math.PI) / p;
      const n = (a) => (100 + 82 * Math.cos(a)).toFixed(1) + " " + (100 + 82 * Math.sin(a)).toFixed(1);
      s += `<path class="parca${i < k ? " boyali" : ""}" d="M100 100L${n(a0)}A82 82 0 0 1 ${n(a1)}Z"/>`;
    }
    return `<svg viewBox="0 0 200 200" class="kesir-sekil" aria-hidden="true">${s}</svg>`;
  }
  function serit(p, k) {
    const w = 280 / p;
    let s = "";
    for (let i = 0; i < p; i++) s += `<rect class="parca${i < k ? " boyali" : ""}" x="${(10 + i * w).toFixed(1)}" y="10" width="${w.toFixed(1)}" height="60"/>`;
    return `<svg viewBox="0 0 300 80" class="kesir-serit" aria-hidden="true">${s}</svg>`;
  }
  OE.ekle({
    id: "kesirler",
    ad: "Kesirler",
    simge: "🍕",
    cocuk: "ayaz",
    grup: "Matematik",
    aciklama: "Kesir tanıma, karşılaştırma, kesir kadarı",
    baslat: soruOyunu({
      uret(sv) {
        const tipler = [null, ["tani"], ["tani", "karsilastir"], ["tani", "karsilastir", "kadar", "topla"], ["karsilastir", "kadar", "topla", "bilesik"], ["kadar", "topla", "bilesik", "tamli"]][sv];
        const tip = sec(tipler);
        const maxP = sv <= 2 ? 6 : sv <= 4 ? 8 : 10;
        if (tip === "karsilastir") {
          if (Math.random() < 0.5) {
            const p = aralik(4, maxP + 2);
            const [a, b] = secN([...Array(p - 1).keys()].map((x) => x + 1), 2);
            return {
              anahtar: `k${a}${b}/${p}`,
              metin: "Hangisi daha büyük?",
              tur: "buyuk",
              secenekler: [{ html: kesir(a, p), dogru: a > b }, { html: kesir(b, p), dogru: b > a }],
              aciklama: "Paydaları eşit kesirlerde payı büyük olan kesir daha büyüktür.",
            };
          }
          const [a, b] = secN([2, 3, 4, 5, 6, 8, 10], 2);
          return {
            anahtar: `b1/${a}1/${b}`,
            metin: "Hangisi daha büyük?",
            tur: "buyuk",
            secenekler: [{ html: kesir(1, a), dogru: a < b }, { html: kesir(1, b), dogru: b < a }],
            aciklama: "Payları eşit kesirlerde paydası küçük olan daha büyüktür: bütün daha az parçaya bölünür, her parça daha büyük olur.",
          };
        }
        if (tip === "kadar") {
          const p = sec([2, 3, 4, 5, 6, 8, 10].filter((x) => x <= maxP));
          const k = sv >= 4 && p > 2 ? aralik(1, p - 1) : 1;
          const t = p * aralik(2, sv >= 4 ? 12 : 8);
          const c = (t / p) * k;
          return {
            anahtar: `d${k}/${p}/${t}`,
            metin: `${ekIn(t)} ${kesirSoz(k, p)} kaçtır?`,
            gorsel: `<div class="kesir-buyuk">${kesir(k, p)}</div>`,
            secenekler: sayiSecenekleri(c, [t / p, t - k, c + t / p, t * k, c - 1]),
            aciklama: `${bicim(t)} ÷ ${p} = ${bicim(t / p)}` + (k > 1 ? `, ${bicim(t / p)} × ${k} = ${bicim(c)}.` : "."),
          };
        }
        if (tip === "topla") {
          const p = aralik(3, maxP + 1);
          const a = aralik(1, p - 2);
          const b = aralik(1, p - 1 - a);
          if (Math.random() < 0.5)
            return {
              anahtar: `t${a}+${b}/${p}`,
              metin: `${kesir(a, p)} + ${kesir(b, p)} = ?`,
              denklem: true,
              tur: "buyuk",
              secenekler: kesirSecenek([[a + b, p], [a + b, p * 2], [a * b, p], [a + b + 1, p], [a + b - 1, p]]),
              aciklama: "Paydaları eşit kesirler toplanırken paylar toplanır, payda aynı kalır.",
            };
          const x = a + b;
          return {
            anahtar: `c${x}-${b}/${p}`,
            metin: `${kesir(x, p)} − ${kesir(b, p)} = ?`,
            denklem: true,
            tur: "buyuk",
            secenekler: kesirSecenek([[a, p], [a, 0], [x + b, p], [a + 1, p], [a, p - 1]]),
            aciklama: "Paydaları eşit kesirler çıkarılırken paylar çıkarılır, payda aynı kalır.",
          };
        }
        if (tip === "bilesik") {
          const bilesikMi = Math.random() < 0.5;
          const basit = () => { const p = aralik(3, 9); return [aralik(1, p - 1), p]; };
          const bil = () => { const p = aralik(2, 7); return [aralik(p, p * 2 + 1), p]; };
          const d = bilesikMi ? bil() : basit();
          const y = [];
          while (y.length < 3) {
            const x = bilesikMi ? basit() : bil();
            if (!y.some((z) => z.join() === x.join())) y.push(x);
          }
          return {
            anahtar: "s" + d.join("/"),
            metin: bilesikMi ? "Hangisi bileşik kesirdir?" : "Hangisi basit kesirdir?",
            tur: "buyuk",
            secenekler: kesirSecenek([d, ...y]),
            aciklama: bilesikMi ? "Payı paydasına eşit ya da paydasından büyük olan kesir bileşik kesirdir." : "Payı paydasından küçük olan kesir basit kesirdir.",
          };
        }
        if (tip === "tamli") {
          const p = aralik(2, 6);
          const t = aralik(1, 3);
          const r = aralik(1, p - 1);
          const a = t * p + r;
          if (Math.random() < 0.5)
            return {
              anahtar: `m${a}/${p}`,
              metin: `${kesir(a, p)} kesrinin tam sayılı kesir olarak yazılışı hangisidir?`,
              tur: "buyuk",
              secenekler: kesirSecenek([[t, r, p], [r, t, p], [t + 1, r, p], [t, p - r, p], [a, 1, p]].filter((x) => x[1] < x[2]), (x) => tamli(...x)),
              aciklama: `${a} ÷ ${p} = ${t}, kalan ${r}. Yani ${t} tam ${r}/${p}.`,
            };
          return {
            anahtar: `n${t}${r}/${p}`,
            metin: `${tamli(t, r, p)} kesrinin bileşik kesir olarak yazılışı hangisidir?`,
            tur: "buyuk",
            secenekler: kesirSecenek([[a, p], [t + r, p], [t * r + p, p], [a + 1, p], [a, p + 1]]),
            aciklama: `Tam kısmı paydayla çarp, paya ekle: ${t} × ${p} + ${r} = ${a}. Sonuç ${a}/${p}.`,
          };
        }
        const p = aralik(2, maxP);
        const k = aralik(1, p - 1);
        return {
          anahtar: `${k}/${p}`,
          metin: "Boyalı kısmı gösteren kesir hangisi?",
          gorsel: Math.random() < 0.5 ? pasta(p, k) : serit(p, k),
          tur: "buyuk",
          secenekler: kesirSecenek([[k, p], [p - k, p], [k, p + 1], [k + 1, p], [p, k], [k, p - 1]]),
          aciklama: `Bütün ${p} eş parçaya bölünmüş, ${k} parçası boyalı: ${k}/${p}.`,
        };
      },
    }),
  });

  // ---------------- Sayı Bilgini ----------------
  const BASAMAK_AD = ["birler", "onlar", "yüzler", "binler", "on binler", "yüz binler"];
  function romen(n) {
    const t = [[100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let s = "";
    for (const [v, r] of t) while (n >= v) { s += r; n -= v; }
    return s;
  }
  function sayiUret(b) {
    let s = String(aralik(1, 9));
    for (let i = 1; i < b; i++) s += Math.random() < 0.25 ? "0" : aralik(0, 9);
    return +s;
  }
  function benzerler(n, adet) {
    const r = String(n).split("");
    const kume = new Set();
    for (let d = 0; kume.size < adet && d < 60; d++) {
      const x = r.slice();
      const i = aralik(0, x.length - 2);
      const tur = aralik(0, 2);
      if (tur === 0) [x[i], x[i + 1]] = [x[i + 1], x[i]];
      else if (tur === 1) x[aralik(1, x.length - 1)] = "0";
      else {
        const z = x.indexOf("0", 1);
        if (z < 0) continue;
        x.splice(z, 1);
        x.splice(aralik(1, x.length), 0, "0");
      }
      const y = +x.join("");
      if (x[0] !== "0" && y !== n) kume.add(y);
    }
    for (let k = 1; kume.size < adet; k++) kume.add(n + k * 1000);
    return [...kume];
  }
  OE.ekle({
    id: "basamak",
    ad: "Sayı Bilgini",
    simge: "🔢",
    cocuk: "ayaz",
    grup: "Matematik",
    aciklama: "Okunuş, basamak değeri, yuvarlama, Romen rakamları",
    baslat: soruOyunu({
      uret(sv) {
        const b = [0, 4, 5, 6, 6, 6][sv];
        const tipler = sv === 1 ? ["okunus", "deger", "yuvarla"] : sv === 2 ? ["okunus", "deger", "yuvarla", "romen"] : ["okunus", "deger", "yuvarla", "romen", "sirala"];
        if (sv === 5) tipler.push("yazilis");
        const tip = sec(tipler);
        if (tip === "okunus" || tip === "yazilis") {
          const n = sayiUret(b);
          const liste = [n, ...benzerler(n, 3)];
          if (tip === "okunus")
            return {
              anahtar: "o" + n,
              metin: `Okunuşu <b>“${bas(sayiOku(n))}”</b> olan sayı hangisidir?`,
              tur: "rakam",
              sutun: 2,
              secenekler: liste.map((x) => ({ html: bicim(x), dogru: x === n })),
              aciklama: `Sayıyı bölüklere ayırarak oku: ${bicim(n)}.`,
            };
          return {
            anahtar: "y" + n,
            metin: `<span class="denklem-ic">${bicim(n)}</span><br>sayısının okunuşu hangisidir?`,
            tur: "metin",
            secenekler: liste.map((x) => ({ html: bas(sayiOku(x)), dogru: x === n })),
            aciklama: `${bicim(n)}: ${bas(sayiOku(n))}.`,
          };
        }
        if (tip === "deger") {
          let n, i, r;
          do {
            n = sayiUret(b);
            r = String(n);
            const tekler = r.split("").map((c, j) => j).filter((j) => r[j] !== "0" && r.split(r[j]).length === 2);
            i = tekler.length ? sec(tekler) : -1;
          } while (i < 0);
          const d = +r[i];
          const yer = r.length - 1 - i;
          const v = d * 10 ** yer;
          const kuvvetler = karistir([...Array(r.length).keys()].filter((j) => j !== yer)).slice(0, 3);
          return {
            anahtar: "d" + n + i,
            metin: `<span class="denklem-ic">${bicim(n)}</span><br>sayısındaki <b class="vurgu-rakam">${d}</b> rakamının basamak değeri kaçtır?`,
            tur: "rakam",
            sutun: 2,
            secenekler: [v, ...kuvvetler.map((j) => d * 10 ** j)].map((x) => ({ html: bicim(x), dogru: x === v })),
            aciklama: `${d} rakamı ${BASAMAK_AD[yer]} basamağında. Basamak değeri ${bicim(v)}.`,
          };
        }
        if (tip === "yuvarla") {
          const hedef = sv === 1 ? 10 : sv === 2 ? sec([10, 100]) : sec([10, 100, 1000]);
          const n = aralik(hedef * 10 + 1, hedef * 100 - 1);
          if (n % hedef === 0) return this.uret(sv);
          const asagi = Math.floor(n / hedef) * hedef;
          const yukari = asagi + hedef;
          const c = Math.round(n / hedef) * hedef;
          const ad = { 10: "onluğa", 100: "yüzlüğe", 1000: "binliğe" }[hedef];
          return {
            anahtar: "r" + n + hedef,
            metin: `<span class="denklem-ic">${bicim(n)}</span><br>sayısını en yakın ${ad} yuvarla.`,
            tur: "rakam",
            sutun: 2,
            secenekler: sayiSecenekleri(c, [asagi === c ? yukari : asagi, c + hedef, c - hedef, Math.round(n / (hedef * 10)) * hedef * 10]),
            aciklama: `${bicim(n)}, ${bicim(asagi)} ile ${bicim(yukari)} arasında. Bakılan rakam 5 ya da daha büyükse yukarı, küçükse aşağı yuvarlanır: ${bicim(c)}.`,
          };
        }
        if (tip === "romen") {
          const ust = sv <= 2 ? 20 : sv === 3 ? 39 : 100;
          const n = aralik(1, ust);
          const yakin = [n + 1, n - 1, n + 5, n - 5, n + 10, n - 10, n + 2].filter((x) => x >= 1 && x <= ust + 10);
          if (Math.random() < 0.5)
            return {
              anahtar: "m" + n,
              metin: `Romen rakamıyla <b class="romen">${romen(n)}</b> hangi sayıdır?`,
              tur: "rakam",
              sutun: 2,
              secenekler: sayiSecenekleri(n, yakin),
              aciklama: `${romen(n)} = ${n}. I = 1, V = 5, X = 10, L = 50, C = 100; küçük rakam büyükten önce gelirse çıkarılır.`,
            };
          const sec4 = [n, ...secN(yakin, 3)];
          return {
            anahtar: "M" + n,
            metin: `<span class="denklem-ic">${n}</span><br>Romen rakamıyla nasıl yazılır?`,
            tur: "rakam",
            sutun: 2,
            secenekler: sec4.map((x) => ({ html: `<span class="romen">${romen(x)}</span>`, dogru: x === n })),
            aciklama: `${n} = ${romen(n)}.`,
          };
        }
        const n = sayiUret(b);
        const liste = [n, ...benzerler(n, 3)];
        const buyuk = Math.random() < 0.5;
        const hedef = buyuk ? Math.max(...liste) : Math.min(...liste);
        return {
          anahtar: "s" + n,
          metin: `Hangisi en ${buyuk ? "büyük" : "küçük"}?`,
          tur: "rakam",
          sutun: 2,
          secenekler: liste.map((x) => ({ html: bicim(x), dogru: x === hedef })),
          aciklama: "Basamak sayıları eşitse en büyük basamaktan başlayarak rakamları karşılaştır.",
        };
      },
    }),
  });

  // ---------------- Saat Kaç? ----------------
  const SAAT_I = ["", "biri", "ikiyi", "üçü", "dördü", "beşi", "altıyı", "yediyi", "sekizi", "dokuzu", "onu", "on biri", "on ikiyi"];
  const SAAT_E = ["", "bire", "ikiye", "üçe", "dörde", "beşe", "altıya", "yediye", "sekize", "dokuza", "ona", "on bire", "on ikiye"];
  const SAAT_AD = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on", "on bir", "on iki"];
  function saatSoz(s, d) {
    if (d === 0) return `Saat ${SAAT_AD[s]}`;
    if (d === 30) return `Saat ${SAAT_AD[s]} buçuk`;
    if (d < 30) return `Saat ${SAAT_I[s]} ${d === 15 ? "çeyrek" : sayiOku(d)} geçiyor`;
    const sonraki = (s % 12) + 1;
    return `Saat ${SAAT_E[sonraki]} ${60 - d === 15 ? "çeyrek" : sayiOku(60 - d)} var`;
  }
  const dijital = (s, d) => `${s}:${iki(d)}`;
  function saatSvg(s, d, sinif = "") {
    let g = `<svg viewBox="0 0 200 200" class="saat ${sinif}" aria-hidden="true"><circle cx="100" cy="100" r="94" class="saat-yuz"/>`;
    for (let i = 0; i < 60; i++) {
      const a = (i * 6 * Math.PI) / 180;
      const r1 = i % 5 ? 85 : 78;
      g += `<line x1="${(100 + r1 * Math.sin(a)).toFixed(1)}" y1="${(100 - r1 * Math.cos(a)).toFixed(1)}" x2="${(100 + 90 * Math.sin(a)).toFixed(1)}" y2="${(100 - 90 * Math.cos(a)).toFixed(1)}" class="saat-cizgi${i % 5 ? "" : " kalin"}"/>`;
    }
    for (let i = 1; i <= 12; i++) {
      const a = (i * 30 * Math.PI) / 180;
      g += `<text x="${(100 + 64 * Math.sin(a)).toFixed(1)}" y="${(100 - 64 * Math.cos(a)).toFixed(1)}" class="saat-rakam">${i}</text>`;
    }
    g += `<line x1="100" y1="100" x2="100" y2="54" class="akrep" transform="rotate(${((s % 12) + d / 60) * 30} 100 100)"/>`;
    g += `<line x1="100" y1="100" x2="100" y2="24" class="yelkovan" transform="rotate(${d * 6} 100 100)"/><circle cx="100" cy="100" r="6" class="saat-merkez"/></svg>`;
    return g;
  }
  const CEVIRME = [
    () => ({ m: "1 saat kaç dakikadır?", c: 60, y: [100, 30, 24] }),
    () => ({ m: "1 dakika kaç saniyedir?", c: 60, y: [100, 10, 30] }),
    () => ({ m: "1 gün kaç saattir?", c: 24, y: [12, 60, 30] }),
    () => ({ m: "1 yıl kaç aydır?", c: 12, y: [10, 52, 365] }),
    () => ({ m: "1 yıl kaç gündür?", c: 365, y: [300, 360, 52] }),
    () => ({ m: "Yarım saat kaç dakikadır?", c: 30, y: [50, 15, 20] }),
    () => ({ m: "Çeyrek saat kaç dakikadır?", c: 15, y: [25, 4, 45] }),
    () => { const n = aralik(2, 5); return { m: `${n} hafta kaç gündür?`, c: n * 7, y: [n * 5, n * 7 + 7, n * 10] }; },
    () => { const s = aralik(1, 4), d = aralik(1, 11) * 5; return { m: `${s} saat ${d} dakika kaç dakikadır?`, c: s * 60 + d, y: [s * 100 + d, s * 60, s + d] }; },
    () => { const s = aralik(2, 5); return { m: `${s * 60} dakika kaç saattir?`, c: s, y: [s * 10, s + 1, s * 6] }; },
    () => { const n = aralik(2, 4); return { m: `${n} gün kaç saattir?`, c: n * 24, y: [n * 12, n * 60, n * 24 + 24] }; },
  ];
  OE.ekle({
    id: "saat",
    ad: "Saat Kaç?",
    simge: "🕒",
    cocuk: "ayaz",
    grup: "Matematik",
    aciklama: "Saat okuma, süre ve zaman birimleri",
    baslat: soruOyunu({
      uret(sv) {
        const tip = sec([null, ["oku"], ["oku", "oku", "soz"], ["oku", "soz", "sec"], ["oku", "sec", "sure", "cevir"], ["oku", "sure", "sure", "cevir", "sec"]][sv]);
        const dakika = () =>
          sv === 1 ? sec([0, 30]) : sv === 2 ? sec([0, 15, 30, 45]) : sv === 3 || Math.random() < 0.5 ? aralik(0, 11) * 5 : aralik(0, 59);
        if (tip === "cevir") {
          const q = sec(CEVIRME)();
          return { anahtar: "c" + q.m, metin: q.m, secenekler: sayiSecenekleri(q.c, q.y), aciklama: "1 gün = 24 saat, 1 saat = 60 dakika, 1 dakika = 60 saniye, 1 hafta = 7 gün, 1 yıl = 12 ay." };
        }
        if (tip === "sure") {
          const s = aralik(8, 19);
          const d = aralik(0, 11) * 5;
          const ss = aralik(0, 2);
          const sd = aralik(1, 11) * 5;
          const top = s * 60 + d + ss * 60 + sd;
          const bs = Math.floor(top / 60) % 24;
          const bd = top % 60;
          const yaz = (x) => `${iki(Math.floor(x / 60) % 24)}:${iki(x % 60)}`;
          const dogruY = yaz(top);
          const aday = [yaz(top + 10), yaz(top - 60), yaz(top + 60), yaz(top - 10)];
          if (d + sd >= 60) aday.unshift(yaz(top - 60)); // eldeyi saate eklemeyi unutma hatası
          const secenek = [dogruY, ...[...new Set(aday)].filter((x) => x !== dogruY).slice(0, 3)];
          const sureYazi = (ss ? `${ss} saat ` : "") + `${sd} dakika`;
          return {
            anahtar: "s" + s + d + ss + sd,
            metin: `Film saat <b>${iki(s)}:${iki(d)}</b> başladı ve <b>${sureYazi}</b> sürdü. Film saat kaçta bitti?`,
            tur: "rakam",
            sutun: 2,
            secenekler: secenek.map((x) => ({ html: x, dogru: x === dogruY })),
            aciklama: `Önce saatleri, sonra dakikaları ekle; dakika 60'ı geçerse 1 saat olarak saate ekle. Bitiş: ${iki(bs)}:${iki(bd)}.`,
          };
        }
        const s = aralik(1, 12);
        const d = dakika();
        if (tip === "sec") {
          const adaylar = [[(s % 12) + 1, d], [s, (d + 30) % 60], [d === 0 ? 12 : Math.max(1, Math.round(d / 5)), (s * 5) % 60], [s, (d + 15) % 60]];
          const gor = new Set([s + ":" + d]);
          const liste = [[s, d]];
          for (const x of adaylar) if (liste.length < 3 && !gor.has(x.join(":"))) { gor.add(x.join(":")); liste.push(x); }
          return {
            anahtar: "e" + s + d,
            metin: `<b>${saatSoz(s, d)}</b>.<br>Hangi saat bunu gösteriyor?`,
            tur: "buyuk",
            sutun: 3,
            secenekler: liste.map((x, i) => ({ html: saatSvg(x[0], x[1], "kucuk"), dogru: i === 0, etiket: dijital(x[0], x[1]) })),
            aciklama: `Kısa kol (akrep) saati, uzun kol (yelkovan) dakikayı gösterir. Doğrusu ${dijital(s, d)}.`,
          };
        }
        const adaylar = [
          [s, (d + 5) % 60], [(s % 12) + 1, d], [s === 1 ? 12 : s - 1, d], [d === 0 ? 12 : Math.max(1, Math.round(d / 5)), (s * 5) % 60],
          [s, (d + 30) % 60], [s, (60 - d) % 60],
        ];
        const gor = new Set([s + ":" + d]);
        const liste = [[s, d]];
        for (const x of karistir(adaylar)) if (liste.length < 4 && !gor.has(x.join(":"))) { gor.add(x.join(":")); liste.push(x); }
        const sozlu = tip === "soz";
        return {
          anahtar: "o" + s + d + tip,
          metin: "Saat kaç?",
          gorsel: saatSvg(s, d) + (sv <= 2 ? `<p class="ipucu">Kısa kol (akrep) saati, uzun kol (yelkovan) dakikayı gösterir.</p>` : ""),
          tur: sozlu ? "metin" : "rakam",
          sutun: sozlu ? 1 : 2,
          secenekler: liste.map((x, i) => ({ html: sozlu ? saatSoz(x[0], x[1]) : dijital(x[0], x[1]), dogru: i === 0 })),
          aciklama: `Akrep ${s} ile ${(s % 12) + 1} arasında, yelkovan ${d} dakikayı gösteriyor: ${dijital(s, d)} (${saatSoz(s, d).toLocaleLowerCase("tr")}).`,
        };
      },
    }),
  });

  // ---------------- Doğru Yazım ----------------
  OE.ekle({
    id: "yazim",
    ad: "Doğru Yazım",
    simge: "✍️",
    cocuk: "ayaz",
    grup: "Türkçe ve İngilizce",
    aciklama: "Yazım kuralları, de/da, ki, mi",
    baslat: soruOyunu({
      uret(sv) {
        const tip = sv === 1 ? "kelime" : sec(sv >= 3 ? ["kelime", "karisik", "cumle", "cumle"] : ["kelime", "cumle"]);
        if (tip === "cumle") {
          const q = sec(veri.YAZIM_CUMLE);
          return { anahtar: q.d, metin: "Hangi cümle doğru yazılmıştır?", tur: "metin", secenekler: [{ html: q.d, dogru: true }, { html: q.y, dogru: false }], aciklama: q.n };
        }
        if (tip === "karisik") {
          // 4. seviyeden sonra bazen “hangisi yanlış” diye sorulur
          const yanlisSor = sv >= 4 && Math.random() < 0.5;
          const [a, ...b] = secN(veri.YAZIM_KELIME, 4);
          const secenek = yanlisSor
            ? [{ html: sec(a.slice(1)), dogru: true }, ...b.map((x) => ({ html: x[0], dogru: false }))]
            : [{ html: a[0], dogru: true }, ...b.map((x) => ({ html: sec(x.slice(1)), dogru: false }))];
          return {
            anahtar: "k" + a[0],
            metin: yanlisSor ? "Hangisi <b>yanlış</b> yazılmıştır?" : "Hangisi doğru yazılmıştır?",
            secenekler: secenek,
            aciklama: yanlisSor ? `“${a[0]}” diye yazılmalıydı.` : `Diğerlerinin doğrusu: ${b.map((x) => "“" + x[0] + "”").join(", ")}.`,
          };
        }
        const [d, ...y] = sec(veri.YAZIM_KELIME);
        return { anahtar: d, metin: "Hangisi doğru yazılmıştır?", secenekler: [{ html: d, dogru: true }, ...y.map((x) => ({ html: x, dogru: false }))], aciklama: `Doğrusu: “${d}”.` };
      },
    }),
  });

  // ---------------- Kelime Avcısı ----------------
  function iliski(liste) {
    const m = new Map();
    const ekle = (a, b) => (m.get(a) || m.set(a, new Set()).get(a)).add(b);
    for (const [a, b] of liste) {
      ekle(a, b);
      ekle(b, a);
    }
    return m;
  }
  const ES = iliski(veri.ES_ANLAM);
  const ZIT = iliski(veri.ZIT_ANLAM);
  const TUM_KELIME = [...new Set([...veri.ES_ANLAM.flat(), ...veri.ZIT_ANLAM.flat()])];
  OE.ekle({
    id: "kelimeler",
    ad: "Kelime Avcısı",
    simge: "📚",
    cocuk: "ayaz",
    grup: "Türkçe ve İngilizce",
    aciklama: "Eş, zıt ve sesteş anlam, atasözleri",
    baslat: soruOyunu({
      uret(sv) {
        const tip = sec(sv <= 2 ? ["es", "zit"] : sv === 3 ? ["es", "zit", "sestes"] : ["es", "zit", "sestes", "atasozu"]);
        if (tip === "sestes") {
          const q = sec(veri.SESTES);
          return {
            anahtar: q.c,
            metin: `“${q.c}”<br>Bu cümlede koyu yazılan kelime hangi anlamda kullanılmıştır?`,
            tur: "metin",
            secenekler: [{ html: q.d, dogru: true }, ...q.y.map((x) => ({ html: x, dogru: false }))],
            aciklama: "Yazılışı ve okunuşu aynı, anlamı farklı kelimelere sesteş (eş sesli) kelime denir.",
          };
        }
        if (tip === "atasozu") {
          const q = sec(veri.ATASOZU);
          return {
            anahtar: q.s,
            metin: `Atasözünü tamamla:<br><b>${q.s.replace("___", '<span class="kutu">?</span>')}</b>`,
            secenekler: [{ html: q.d, dogru: true }, ...q.y.map((x) => ({ html: x, dogru: false }))],
            aciklama: q.s.replace("___", q.d),
          };
        }
        const es = tip === "es";
        const [a, b] = karistir(sec(es ? veri.ES_ANLAM : veri.ZIT_ANLAM));
        const yasak = new Set([a, ...(es ? ES : ZIT).get(a)]);
        if (!es) for (const z of ZIT.get(a)) for (const e of ES.get(z) || []) yasak.add(e);
        const yanlis = secN(TUM_KELIME.filter((x) => !yasak.has(x)), sv === 1 ? 2 : 3);
        return {
          anahtar: tip + a,
          metin: `<b>“${a}”</b> kelimesinin ${es ? "eş" : "zıt"} anlamlısı hangisidir?`,
          secenekler: [{ html: b, dogru: true }, ...yanlis.map((x) => ({ html: x, dogru: false }))],
          aciklama: `${bas(a)} ↔ ${b}. ${es ? "Eş anlamlı kelimelerin yazılışları farklı, anlamları aynıdır." : "Zıt anlamlı kelimeler birbirinin karşıtı olan anlamları taşır."}`,
        };
      },
    }),
  });

  // ---------------- English Words ----------------
  const ING_BIR = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const ING_ON = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const ingSayi = (n) => (n < 20 ? ING_BIR[n] : n === 100 ? "one hundred" : ING_ON[Math.floor(n / 10)] + (n % 10 ? "-" + ING_BIR[n % 10] : ""));
  OE.ekle({
    id: "ingilizce",
    ad: "English Words",
    simge: "💬",
    cocuk: "ayaz",
    grup: "Türkçe ve İngilizce",
    aciklama: "Resimli kelimeler, dinleme, sayılar, ülkeler",
    baslat: soruOyunu({
      uret(sv) {
        const havuz = veri.INGILIZCE.filter((x) => veri.ING_SEVIYE[sv].includes(x.k));
        const tip = sec([null, ["resim"], ["resim", "dinle"], ["resim", "dinle", "tr"], ["resim", "dinle", "tr", "ulke", "sayi"], ["resim", "dinle", "tr", "ulke", "sayi"]][sv]);
        if (tip === "ulke") {
          const [u, m] = sec(veri.ULKE);
          const yanlis = secN(veri.ULKE.filter((x) => x[0] !== u), 3).map((x) => x[1]);
          return {
            anahtar: "u" + u,
            metin: `I'm from <b>${u}</b>. I'm <span class="kutu">?</span> .`,
            secenekler: [{ html: m, dogru: true }, ...yanlis.map((x) => ({ html: x, dogru: false }))],
            dogruSesli: `I'm from ${u}. I'm ${m}.`,
            dogruDil: "en-US",
            aciklama: `${u} → ${m}.`,
          };
        }
        if (tip === "sayi") {
          const n = aralik(11, 100);
          const yakin = [n + 1, n - 1, n + 10, n - 10, n % 10 && n < 100 ? ters(n) : n + 2].filter((x) => x >= 11 && x <= 100);
          return {
            anahtar: "n" + n,
            metin: `Which number is <b>“${ingSayi(n)}”</b>?`,
            tur: "rakam",
            secenekler: sayiSecenekleri(n, yakin),
            dogruSesli: ingSayi(n),
            dogruDil: "en-US",
            aciklama: `${ingSayi(n)} = ${n}.`,
          };
        }
        const d = sec(havuz);
        const ayniKat = havuz.filter((x) => x.k === d.k && x !== d);
        const yanlis = secN(ayniKat.length >= 3 ? ayniKat : havuz.filter((x) => x !== d), 3);
        if (tip === "dinle")
          return {
            anahtar: "d" + d.en,
            metin: "Dinle ve doğru resmi seç.",
            sesli: d.en,
            dil: "en-US",
            sesliHep: true,
            gorsel: `<p class="ipucu">${emo("🔊")} Tekrar dinlemek için sağ üstteki hoparlöre bas.</p>`,
            tur: "buyuk",
            secenekler: [d, ...yanlis].map((x) => ({ html: emo(x.e), dogru: x === d, etiket: x.tr })),
            dogruSesli: d.en,
            dogruDil: "en-US",
            aciklama: `${d.en} = ${d.tr}`,
          };
        if (tip === "tr")
          return {
            anahtar: "t" + d.en,
            metin: `<b>“${d.tr}”</b> İngilizcede nasıl söylenir?`,
            secenekler: [d, ...yanlis].map((x) => ({ html: x.en, dogru: x === d })),
            dogruSesli: d.en,
            dogruDil: "en-US",
            aciklama: `${d.tr} = ${d.en}`,
          };
        return {
          anahtar: "r" + d.en,
          metin: "What is this?",
          gorsel: emo(d.e, "dev"),
          secenekler: [d, ...yanlis].map((x) => ({ html: x.en, dogru: x === d })),
          dogruSesli: d.en,
          dogruDil: "en-US",
          aciklama: `${d.en} = ${d.tr}`,
        };
      },
    }),
  });

  // ---------------- Bilgi Yarışması ----------------
  OE.ekle({
    id: "bilgi",
    ad: "Bilgi Yarışması",
    simge: "🔬",
    cocuk: "ayaz",
    grup: "Fen ve Sosyal",
    aciklama: "Fen Bilimleri ve Sosyal Bilgiler soruları",
    baslat: soruOyunu({
      uret() {
        const q = sec(veri.BILGI);
        return {
          anahtar: q.s,
          metin: `<span class="ders-etiket">${q.k === "Fen" ? "Fen Bilimleri" : "Sosyal Bilgiler"}</span>${q.s}`,
          secenekler: [{ html: q.d, dogru: true }, ...q.y.map((x) => ({ html: x, dogru: false }))],
          aciklama: q.a,
        };
      },
    }),
  });
})();
