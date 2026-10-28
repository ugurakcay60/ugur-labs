// Oyun Evi çekirdeği: yardımcılar, kayıt, ses efektleri, sesli okuma, ekranlar ve oyun kaydı.
// Oyunlar OE.ekle({...}) ile kaydolur. Ekran adresi location.hash'tedir: #ada, #ayaz-carpim, #ada-album, #veli.
(function () {
  "use strict";
  const OE = (window.OE = {});

  // ---------- Küçük yardımcılar ----------
  const rast = (n) => Math.floor(Math.random() * n);
  const aralik = (a, b) => a + rast(b - a + 1);
  const sec = (d) => d[rast(d.length)];
  function karistir(d) {
    const k = d.slice();
    for (let i = k.length - 1; i > 0; i--) {
      const j = rast(i + 1);
      [k[i], k[j]] = [k[j], k[i]];
    }
    return k;
  }
  const secN = (d, n) => karistir(d).slice(0, n);
  const sayiBicim = new Intl.NumberFormat("tr-TR");
  const bicim = (n) => sayiBicim.format(n);
  const sureBicim = (ms) => {
    const s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  const azHareket = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const SAYI_AD = ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on"];

  // h("button.karo.buyuk", { onclick, html, ... }, ...cocuklar) — küçük DOM kurucu
  function h(etiket, ozellik, ...cocuklar) {
    const [ad, ...siniflar] = etiket.split(".");
    const e = document.createElement(ad || "div");
    if (siniflar.length) e.className = siniflar.join(" ");
    if (ozellik != null && (typeof ozellik !== "object" || ozellik instanceof Node || Array.isArray(ozellik))) {
      cocuklar.unshift(ozellik);
      ozellik = null;
    }
    for (const [k, v] of Object.entries(ozellik || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else if (k === "html") e.innerHTML = v;
      else if (k === "stil") e.style.cssText = v;
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const c of cocuklar.flat(Infinity)) {
      if (c == null || c === false) continue;
      e.append(c instanceof Node ? c : String(c));
    }
    return e;
  }

  // ---------- Kalıcı kayıt (localStorage, try/catch'li) ----------
  const ONEK = "cocuk-oyunlari:";
  const depo = {
    oku(k, v) {
      try {
        const s = localStorage.getItem(ONEK + k);
        return s == null ? v : JSON.parse(s);
      } catch {
        return v;
      }
    },
    yaz(k, d) {
      try {
        localStorage.setItem(ONEK + k, JSON.stringify(d));
      } catch {}
    },
  };

  const COCUKLAR = {
    ada: {
      id: "ada",
      ad: "Ada",
      simge: "🦄",
      alt: "4,5 yaş · okul öncesi",
      gruplar: ["Öğrenelim", "Zekâ oyunları", "Eğlence"],
      cikartmalar: "🦄 🐱 🐰 🦋 🌈 🌸 🍓 🧁 🎀 👑 🐼 🐨 🦊 🐯 🐸 🐢 🐬 🐳 🦜 🦩 🌻 🍉 🍭 🎠 🐞 🦔 🐧 🐣 🍩 🏰".split(" "),
    },
    ayaz: {
      id: "ayaz",
      ad: "Ayaz",
      simge: "🚀",
      alt: "9 yaş · 4. sınıf",
      gruplar: ["Matematik", "Türkçe ve İngilizce", "Fen ve Sosyal", "Zekâ oyunları"],
      cikartmalar: "🚀 🛸 🌍 🦖 🦕 🐉 ⚽ 🏀 🏆 🥇 🤖 👾 🧩 🔭 🔬 🧲 ⚡ 🌋 🦈 🐙 🏎️ 🚁 🚂 ⛵ 🛰️ 🧠 💎 🦅 🐺 👑".split(" "),
    },
  };
  const GUNLUK_HEDEF = 3; // günün görevi: bu kadar oyun bitir
  const YILDIZ_BASINA = 10; // her 10 yıldızda bir çıkartma

  const bosCocuk = () => ({ yildiz: 0, gun: { t: "", s: 0 }, oyunlar: {} });
  let veri = depo.oku("veri", null);
  if (!veri || typeof veri !== "object") veri = {};
  veri.ayarlar = Object.assign({ efekt: true, konusma: true }, veri.ayarlar);
  for (const id in COCUKLAR) veri[id] = Object.assign(bosCocuk(), veri[id]);
  const kaydet = () => depo.yaz("veri", veri);
  function oyunKaydi(cocuk, id) {
    const o = veri[cocuk].oyunlar;
    return (o[id] = Object.assign({ seviye: 1, oynama: 0, dogru: 0, toplam: 0, enIyi: 0 }, o[id]));
  }
  const bugun = () => {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  };

  // ---------- Ses efektleri (Web Audio, dosya yok) ----------
  let ac = null;
  function baglam() {
    if (!ac) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ac = new C();
    }
    if (ac.state === "suspended") ac.resume();
    return ac;
  }
  function ton(frek, sure = 0.15, { tip = "triangle", gecikme = 0, ses = 0.18 } = {}) {
    if (!veri.ayarlar.efekt) return;
    const c = baglam();
    if (!c) return;
    const t = c.currentTime + gecikme;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = tip;
    o.frequency.setValueAtTime(frek, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(ses, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + sure + 0.03);
  }
  const ses = {
    ton,
    dogru() {
      ton(784, 0.12);
      ton(1047, 0.2, { gecikme: 0.09 });
    },
    yanlis() {
      ton(220, 0.22, { tip: "sine", ses: 0.22 });
      ton(175, 0.3, { tip: "sine", gecikme: 0.12, ses: 0.2 });
    },
    tik() {
      ton(1300, 0.04, { tip: "square", ses: 0.04 });
    },
    kutlama() {
      [523, 659, 784, 1047, 1319].forEach((f, i) => ton(f, 0.24, { gecikme: i * 0.09 }));
    },
  };

  // ---------- Sesli okuma (Web Speech) ----------
  const konusmaVar = "speechSynthesis" in window;
  let sesListesi = [];
  const sesleriAl = () => {
    if (konusmaVar) sesListesi = speechSynthesis.getVoices() || [];
  };
  if (konusmaVar) {
    sesleriAl();
    speechSynthesis.onvoiceschanged = sesleriAl;
  }
  function sesBul(dil) {
    const kok = dil.slice(0, 2).toLowerCase();
    const uygun = sesListesi.filter((v) => (v.lang || "").toLowerCase().replace("_", "-").startsWith(kok));
    // Doğal (Natural/Online/Google) sesler çocuklar için daha anlaşılır
    return uygun.find((v) => /natural|online|google/i.test(v.name)) || uygun[0] || null;
  }
  const turkceSesDurumu = () => (!konusmaVar ? "yok" : !sesListesi.length ? "bilinmiyor" : sesBul("tr-TR") ? "var" : "yok");
  let sonSoz = null;
  let konusZaman = null;
  // kaydet: 🔊 düğmesi bunu tekrar okusun mu; sessiz: yalnızca kaydet, okuma
  function konus(metin, dil = "tr-TR", { kaydet: kayit = true, sessiz = false } = {}) {
    if (!metin) return;
    if (kayit) sonSoz = { metin, dil };
    if (sessiz || !veri.ayarlar.konusma || !konusmaVar) return;
    const v = sesBul(dil);
    if (!v && sesListesi.length) return; // bu dilde ses yoksa yanlış aksanla okumayalım
    speechSynthesis.cancel();
    clearTimeout(konusZaman);
    konusZaman = setTimeout(() => {
      const u = new SpeechSynthesisUtterance(metin);
      u.lang = dil;
      if (v) u.voice = v;
      u.rate = dil.startsWith("tr") ? 0.95 : 0.85;
      u.pitch = 1.05;
      speechSynthesis.speak(u);
    }, 50);
  }
  function sustur() {
    clearTimeout(konusZaman);
    if (konusmaVar) speechSynthesis.cancel();
  }
  // iOS ilk konuşmanın bir dokunuşun içinde başlamasını ister
  function sesKilidiAc() {
    baglam();
    if (konusmaVar && veri.ayarlar.konusma) {
      try {
        speechSynthesis.speak(new SpeechSynthesisUtterance(""));
      } catch {}
    }
  }

  // ---------- Bildirim ve konfeti ----------
  let bildirimZaman;
  function bildir(metin) {
    const b = document.getElementById("bildirim");
    b.textContent = metin;
    b.classList.add("goster");
    clearTimeout(bildirimZaman);
    bildirimZaman = setTimeout(() => b.classList.remove("goster"), 1800);
  }
  function konfeti() {
    if (azHareket()) return;
    const kutu = document.getElementById("konfeti");
    const renk = ["var(--ada)", "var(--ayaz)", "var(--gunes)", "var(--dogru)"];
    for (let i = 0; i < 44; i++) {
      kutu.append(
        h("i", {
          stil:
            `left:${rast(100)}%;background:${sec(renk)};animation-delay:${(Math.random() * 0.5).toFixed(2)}s;` +
            `animation-duration:${(1.8 + Math.random() * 1.2).toFixed(2)}s;--don:${aralik(-540, 540)}deg;--kay:${aralik(-80, 80)}px`,
        })
      );
    }
    setTimeout(() => kutu.replaceChildren(), 3600);
  }

  // ---------- Oyun kaydı ----------
  OE.oyunlar = [];
  OE.ekle = (oyun) => {
    oyun.cocuk = [].concat(oyun.cocuk);
    OE.oyunlar.push(oyun);
  };
  const grupAdi = (o, c) => (typeof o.grup === "string" ? o.grup : o.grup[c]);
  const yildizlar = (n) => h("span.yildizlar", h("b", "★".repeat(n)), "☆".repeat(3 - n));

  // ---------- Ekranlar ----------
  const uyg = () => document.getElementById("uygulama");
  let temizle = null;
  function ekraniTemizle() {
    if (temizle) {
      try {
        temizle();
      } catch {}
      temizle = null;
    }
    sustur();
  }
  function git(yol) {
    if (location.hash.slice(1) === yol) ciz();
    else location.hash = yol;
  }
  function ciz() {
    ekraniTemizle();
    const yol = decodeURIComponent(location.hash.slice(1));
    const [cocuk, alt] = yol.split("-");
    document.body.dataset.cocuk = COCUKLAR[cocuk] ? cocuk : "";
    window.scrollTo(0, 0);
    if (yol === "veli") return veliEkrani();
    if (!COCUKLAR[cocuk]) return anaEkran();
    if (alt === "album") return albumEkrani(cocuk);
    const oyun = alt && OE.oyunlar.find((o) => o.id === alt && o.cocuk.includes(cocuk));
    if (oyun) return oyunEkrani(cocuk, oyun);
    cocukEkrani(cocuk);
  }
  const geriDugmesi = (yol, etiket) => h("button.geri", { type: "button", "aria-label": etiket, onclick: () => git(yol) }, "←");

  function anaEkran() {
    const kart = (c) =>
      h(
        "button.profil.karo",
        { type: "button", "data-renk": c.id, onclick: () => (sesKilidiAc(), git(c.id)) },
        h("span.profil-simge.emo", c.simge),
        h("span.profil-ad", c.ad),
        h("span.profil-alt", c.alt),
        h("span.rozet", h("span.emo", "⭐"), " " + bicim(veri[c.id].yildiz) + " yıldız")
      );
    uyg().replaceChildren(
      h(
        "header.ana-baslik",
        h("p.ust-yazi", "Ada ile Ayaz'ın"),
        h("h1", h("span.ada-renk", "Oyun"), " ", h("span.ayaz-renk", "Evi")),
        h("p.ana-soru", "Kim oynayacak?")
      ),
      h("div.profiller", Object.values(COCUKLAR).map(kart)),
      h("footer.ana-alt", h("button.metin-dugme", { type: "button", onclick: () => git("veli") }, "Veli paneli ve ayarlar"))
    );
  }

  function cocukEkrani(cid) {
    const c = COCUKLAR[cid];
    const v = veri[cid];
    const gun = v.gun.t === bugun() ? v.gun.s : 0;
    const tamam = gun >= GUNLUK_HEDEF;
    const kalan = YILDIZ_BASINA - (v.yildiz % YILDIZ_BASINA);
    const ust = h(
      "header.ust",
      geriDugmesi("", "Ana sayfaya dön"),
      h("div.ust-kim", h("span.ust-simge.emo", c.simge), h("div", h("h1", "Merhaba " + c.ad + "!"), h("p", c.alt))),
      h(
        "button.yildiz-rozet",
        { type: "button", onclick: () => git(cid + "-album"), "aria-label": "Çıkartma albümünü aç" },
        h("span.emo", "⭐"),
        h("strong", bicim(v.yildiz)),
        h("span.rozet-alt", "Albüm")
      )
    );
    const gorev = h(
      "section.gorev",
      h(
        "div.gorev-yazi",
        h("strong", tamam ? "Günün görevi tamam!" : "Günün görevi"),
        h("span", tamam ? `Bugün ${gun} oyun bitirdin.` : `${GUNLUK_HEDEF} oyun bitir, 3 yıldız kazan.`)
      ),
      h("div.gorev-noktalar", { "aria-label": `${Math.min(gun, GUNLUK_HEDEF)} / ${GUNLUK_HEDEF}` },
        Array.from({ length: GUNLUK_HEDEF }, (_, i) => h("span" + (i < gun ? ".dolu" : "")))),
      h("div.gorev-yazi.sag", h("strong", kalan + " yıldız"), h("span", "sonra yeni çıkartma"))
    );
    const uyari =
      cid === "ada" && turkceSesDurumu() === "yok" && veri.ayarlar.konusma
        ? h("p.uyari", "Bu tarayıcıda Türkçe ses bulunamadı, yönergeler sesli okunamıyor. Edge, iPad Safari veya Android Chrome'da açın.")
        : null;
    const bolumler = c.gruplar.map((g) => {
      const liste = OE.oyunlar.filter((o) => o.cocuk.includes(cid) && grupAdi(o, cid) === g);
      return liste.length ? h("section.bolum", h("h2", g), h("div.oyun-izgara", liste.map((o) => oyunKarosu(cid, o)))) : null;
    });
    uyg().replaceChildren(...[ust, uyari, gorev, ...bolumler].filter(Boolean));
    if (cid === "ada") konus("Merhaba Ada! Hangi oyunu oynamak istersin?", "tr-TR", { kaydet: false });
  }

  function oyunKarosu(cid, o) {
    const k = veri[cid].oyunlar[o.id];
    return h(
      "button.oyun-karo.karo",
      { type: "button", onclick: () => git(cid + "-" + o.id) },
      h("span.oyun-simge.emo", o.simge),
      h("span.oyun-ad", o.ad),
      h("span.oyun-aciklama", o.aciklama),
      o.puanli === false
        ? h("span.oyun-durum", "Serbest oyun")
        : h("span.oyun-durum", yildizlar(k ? k.enIyi : 0), h("span", k && k.oynama ? "Seviye " + k.seviye : "Yeni"))
    );
  }

  function oyunEkrani(cid, oyun) {
    const kayit = oyunKaydi(cid, oyun.id);
    const sahne = h("main.sahne");
    const seviye =
      oyun.puanli === false
        ? null
        : h(
            "button.seviye-chip",
            {
              type: "button",
              title: "Seviyeyi değiştir (1–5)",
              onclick: () => {
                kayit.seviye = (kayit.seviye % 5) + 1;
                kaydet();
                ciz();
              },
            },
            "Seviye " + kayit.seviye
          );
    uyg().replaceChildren(
      h(
        "header.oyun-ust",
        geriDugmesi(cid, "Oyunlara dön"),
        h("div.oyun-baslik", h("span.emo", oyun.simge), h("h1", oyun.ad)),
        seviye,
        h(
          "button.ses-dugme",
          { type: "button", "aria-label": "Yönergeyi tekrar dinle", title: "Tekrar dinle", onclick: () => sonSoz && konus(sonSoz.metin, sonSoz.dil) },
          h("span.emo", "🔊")
        )
      ),
      sahne
    );
    sonSoz = null;
    const ctx = {
      cocuk: cid,
      ada: cid === "ada",
      ad: COCUKLAR[cid].ad,
      seviye: kayit.seviye,
      konus,
      sustur,
      ses,
      bildir,
      bitir: (sonuc) => sonucEkrani(cid, oyun, sahne, sonuc),
      yeniden: () => ciz(),
    };
    temizle = oyun.baslat(sahne, ctx) || null;
  }

  const SEVIYE_E = { 2: "2'ye", 3: "3'e", 4: "4'e", 5: "5'e" };
  // sonuc: { dogru, toplam } ya da { yildiz }, isteğe bağlı { metin, sure, skor }
  function sonucEkrani(cid, oyun, sahne, sonuc) {
    if (temizle) {
      try {
        temizle();
      } catch {}
      temizle = null;
    }
    const c = veri[cid];
    const k = oyunKaydi(cid, oyun.id);
    const oran = sonuc.toplam ? sonuc.dogru / sonuc.toplam : 1;
    const y = sonuc.yildiz || (oran >= 0.9 ? 3 : oran >= 0.6 ? 2 : 1);
    k.oynama++;
    k.dogru += sonuc.dogru || 0;
    k.toplam += sonuc.toplam || 0;
    k.enIyi = Math.max(k.enIyi, y);
    if (sonuc.skor != null) k.enIyiSkor = Math.max(k.enIyiSkor || 0, sonuc.skor);
    const eskiSeviye = k.seviye;
    if (y === 3 && k.seviye < 5) k.seviye++;
    else if (y === 1 && k.seviye > 1) k.seviye--;
    const eskiYildiz = c.yildiz;
    c.yildiz += y;
    if (c.gun.t !== bugun()) c.gun = { t: bugun(), s: 0 };
    c.gun.s++;
    const gorevBitti = c.gun.s === GUNLUK_HEDEF;
    if (gorevBitti) c.yildiz += 3;
    const cik = COCUKLAR[cid].cikartmalar;
    const yeni = [];
    for (let i = Math.floor(eskiYildiz / YILDIZ_BASINA); i < Math.floor(c.yildiz / YILDIZ_BASINA) && i < cik.length; i++) yeni.push(cik[i]);
    kaydet();

    const ad = COCUKLAR[cid].ad;
    const baslik = y === 3 ? `Muhteşem, ${ad}!` : y === 2 ? `Çok iyi, ${ad}!` : `Güzel deneme, ${ad}!`;
    const detay = [];
    if (sonuc.metin) detay.push(sonuc.metin);
    else if (sonuc.toplam) detay.push(`${sonuc.toplam} sorudan ${sonuc.dogru} doğru`);
    if (sonuc.sure) detay.push("süre " + sureBicim(sonuc.sure));
    const haber = [];
    if (k.seviye > eskiSeviye) haber.push(`Seviye ${SEVIYE_E[k.seviye]} çıktın!`);
    if (k.seviye < eskiSeviye) haber.push(`Seviye ${k.seviye} ile biraz daha alıştırma yapalım.`);
    if (gorevBitti) haber.push("Günün görevi tamam: +3 yıldız!");
    sahne.replaceChildren(
      h(
        "div.sonuc",
        h("div.sonuc-yildizlar", [1, 2, 3].map((i) => h("span" + (i <= y ? ".kazandi" : ""), { stil: `animation-delay:${i * 0.18}s` }, "★"))),
        h("h2", baslik),
        h("p.sonuc-detay", detay.join(" · ")),
        haber.map((t) => h("p.sonuc-haber", t)),
        yeni.length ? h("div.yeni-cikartma", h("span", "Yeni çıkartma kazandın!"), h("span.emo", yeni.join(" "))) : null,
        h(
          "div.sonuc-dugmeler",
          h("button.dugme", { type: "button", onclick: () => ciz() }, "Tekrar oyna"),
          h("button.dugme.ikincil", { type: "button", onclick: () => git(cid) }, "Başka oyun")
        )
      )
    );
    ses.kutlama();
    if (y >= 2 || yeni.length) konfeti();
    if (cid === "ada")
      konus(`${baslik} ${SAYI_AD[y]} yıldız kazandın!` + (yeni.length ? " Albümüne yeni bir çıkartma geldi!" : ""), "tr-TR", { kaydet: false });
  }

  function albumEkrani(cid) {
    const c = COCUKLAR[cid];
    const v = veri[cid];
    const acik = Math.min(Math.floor(v.yildiz / YILDIZ_BASINA), c.cikartmalar.length);
    uyg().replaceChildren(
      h(
        "header.ust",
        geriDugmesi(cid, "Oyunlara dön"),
        h(
          "div.ust-kim",
          h("span.ust-simge.emo", "📒"),
          h("div", h("h1", "Çıkartma albümü"), h("p", `${acik} / ${c.cikartmalar.length} çıkartma · her ${YILDIZ_BASINA} yıldızda bir yenisi`))
        ),
        h("span.yildiz-rozet", h("span.emo", "⭐"), h("strong", bicim(v.yildiz)))
      ),
      h(
        "div.album",
        c.cikartmalar.map((e, i) =>
          i < acik
            ? h(
                "button.cikartma.emo",
                {
                  type: "button",
                  "aria-label": "Çıkartma " + (i + 1),
                  onclick: (ev) => {
                    const b = ev.currentTarget;
                    b.classList.remove("zipla");
                    void b.offsetWidth;
                    b.classList.add("zipla");
                    ton(520 + i * 25, 0.18);
                  },
                },
                e
              )
            : h("span.cikartma.kilitli", { title: "Kilitli" }, h("small", (i + 1) * YILDIZ_BASINA + " ★"))
        )
      )
    );
  }

  function veliEkrani() {
    const durum = turkceSesDurumu();
    const tr = sesBul("tr-TR");
    const sesYazi = {
      var: "Türkçe ses hazır" + (tr ? ": " + tr.name : "") + ".",
      yok: "Bu tarayıcıda Türkçe ses yok. Ada'nın oyunlarında yönergeler sesli okunur; Microsoft Edge, iPad/iPhone Safari veya Android Chrome kullanın.",
      bilinmiyor: "Ses listesi henüz yüklenmedi. “Sesi dene”ye basın.",
    }[durum];
    const anahtar = (id, etiket, alan) => {
      const g = h("input", { type: "checkbox", id });
      g.checked = veri.ayarlar[alan];
      g.addEventListener("change", () => {
        veri.ayarlar[alan] = g.checked;
        kaydet();
      });
      return h("label.anahtar", { for: id }, g, h("span.anahtar-iz"), h("span", etiket));
    };
    const tablo = (cid) => {
      const liste = OE.oyunlar.filter((o) => o.cocuk.includes(cid) && o.puanli !== false);
      return h(
        "section.veli-kart",
        h("h2", `${COCUKLAR[cid].ad} · ${bicim(veri[cid].yildiz)} yıldız`),
        h(
          "div.tablo-kap",
          h(
            "table.veli-tablo",
            h("thead", h("tr", ["Oyun", "Oynama", "Seviye", "Doğruluk", "En iyi"].map((t) => h("th", t)))),
            h(
              "tbody",
              liste.map((o) => {
                const k = veri[cid].oyunlar[o.id];
                const oynadi = k && k.oynama;
                return h(
                  "tr",
                  h("td", h("span.emo", o.simge), " " + o.ad),
                  h("td", oynadi ? k.oynama : "—"),
                  h("td", oynadi ? k.seviye : "—"),
                  h("td", oynadi && k.toplam ? "%" + Math.round((100 * k.dogru) / k.toplam) : "—"),
                  h("td", oynadi ? "★".repeat(k.enIyi) : "—")
                );
              })
            )
          )
        ),
        sifirlaDugmesi(cid)
      );
    };
    const durumP = h("p.ses-durum" + (durum === "yok" ? ".kotu" : ""), sesYazi);
    uyg().replaceChildren(
      h("header.ust", geriDugmesi("", "Ana sayfaya dön"), h("div.ust-kim", h("span.ust-simge.emo", "🔑"), h("div", h("h1", "Veli paneli"), h("p", "İlerleme, ayarlar ve öneriler")))),
      h(
        "section.veli-kart",
        h("h2", "Ayarlar"),
        h("div.ayarlar", anahtar("ayar-efekt", "Ses efektleri", "efekt"), anahtar("ayar-konusma", "Sesli yönergeler", "konusma")),
        durumP,
        h(
          "button.dugme.ikincil.kucuk",
          {
            type: "button",
            onclick: () => {
              sesKilidiAc();
              konus("Merhaba Ada! Merhaba Ayaz! Hadi oynayalım.", "tr-TR", { kaydet: false });
              setTimeout(() => {
                const t = sesBul("tr-TR");
                durumP.textContent = t ? "Türkçe ses hazır: " + t.name + "." : sesYazi;
              }, 400);
            },
          },
          "Sesi dene"
        )
      ),
      h(
        "section.veli-kart",
        h("h2", "Nasıl çalışır?"),
        h(
          "ul.oneriler",
          h("li", "Seviyeler kendiliğinden ayarlanır: 3 yıldızda bir üst seviyeye geçilir, 1 yıldızda bir alta inilir. Oyundaki “Seviye” düğmesiyle elle de değiştirebilirsiniz."),
          h("li", "Her bitirilen oyun 1–3 yıldız verir; günde 3 oyun bitirmek +3 yıldız kazandırır, her 10 yıldız albüme bir çıkartma ekler."),
          h("li", "Günde 20–30 dakika yeterli. Kısa ve sık oturumlar uzun oturumlardan daha verimlidir."),
          h("li", "Ada'nın yanında oturup sorulara birlikte cevap verin; harfleri ve sayıları sesli söylemek öğrenmeyi pekiştirir."),
          h("li", "Ayaz'ın doğruluğu düşük kalan oyunlar, okulda desteklenmesi gereken konuları gösterir."),
          h("li", "İlerleme bu cihazdaki tarayıcıda saklanır; başka cihazda ayrı tutulur.")
        )
      ),
      tablo("ada"),
      tablo("ayaz")
    );
  }

  function sifirlaDugmesi(cid) {
    const ad = COCUKLAR[cid].ad;
    const ilk = `${ad} için ilerlemeyi sıfırla`;
    const d = h("button.dugme.tehlike.kucuk", { type: "button" }, ilk);
    let onay = false;
    let z;
    d.addEventListener("click", () => {
      if (!onay) {
        onay = true;
        d.textContent = "Tüm yıldızlar ve seviyeler silinecek. Onaylamak için tekrar basın";
        z = setTimeout(() => {
          onay = false;
          d.textContent = ilk;
        }, 4000);
        return;
      }
      clearTimeout(z);
      veri[cid] = bosCocuk();
      kaydet();
      bildir(ad + " için ilerleme sıfırlandı");
      veliEkrani();
    });
    return d;
  }

  Object.assign(OE, {
    h,
    yard: { rast, aralik, sec, karistir, secN, bicim, sureBicim, azHareket, SAYI_AD },
    ses,
    konus,
    sustur,
    bildir,
    konfeti,
    COCUKLAR,
    baslat() {
      window.addEventListener("hashchange", ciz);
      ciz();
    },
  });
})();
