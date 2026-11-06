// Bebek Süsle (Ada): beş odalı (sahneli) bebek süsleme oyunu.
// Odalar: Gardırop → Saç salonu → Güzellik masası → Takı odası → Parti. Peri Pırıl yönlendirir, bebek Lila kız sesiyle konuşur.
// Çizimler bebek-cizim.js'te (OE.bebek). Okuma bilmeyen çocuk için her yönerge sesli okunur; konuşma balonu yetişkinler içindir.
(function () {
  "use strict";
  const { h, yard } = OE;
  const { rast, sec } = yard;
  const B = OE.bebek;
  const KAT = B.KAT;
  const DEPO = "cocuk-oyunlari:bebek";
  const SAYI = ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on"];

  // Konuşan karakterler: perde yüksek = çocuksu ses
  const KISI = {
    peri: { ad: "Pırıl", simge: "🧚‍♀️", perde: 1.5, hiz: 1.0 },
    bebek: { ad: "Lila", simge: "👧", perde: 1.3, hiz: 1.08 },
  };

  const ODALAR = [
    {
      id: "gardirop",
      ad: "Gardırop",
      simge: "👗",
      kat: ["elbise", "ayakkabi", "ten"],
      hedef: 2,
      giris: (ad) => `Merhaba ${ad}! Ben peri Pırıl. Bu da bebeğin Lila. Hadi onu güzelce hazırlayalım! Önce bir elbise seç.`,
      tekrar: "Gardıroptayız! İstediğin elbiseyi giydir.",
      dekor: [["👚", 6, 10, 2.4], ["🧥", 84, 14, 2.4], ["🎒", 88, 66, 2], ["👒", 4, 62, 2.2], ["✨", 22, 6, 1.4], ["✨", 70, 8, 1.2]],
    },
    {
      id: "sac",
      ad: "Saç salonu",
      simge: "💇‍♀️",
      kat: ["sac", "sacRenk", "toka"],
      hedef: 2,
      giris: () => "Saç salonuna geldik! Lila'nın saçını istediğin gibi yapalım. Önce bir saç modeli seç.",
      tekrar: "Saç salonundayız! Saçını değiştirebilirsin.",
      dekor: [["🪞", 6, 12, 2.6], ["✂️", 86, 14, 2], ["🧴", 88, 62, 2], ["💈", 5, 62, 2.2], ["✨", 24, 6, 1.4], ["🌟", 72, 8, 1.2]],
    },
    {
      id: "guzellik",
      ad: "Güzellik masası",
      simge: "💄",
      kat: ["ruj", "far", "allik", "oje", "sus"],
      hedef: 2,
      giris: () => "Güzellik masasına geldik! Ruj, far, allık ve oje sürelim. İstediğin renge dokun!",
      tekrar: "Güzellik masasındayız! Makyaj yapalım.",
      dekor: [["🪞", 6, 10, 2.6], ["💄", 86, 12, 2], ["💅", 88, 60, 2], ["🌸", 5, 60, 2.2], ["✨", 22, 6, 1.4], ["💖", 72, 8, 1.2]],
    },
    {
      id: "taki",
      ad: "Takı odası",
      simge: "👑",
      kat: ["tac", "gozluk", "kolye", "kupe", "el", "kanat"],
      hedef: 2,
      giris: () => "Takı odasına geldik! Taç, gözlük, kolye ve daha neler var! Dokunup dene.",
      tekrar: "Takı odasındayız! Süsleri dene.",
      dekor: [["💎", 6, 12, 2.2], ["💍", 86, 12, 2], ["📿", 88, 62, 2], ["⭐", 5, 62, 2], ["✨", 24, 6, 1.4], ["🌟", 72, 8, 1.2]],
    },
    {
      id: "parti",
      ad: "Parti",
      simge: "🎉",
      kat: [],
      hedef: 0,
      giris: () => "Şimdi parti zamanı! Lila çok güzel oldu. Bir eğlence seç!",
      tekrar: "Parti zamanı! Bir eğlence seç.",
      dekor: [["🎈", 5, 10, 2.4], ["🎈", 88, 14, 2.6], ["🪩", 46, 2, 2.2], ["🎊", 6, 64, 2], ["🎁", 88, 66, 2.2]],
    },
  ];

  // Lila'nın seçime tepkileri (a = seçeneğin adı)
  const TEPKI = {
    elbise: (a) => [`${a}! Bayıldım!`, `${a}! Bana çok yakıştı mı?`, `Vay! ${a}! Teşekkür ederim!`, `${a}! Hihi, dönmek istiyorum!`],
    ayakkabi: (a) => [`${a}! Tıp tıp tıp, yürüyebilirim!`, `${a}! Ayaklarım çok güzel oldu!`],
    ten: () => ["Ben böyle de çok güzelim!", "Yeni rengim çok güzel!"],
    sac: (a) => [`${a}! Saçım çok güzel oldu!`, `Hihi, ${a}! Çok şıkım!`, `${a}! Bayıldım!`],
    sacRenk: (a) => [`${a} saç! Çok havalı!`, `Vay, ${a} saç! Bayıldım!`],
    toka: (a) => [`${a}! Çok şirin!`, `${a}! Teşekkür ederim!`],
    ruj: (a) => [`${a} ruj! Mmuah!`, `${a} ruj! Dudaklarım çok güzel!`],
    far: (a) => [`${a} far! Gözlerim parlıyor!`, `${a} far! Çok güzel!`],
    allik: (a) => [`${a} allık! Yanaklarım pembe pembe!`, `${a} allık! Hihi, utandım!`],
    oje: (a) => [`${a} oje! Tırnaklarım çok güzel!`, `${a} oje! Parmaklarıma bak!`],
    sus: (a) => [`${a}! Yüzüm süslendi!`, `${a}! Çok tatlı oldu!`],
    tac: (a) => [`${a}! Ben şimdi prenses gibiyim!`, `${a}! Çok güzel!`],
    gozluk: (a) => [`${a}! Havalı mıyım?`, `${a}! Ben bir yıldız gibiyim!`],
    kolye: (a) => [`${a}! Çok parlıyor!`, `${a}! Boynum çok güzel!`],
    kupe: (a) => [`${a}! Kulaklarım çok şık!`, `${a}! Sallanıyor, hihi!`],
    el: (a) => [`${a}! Teşekkürler, çok güzel!`, `${a}! Bayıldım!`],
    kanat: (a) => [`${a}! Uçabilirim sanki!`, `${a}! Ben bir peri gibiyim!`],
  };
  const KALDIR = ["Tamam, çıkardım!", "Olur, almadım!"];
  // Pırıl'ın bir sonraki adım önerileri
  const ISTEK = {
    elbise: "Bir elbise seç!",
    ayakkabi: "Şimdi ayakkabı seçelim!",
    ten: "İstersen ten rengini değiştirebilirsin!",
    sac: "Bir saç modeli seç!",
    sacRenk: "Şimdi saç rengini seç!",
    toka: "Saça bir süs takalım mı?",
    ruj: "Dudaklara ruj sürelim!",
    far: "Gözlere far sürelim!",
    allik: "Yanaklara allık sürelim!",
    oje: "Tırnaklara oje sürelim!",
    sus: "Yüzü süsleyelim mi?",
    tac: "Bir taç ya da şapka takalım!",
    gozluk: "Havalı bir gözlük takalım mı?",
    kolye: "Boyuna bir kolye takalım!",
    kupe: "Kulaklara küpe takalım!",
    el: "Eline bir şey verelim!",
    kanat: "İstersen kanat da takabiliriz!",
  };
  const DOKUN = {
    kafa: ["Hihi, gıdıklanıyorum!", "Aaa, başıma dokundun!", "Saçımı bozma ama!"],
    govde: ["Kıyafetim çok güzel, değil mi?", "Hihi, dönüyorum!", "Bana sarıl!"],
    ayak: ["Tıp tıp tıp!", "Ayaklarım dans etmek istiyor!"],
    kanat: ["Kanatlarım uçmak istiyor!", "Çır çır çır!"],
    bos: ["Hadi oynayalım!", "Ben çok mutluyum!", "Seninle oynamak çok güzel!"],
  };

  const ETKINLIKLER = [
    { id: "dans", ad: "Dans", simge: "💃" },
    { id: "balon", ad: "Balonlar", simge: "🎈" },
    { id: "pasta", ad: "Pasta", simge: "🎂" },
    { id: "foto", ad: "Fotoğraf", simge: "📸" },
    { id: "defile", ad: "Defile", simge: "🌟" },
  ];

  OE.ekle({
    id: "bebek",
    ad: "Bebek Süsle",
    simge: "👸",
    cocuk: "ada",
    grup: "Eğlence",
    puanli: false,
    aciklama: "Giydir, süsle, parti yap",
    baslat(sahne, ctx) {
      // ---------- Kayıt ----------
      let kayit = {};
      try {
        kayit = JSON.parse(localStorage.getItem(DEPO)) || {};
      } catch {}
      const d = Object.assign({}, B.VARSAYILAN, kayit.d);
      for (const k in B.VARSAYILAN) if (!Number.isInteger(d[k]) || d[k] < 0 || d[k] >= KAT[k].liste.length) d[k] = B.VARSAYILAN[k];
      let acilan = Math.min(Math.max(+kayit.acilan || 0, 0), ODALAR.length - 1);
      const kaydet = () => {
        try {
          localStorage.setItem(DEPO, JSON.stringify({ d, acilan }));
        } catch {}
      };

      // ---------- Zamanlayıcılar ----------
      const zamanlar = new Set();
      const araliklar = new Set();
      const bekle = (f, ms) => {
        const t = setTimeout(() => {
          zamanlar.delete(t);
          f();
        }, ms);
        zamanlar.add(t);
        return t;
      };
      const iptal = (t) => {
        clearTimeout(t);
        zamanlar.delete(t);
      };

      // ---------- Arayüz ----------
      const bebekKap = h("div.bebek-kap");
      const balon = h("div.konusma-balon", { hidden: true, "aria-live": "polite" });
      const peri = h("button.peri", { type: "button", "aria-label": "Peri Pırıl'ı tekrar dinle", onclick: () => ipucuTekrar() }, h("span.emo", KISI.peri.simge));
      const dekor = h("div.dekor", { "aria-hidden": "true" });
      const ust = h("div.bebek-ust");
      const fotolar = h("div.fotolar", { "aria-hidden": "true" });
      const sahneKutu = h("div.bebek-sahne", dekor, bebekKap, ust, fotolar, peri, balon);
      const yol = h("div.bebek-yol");
      const panel = h("div.bebek-panel");
      sahne.replaceChildren(h("div.bebek", yol, h("div.bebek-ana", sahneKutu, panel)));

      // ---------- Konuşma ----------
      let agizZaman = null;
      let balonZaman = null;
      let sonIpucu = "";
      function soyle(kim, metin, { kayitla = false } = {}) {
        const k = KISI[kim];
        ctx.konus(metin, "tr-TR", { kaydet: kayitla, kadin: true, perde: k.perde, hiz: k.hiz });
        const ms = Math.min(9000, 800 + metin.length * 62);
        balon.replaceChildren(h("b", k.ad + " " + k.simge), h("span", metin));
        balon.dataset.kim = kim;
        balon.hidden = false;
        clearTimeout(balonZaman);
        balonZaman = bekle(() => (balon.hidden = true), ms + 2200);
        const aktif = kim === "bebek" ? bebekKap : peri;
        bebekKap.classList.remove("konusuyor");
        peri.classList.remove("konusuyor");
        aktif.classList.add("konusuyor");
        clearTimeout(agizZaman);
        agizZaman = bekle(() => aktif.classList.remove("konusuyor"), ms);
        return ms;
      }
      function ipucuSoyle(metin) {
        sonIpucu = metin;
        return soyle("peri", metin, { kayitla: true });
      }
      const ipucuTekrar = () => {
        peri.classList.remove("zipla");
        void peri.offsetWidth;
        peri.classList.add("zipla");
        soyle("peri", sonIpucu || ODALAR[oda].tekrar, { kayitla: true });
      };

      // ---------- Bebek ----------
      function ciz() {
        bebekKap.innerHTML = B.svg(d);
      }
      function zipla() {
        bebekKap.classList.remove("zipla");
        void bebekKap.offsetWidth;
        bebekKap.classList.add("zipla");
      }
      bebekKap.addEventListener("click", (e) => {
        if (etkinlik) return;
        const b = e.target.closest("[data-bolge]");
        zipla();
        ctx.ses.ton(880, 0.08);
        soyle("bebek", sec(DOKUN[b ? b.dataset.bolge : "bos"] || DOKUN.bos));
      });

      // ---------- Odalar ----------
      let oda = 0;
      let aktifKat = null;
      const dokunulan = ODALAR.map(() => new Set());
      const tamamlandi = ODALAR.map((_, i) => i < acilan); // daha önce geçilen odalar tamam sayılır
      const goruldu = new Set();
      let ipucuZaman = null;

      function yolCiz() {
        yol.replaceChildren(
          ...ODALAR.map((o, i) =>
            h(
              "button.oda-chip" + (i === oda ? ".secili" : "") + (i > acilan ? ".kilitli" : ""),
              { type: "button", "aria-label": o.ad + (i > acilan ? " (kilitli)" : ""), title: o.ad, onclick: () => odaGit(i) },
              h("span.emo", o.simge),
              i > acilan ? h("span.rozet-mini.emo", "🔒") : tamamlandi[i] ? h("span.rozet-mini.emo", "✅") : null
            )
          )
        );
      }
      function odaGit(i, { sessiz = false } = {}) {
        if (i > acilan) {
          ipucuSoyle("Önce bu odayı güzelce bitirelim, sonra yeni odaya geçeriz!");
          return;
        }
        etkinlikDurdur();
        iptal(ipucuZaman);
        const yeniOda = !goruldu.has(i);
        oda = i;
        const o = ODALAR[i];
        goruldu.add(i);
        sahneKutu.dataset.oda = o.id;
        dekor.replaceChildren(...o.dekor.map(([e, x, y, b]) => h("span.emo", { stil: `left:${x}%;top:${y}%;font-size:${b}rem` }, e)));
        aktifKat = o.kat[0] || null;
        yolCiz();
        panelCiz();
        if (!sessiz) ipucuSoyle(yeniOda ? o.giris(ctx.ad) : o.tekrar);
      }

      function panelCiz() {
        const o = ODALAR[oda];
        if (o.id === "parti") return partiPanel();
        const sekmeler = h(
          "div.sekmeler",
          o.kat.map((k) =>
            h(
              "button.sekme" + (k === aktifKat ? ".secili" : "") + (dokunulan[oda].has(k) ? ".dokunuldu" : ""),
              { type: "button", "data-kat": k, "aria-label": KAT[k].ad, title: KAT[k].ad, onclick: () => katSec(k) },
              h("span.emo", KAT[k].simge)
            )
          )
        );
        const hazir = tamamlandi[oda] || dokunulan[oda].size >= o.hedef;
        const ileri = h(
          "button.dugme.bebek-ileri" + (hazir ? ".hazir" : ""),
          { type: "button", onclick: ileriGit },
          oda === ODALAR.length - 2 ? "Partiye git 🎉" : "Sonraki oda ➜"
        );
        panel.replaceChildren(sekmeler, h("div.ogeler", ogeler()), h("div.bebek-alt", h("span.kat-adi", KAT[aktifKat].ad), ileri));
      }
      function ogeler() {
        const kat = KAT[aktifKat];
        return kat.liste.map((o, i) => {
          const secili = d[aktifKat] === i;
          return h("button.oge" + (secili ? ".secili" : "") + (kat.tur === "renk" ? ".renkli" : ""), {
            type: "button",
            "aria-label": o.ad,
            "aria-pressed": secili ? "true" : "false",
            title: o.ad,
            html: B.onizle(aktifKat, i, d),
            onclick: () => ogeSec(aktifKat, i),
          });
        });
      }
      function katSec(k) {
        aktifKat = k;
        ctx.ses.tik();
        panelCiz();
        ipucuSoyle(ISTEK[k]);
      }
      function ogeSec(k, i) {
        d[k] = i;
        kaydet();
        const o = KAT[k].liste[i];
        dokunulan[oda].add(k);
        ciz();
        zipla();
        ctx.ses.dogru();
        if (!o.yok && (k === "tac" || k === "kanat" || k === "el")) kucukParilti();
        iptal(ipucuZaman);
        const metin = o.yok ? sec(KALDIR) : sec(TEPKI[k](o.ad));
        const ms = soyle("bebek", metin);
        panelCiz();
        const od = ODALAR[oda];
        // sıradaki önerilmemiş kategori
        const siradaki = od.kat.find((x) => !dokunulan[oda].has(x));
        const hazir = tamamlandi[oda] || dokunulan[oda].size >= od.hedef;
        if (hazir && !tamamlandi[oda]) {
          tamamlandi[oda] = true;
          if (oda === acilan && acilan < ODALAR.length - 1) {
            acilan++;
            kaydet();
          }
          yolCiz();
          panelCiz();
          ipucuZaman = bekle(() => ipucuSoyle(oda === ODALAR.length - 2 ? "Çok güzel oldu! Hazırsan partiye gidelim!" : "Çok güzel oldu! Hazırsan yan odaya geçelim. Ya da biraz daha süsleyebilirsin!"), ms + 500);
        } else if (siradaki && !hazir) {
          ipucuZaman = bekle(() => {
            aktifKat = siradaki;
            panelCiz();
            ipucuSoyle(ISTEK[siradaki]);
          }, ms + 600);
        }
      }
      function ileriGit() {
        const od = ODALAR[oda];
        if (!tamamlandi[oda] && dokunulan[oda].size < od.hedef) {
          const e = panel.querySelector(".bebek-ileri");
          if (e) {
            e.classList.remove("salla");
            void e.offsetWidth;
            e.classList.add("salla");
          }
          ipucuSoyle("Önce birkaç şey seçelim, sonra devam ederiz!");
          return;
        }
        odaGit(oda + 1);
      }
      function kucukParilti() {
        for (let i = 0; i < 7; i++) {
          const p = h("span.parilti.emo", { stil: `left:${30 + rast(40)}%;top:${10 + rast(55)}%;animation-delay:${i * 0.07}s` }, sec(["✨", "⭐", "💖", "🌟"]));
          ust.append(p);
          bekle(() => p.remove(), 1400);
        }
      }

      // ---------- Parti ----------
      const yapilan = new Set();
      let etkinlik = null; // { id, temizle }
      let bitirGoster = false;
      function partiPanel() {
        const dugmeler = ETKINLIKLER.map((e) =>
          h(
            "button.etkinlik" + (etkinlik && etkinlik.id === e.id ? ".secili" : "") + (yapilan.has(e.id) ? ".yapildi" : ""),
            { type: "button", "aria-label": e.ad, title: e.ad, onclick: () => etkinlikBaslat(e.id) },
            h("span.emo", e.simge),
            h("span.etkinlik-ad", e.ad)
          )
        );
        const bitir = h("button.dugme.bebek-ileri.hazir", { type: "button", onclick: partiBitir }, "Partiyi bitir 🎁");
        panel.replaceChildren(h("div.etkinlikler", dugmeler), h("div.bebek-alt", h("span.kat-adi", yapilan.size + " / " + ETKINLIKLER.length + " eğlence"), bitirGoster ? bitir : null));
      }
      function etkinlikDurdur() {
        if (etkinlik) {
          try {
            etkinlik.temizle();
          } catch {}
          etkinlik = null;
        }
        bebekKap.classList.remove("dans", "defile");
        sahneKutu.classList.remove("disko");
        for (const e of [...ust.children]) e.remove();
        ctx.sustur();
      }
      function etkinlikBaslat(id) {
        const eski = etkinlik && etkinlik.id;
        etkinlikDurdur();
        if (eski === id) {
          panelCiz();
          return;
        }
        ctx.ses.tik();
        etkinlik = { id, temizle: () => {} };
        etkinlik.temizle = { dans, balon: balonlar, pasta, foto, defile }[id]() || (() => {});
        yapilan.add(id);
        if (yapilan.size >= 3 && !bitirGoster) {
          bitirGoster = true;
          bekle(() => ipucuSoyle("Parti çok güzel oldu! İstersen partiyi bitirebiliriz, ya da eğlenmeye devam edelim!"), 6500);
        }
        panelCiz();
      }
      function etkinlikBitti() {
        etkinlikDurdur();
        panelCiz();
      }
      function partiBitir() {
        kaydet();
        ctx.bitir({ yildiz: 3, metin: "Lila'nın partisi harikaydı!" });
      }

      // -- ses yardımcıları
      const nota = (f, s = 0.2, o = {}) => ctx.ses.ton(f, s, o);
      function melodi(notalar, birim, ses = 0.16) {
        let t = 0;
        for (const [f, u] of notalar) {
          if (f) nota(f, u * birim * 0.92, { gecikme: t, ses });
          t += u * birim;
        }
        return t;
      }
      function alkis() {
        for (let i = 0; i < 36; i++) nota(1800 + rast(2600), 0.03, { tip: "square", gecikme: rast(1600) / 1000, ses: 0.025 });
      }

      // -- Dans: müzik, ışıklar, bebek sallanır
      function dans() {
        bebekKap.classList.add("dans");
        sahneKutu.classList.add("disko");
        soyle("bebek", "Dans zamanı! Haydi dans edelim, lalala!");
        const mel = [523, 659, 784, 659, 523, 659, 784, 1047, 880, 784, 659, 784, 698, 659, 587, 523];
        const bas = [131, 196, 110, 175];
        let adim = 0;
        const iv = setInterval(() => {
          nota(mel[adim % 16], 0.2, { ses: 0.1 });
          if (adim % 4 === 0) nota(bas[(adim / 4) % 4], 0.38, { tip: "sine", ses: 0.16 });
          if (adim % 2 === 0) {
            const n = h("span.nota.emo", { stil: `left:${15 + rast(70)}%;` }, sec(["🎵", "🎶", "💖", "⭐", "✨"]));
            ust.append(n);
            bekle(() => n.remove(), 2200);
          }
          adim++;
        }, 230);
        araliklar.add(iv);
        bekle(etkinlikBitti, 15000);
        return () => {
          clearInterval(iv);
          araliklar.delete(iv);
        };
      }

      // -- Balonlar: patlat ve say
      function balonlar() {
        const renkler = ["#FF5C8A", "#FFB02E", "#6BCB77", "#4D96FF", "#B388FF", "#FF7F50"];
        const N = 10;
        let patlayan = 0;
        ipucuSoyle("Balonları patlat! Dokunarak sayalım.");
        for (let i = 0; i < N; i++) {
          const sutun = i % 5;
          const satir = Math.floor(i / 5);
          const x = 6 + sutun * 18 + rast(6);
          const y = 6 + satir * 26 + rast(10);
          const r = renkler[i % renkler.length];
          const b = h("button.balon", {
            type: "button",
            "aria-label": "Balon",
            stil: `left:${x}%;top:${y}%;--r:${r};animation-delay:-${(Math.random() * 3).toFixed(2)}s`,
            onclick: () => {
              b.remove();
              patlayan++;
              nota(520, 0.05, { tip: "square", ses: 0.12 });
              nota(260, 0.09, { tip: "sawtooth", gecikme: 0.02, ses: 0.1 });
              for (let j = 0; j < 8; j++) {
                const a = (j * Math.PI) / 4;
                const p = h("i.parca", { stil: `left:${x + 7}%;top:${y + 8}%;background:${r};--dx:${Math.round(Math.cos(a) * 48)}px;--dy:${Math.round(Math.sin(a) * 48)}px` });
                ust.append(p);
                bekle(() => p.remove(), 750);
              }
              if (patlayan < N) soyle("bebek", SAYI[patlayan] + "!");
              else {
                soyle("bebek", "Hepsini patlattın! On balon! Yaşasın!");
                OE.konfeti();
                bekle(etkinlikBitti, 4500);
              }
            },
          });
          ust.append(b);
        }
        return null;
      }

      // -- Pasta: mumları üfle, mutlu yıllar
      function pasta() {
        const mumX = [84, 102, 120, 138, 156];
        const mumlar = mumX
          .map(
            (x, i) =>
              `<g class="mum" data-i="${i}"><rect x="${x - 11}" y="14" width="22" height="64" fill="transparent"/><rect x="${x - 4}" y="44" width="8" height="30" rx="2" fill="${["#FF8FB8", "#7CC4FF", "#FFD43B", "#69DB7C", "#B58CFF"][i]}"/><path d="M${x - 4} 52L${x + 4} 58M${x - 4} 62L${x + 4} 68" stroke="#fff" stroke-width="2" opacity=".7"/><g class="alev-kap"><ellipse class="alev" cx="${x}" cy="36" rx="5" ry="9" fill="#FFB02E"/><ellipse class="alev" cx="${x}" cy="39" rx="2.6" ry="5" fill="#FFF1A8"/></g></g>`
          )
          .join("");
        const svg = h("div.pasta", {
          html: `<svg viewBox="0 0 240 190" aria-label="Doğum günü pastası">
            <ellipse cx="120" cy="174" rx="108" ry="13" fill="#fff" stroke="#E3D3E8" stroke-width="3"/>
            <rect x="34" y="112" width="172" height="60" rx="14" fill="#FFB3CF"/>
            <path d="M34 124Q46 142 58 124Q70 146 84 124Q98 144 112 124Q126 146 140 124Q154 144 168 124Q180 144 190 124Q198 134 206 124L206 112L34 112Z" fill="#FFF1F7"/>
            <rect x="62" y="70" width="116" height="46" rx="12" fill="#FFE1EE"/>
            <path d="M62 82Q72 98 84 82Q96 100 108 82Q120 100 132 82Q144 100 156 82Q166 98 178 82L178 70L62 70Z" fill="#fff"/>
            <circle cx="50" cy="150" r="6" fill="#E0334C"/><circle cx="76" cy="156" r="5" fill="#FFD43B"/><circle cx="120" cy="152" r="6" fill="#E0334C"/><circle cx="164" cy="156" r="5" fill="#FFD43B"/><circle cx="190" cy="150" r="6" fill="#E0334C"/>
            <circle cx="98" cy="104" r="4" fill="#FF5FA2"/><circle cx="142" cy="104" r="4" fill="#FF5FA2"/>
            ${mumlar}</svg>`,
        });
        const masa = h("div.masa", h("div.masa-ust"));
        ust.append(masa, svg);
        ipucuSoyle("Doğum günü pastası! Mumlara dokun, üfleyelim!");
        let sonen = 0;
        function sondur(m) {
          if (m.classList.contains("sondu")) return;
          m.classList.add("sondu");
          sonen++;
          nota(520, 0.12, { tip: "sine", ses: 0.12 });
          nota(380, 0.16, { tip: "sine", gecikme: 0.05, ses: 0.1 });
          const duman = h("span.duman.emo", { stil: `left:${14 + Number(m.dataset.i) * 11 + 11}%` }, "💨");
          svg.append(duman);
          bekle(() => duman.remove(), 1200);
          if (sonen === mumX.length) {
            soyle("bebek", "Mutlu yıllar! Dilek tuttum! Yaşasın!");
            OE.konfeti();
            const G4 = 392, A4 = 440, B4 = 494, C5 = 523, D5 = 587, E5 = 659, F5 = 698, G5 = 784;
            bekle(() => melodi([[G4, 0.75], [G4, 0.25], [A4, 1], [G4, 1], [C5, 1], [B4, 2], [G4, 0.75], [G4, 0.25], [A4, 1], [G4, 1], [D5, 1], [C5, 2], [G4, 0.75], [G4, 0.25], [G5, 1], [E5, 1], [C5, 1], [B4, 1], [A4, 2], [F5, 0.75], [F5, 0.25], [E5, 1], [C5, 1], [D5, 1], [C5, 2]], 0.24), 900);
            bekle(etkinlikBitti, 12500);
          } else soyle("bebek", SAYI[sonen] + "!");
        }
        svg.addEventListener("click", (e) => {
          const m = e.target.closest(".mum");
          if (m) sondur(m);
        });
        return null;
      }

      // -- Fotoğraf: geri sayım, flaş, anı fotoğrafı
      function foto() {
        ipucuSoyle("Fotoğraf çekelim! Gülümse! Üç, iki, bir!");
        const sayi = h("div.geri-sayim", { hidden: true });
        ust.append(h("div.cerceve"), sayi);
        [3, 2, 1].forEach((n, i) =>
          bekle(() => {
            sayi.hidden = false;
            sayi.textContent = n;
            sayi.classList.remove("vur");
            void sayi.offsetWidth;
            sayi.classList.add("vur");
            nota(660, 0.08, { ses: 0.12 });
          }, 1100 + i * 1000)
        );
        bekle(() => {
          sayi.hidden = true;
          ust.append(h("div.flas"));
          nota(1800, 0.03, { tip: "square", ses: 0.12 });
          nota(900, 0.06, { tip: "square", gecikme: 0.05, ses: 0.1 });
          soyle("bebek", "Peynir! Çok güzel çıktım!");
          const pol = h("div.polaroid", { stil: `--don:${rast(14) - 7}deg` }, h("div.polaroid-resim", { html: B.svg(d) }), h("span.emo", sec(["💖", "⭐", "🌸", "🦄"])));
          fotolar.append(pol);
          while (fotolar.children.length > 3) fotolar.firstChild.remove();
        }, 4300);
        bekle(etkinlikBitti, 6800);
        return null;
      }

      // -- Defile: podyumda yürü
      function defile() {
        bebekKap.classList.add("defile");
        ipucuSoyle("Defile başlıyor! Lila podyumda yürüyor!");
        bekle(() => soyle("bebek", "Bana bakın! Ne kadar güzelim!"), 2600);
        alkis();
        for (let i = 0; i < 9; i++) {
          bekle(() => {
            const p = h("span.parilti.emo", { stil: `left:${5 + rast(90)}%;top:${10 + rast(60)}%` }, sec(["✨", "⭐", "💖", "🌟"]));
            ust.append(p);
            bekle(() => p.remove(), 1300);
          }, i * 700);
        }
        bekle(() => OE.konfeti(), 6600);
        bekle(etkinlikBitti, 7600);
        return null;
      }

      // ---------- Başlat ----------
      ciz();
      odaGit(0);
      return () => {
        for (const t of zamanlar) clearTimeout(t);
        zamanlar.clear();
        for (const i of araliklar) clearInterval(i);
        araliklar.clear();
        if (etkinlik) {
          try {
            etkinlik.temizle();
          } catch {}
          etkinlik = null;
        }
        kaydet();
      };
    },
  });
})();
