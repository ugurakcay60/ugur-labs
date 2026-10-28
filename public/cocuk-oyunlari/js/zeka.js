// Zekâ oyunları: hafıza, sudoku, şifre kırıcı, labirent, kaydırmalı bulmaca, renk sırası.
// Ortak oyunlar ctx.ada'ya göre zorluk ayarlar (Ada: büyük, resimli, bağışlayıcı; Ayaz: büyük ızgaralar, süre, hamle).
(function () {
  "use strict";
  const { h, yard } = OE;
  const { aralik, sec, karistir, secN } = yard;
  const emojiMi = (s) => /\p{Extended_Pictographic}/u.test(s);
  const tokenRenk = (ad) => getComputedStyle(document.body).getPropertyValue(ad).trim();

  // Zamanlayıcıları toplu temizlemek için
  function zamanlayici() {
    const idler = new Set();
    return {
      sonra(f, ms) {
        const id = setTimeout(() => (idler.delete(id), f()), ms);
        idler.add(id);
        return id;
      },
      temizle() {
        idler.forEach(clearTimeout);
        idler.clear();
      },
    };
  }

  // ---------------- Hafıza Kartları ----------------
  const HAFIZA_ADA = [["🐶", "köpek"], ["🐱", "kedi"], ["🐰", "tavşan"], ["🦁", "aslan"], ["🐸", "kurbağa"], ["🐵", "maymun"], ["🐼", "panda"], ["🦋", "kelebek"], ["🐢", "kaplumbağa"], ["🐙", "ahtapot"]];
  const HAFIZA_AYAZ = "🚀 🛸 🦖 🐉 ⚽ 🏀 🎸 🎮 🧲 🔭 🌋 🦈 🐙 🦉 🍕 🍉 🌈 ⚡ 🎯 🧩".split(" ");

  OE.ekle({
    id: "hafiza",
    ad: "Hafıza Kartları",
    simge: "🃏",
    cocuk: ["ada", "ayaz"],
    grup: "Zekâ oyunları",
    aciklama: "Eş kartları bul",
    baslat(sahne, ctx) {
      const sv = ctx.seviye;
      const z = zamanlayici();
      let ciftler;
      let ipucu;
      if (ctx.ada) {
        ciftler = secN(HAFIZA_ADA, [0, 3, 4, 6, 6, 8][sv]).map(([e, ad]) => ({ a: e, b: e, ad }));
        ipucu = "Kartları çevir, aynı iki resmi bul!";
      } else {
        const n = [0, 6, 8, 8, 10, 12][sv];
        if (sv === 3 || sv === 5) {
          const gor = new Set();
          ciftler = [];
          while (ciftler.length < n) {
            const a = aralik(3, 9);
            const b = aralik(3, 9);
            if (gor.has(a * b)) continue;
            gor.add(a * b);
            ciftler.push({ a: `${a}×${b}`, b: String(a * b) });
          }
          ipucu = "Her işlemi sonucuyla eşleştir.";
        } else if (sv === 4) {
          ciftler = secN(OE.veri.INGILIZCE.filter((x) => !x.en.includes(" ")), n).map((x) => ({ a: x.e, b: x.en }));
          ipucu = "Her resmi İngilizce adıyla eşleştir.";
        } else {
          ciftler = secN(HAFIZA_AYAZ, n).map((e) => ({ a: e, b: e }));
          ipucu = "Aynı iki resmi bul. Ne kadar az hamle, o kadar çok yıldız!";
        }
      }
      const kartlar = karistir(ciftler.flatMap((c, i) => [{ i, yuz: c.a }, { i, yuz: c.b }]));
      const n = kartlar.length;
      const sutun = n <= 6 ? 3 : n <= 16 ? 4 : n <= 20 ? 5 : 6;
      const t0 = Date.now();
      let acik = [];
      let kilit = false;
      let hamle = 0;
      let bulunan = 0;
      const sayac = h("span", "0 hamle");
      const izgara = h(
        "div.hafiza",
        { stil: `--sutun:${sutun}` },
        kartlar.map((k) => {
          const b = h(
            "button.kart",
            { type: "button", "aria-label": "Kapalı kart" },
            h("span.kart-ic", h("span.kart-arka", "?"), h("span.kart-on" + (emojiMi(k.yuz) ? ".emo" : ".kart-yazi"), k.yuz))
          );
          b.addEventListener("click", () => cevir(k, b));
          return b;
        })
      );
      sahne.replaceChildren(h("div.zeka", h("p.soru-metin", ipucu), h("div.zeka-bilgi", sayac, h("span", `${ciftler.length} çift`)), izgara));
      ctx.konus(ipucu);

      function cevir(k, b) {
        if (kilit || b.classList.contains("acik")) return;
        b.classList.add("acik");
        b.setAttribute("aria-label", k.yuz);
        ctx.ses.tik();
        acik.push([k, b]);
        if (acik.length < 2) return;
        hamle++;
        sayac.textContent = hamle + " hamle";
        const [[k1, b1], [k2, b2]] = acik;
        acik = [];
        if (k1.i === k2.i) {
          bulunan++;
          z.sonra(() => {
            b1.classList.add("bulundu");
            b2.classList.add("bulundu");
            ctx.ses.dogru();
            const ad = ciftler[k1.i].ad;
            if (ad) ctx.konus(`İki ${ad}!`, "tr-TR", { kaydet: false });
          }, 250);
          if (bulunan === ciftler.length) z.sonra(bitir, 1100);
        } else {
          kilit = true;
          z.sonra(() => {
            b1.classList.remove("acik");
            b2.classList.remove("acik");
            b1.setAttribute("aria-label", "Kapalı kart");
            b2.setAttribute("aria-label", "Kapalı kart");
            kilit = false;
          }, ctx.ada ? 1300 : 900);
        }
      }
      function bitir() {
        const p = ciftler.length;
        const oran = hamle / p;
        const yildiz = ctx.ada ? (oran <= 2 ? 3 : oran <= 3 ? 2 : 1) : oran <= 1.8 ? 3 : oran <= 2.5 ? 2 : 1;
        ctx.bitir({ yildiz, metin: `${hamle} hamlede ${p} çift buldun`, sure: Date.now() - t0 });
      }
      return z.temizle;
    },
  });

  // ---------------- Sudoku ----------------
  function cozumSay(g, kH, kW, sinir) {
    const N = g.length;
    const s = g.map((r) => r.slice());
    let say = 0;
    const uygun = (r, c, v) => {
      for (let k = 0; k < N; k++) if (s[r][k] === v || s[k][c] === v) return false;
      const r0 = r - (r % kH);
      const c0 = c - (c % kW);
      for (let i = 0; i < kH; i++) for (let j = 0; j < kW; j++) if (s[r0 + i][c0 + j] === v) return false;
      return true;
    };
    (function coz() {
      let enR = -1;
      let enC = -1;
      let enAday = null;
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++) {
          if (s[r][c]) continue;
          const aday = [];
          for (let v = 1; v <= N; v++) if (uygun(r, c, v)) aday.push(v);
          if (!aday.length) return;
          if (!enAday || aday.length < enAday.length) [enAday, enR, enC] = [aday, r, c];
        }
      if (!enAday) {
        say++;
        return;
      }
      for (const v of enAday) {
        s[enR][enC] = v;
        coz();
        if (say >= sinir) break;
      }
      s[enR][enC] = 0;
    })();
    return say;
  }
  function sudokuUret(kH, kW, ipucu) {
    const N = kH * kW;
    const sira = (grup, boy) => karistir([...Array(grup).keys()]).flatMap((b) => karistir([...Array(boy).keys()]).map((x) => b * boy + x));
    const satirlar = sira(kW, kH); // kW tane bant, her bantta kH satır
    const sutunlar = sira(kH, kW); // kH tane yığın, her yığında kW sütun
    const sembol = karistir([...Array(N).keys()].map((x) => x + 1));
    const desen = (r, c) => (kW * (r % kH) + Math.floor(r / kH) + c) % N;
    const cozum = satirlar.map((r) => sutunlar.map((c) => sembol[desen(r, c)]));
    const bulmaca = cozum.map((r) => r.slice());
    let dolu = N * N;
    for (const i of karistir([...Array(N * N).keys()])) {
      if (dolu <= ipucu) break;
      const r = Math.floor(i / N);
      const c = i % N;
      const eski = bulmaca[r][c];
      bulmaca[r][c] = 0;
      if (cozumSay(bulmaca, kH, kW, 2) !== 1) bulmaca[r][c] = eski;
      else dolu--;
    }
    return { cozum, bulmaca };
  }
  const MEYVE = ["🍎", "🍌", "🍇", "🥝"];

  OE.ekle({
    id: "sudoku",
    ad: "Sudoku",
    simge: "🧩",
    cocuk: ["ada", "ayaz"],
    grup: "Zekâ oyunları",
    aciklama: "Her satıra, sütuna ve kutuya bir tane",
    baslat(sahne, ctx) {
      const sv = ctx.seviye;
      const [kH, kW, ipucuSay] = ctx.ada
        ? [2, 2, [0, 12, 10, 9, 8, 7][sv]]
        : [null, [2, 2, 6], [2, 3, 22], [2, 3, 16], [3, 3, 38], [3, 3, 30]][sv];
      const N = kH * kW;
      const { cozum, bulmaca } = sudokuUret(kH, kW, ipucuSay);
      const tablo = bulmaca.map((r) => r.slice());
      const verili = bulmaca.map((r) => r.map(Boolean));
      const goster = (v) => (v ? (ctx.ada ? MEYVE[v - 1] : String(v)) : "");
      const t0 = Date.now();
      let secili = null;
      let hata = 0;
      let yardim = 0;
      let bitti = false;

      const hucreler = [];
      const izgara = h("div.sudoku" + (ctx.ada ? ".resimli" : ""), { stil: `--n:${N}`, role: "grid" });
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++) {
          const sinif = [verili[r][c] ? "verili" : "", (c + 1) % kW === 0 && c < N - 1 ? "sag" : "", (r + 1) % kH === 0 && r < N - 1 ? "alt" : ""].filter(Boolean);
          const b = h("button.hucre" + (sinif.length ? "." + sinif.join(".") : ""), { type: "button", "aria-label": `Satır ${r + 1}, sütun ${c + 1}` });
          b.addEventListener("click", () => sec_(r, c));
          hucreler.push(b);
          izgara.append(b);
        }
      const tuslar = h(
        "div.sudoku-tuslar",
        { stil: `--n:${Math.min(N, 9)}` },
        [...Array(N).keys()].map((i) => h("button.tus" + (ctx.ada ? ".emo" : ""), { type: "button", onclick: () => yaz(i + 1) }, goster(i + 1)))
      );
      const durum = h("p.zeka-durum", { "aria-live": "polite" });
      const yonerge = ctx.ada
        ? "Her satırda, her sütunda ve her kalın çizgili karede her meyveden bir tane olmalı. Boş kareye dokun, sonra meyveyi seç."
        : `Her satıra, her sütuna ve her kalın çizgili kutuya 1'den ${N}'e kadar her rakam bir kez yazılır.`;
      sahne.replaceChildren(
        h(
          "div.zeka",
          h("p.soru-metin.kucuk", yonerge),
          izgara,
          tuslar,
          h(
            "div.zeka-araclar",
            h("button.dugme.ikincil.kucuk", { type: "button", onclick: () => yaz(0) }, "Sil"),
            h("button.dugme.ikincil.kucuk", { type: "button", onclick: ipucuVer }, "İpucu")
          ),
          durum
        )
      );
      ctx.konus(yonerge);

      function cakisiyor(r, c) {
        const v = tablo[r][c];
        if (!v) return false;
        for (let k = 0; k < N; k++) if ((k !== c && tablo[r][k] === v) || (k !== r && tablo[k][c] === v)) return true;
        const r0 = r - (r % kH);
        const c0 = c - (c % kW);
        for (let i = 0; i < kH; i++) for (let j = 0; j < kW; j++) if ((r0 + i !== r || c0 + j !== c) && tablo[r0 + i][c0 + j] === v) return true;
        return false;
      }
      function ciz() {
        const sv_ = secili ? tablo[secili[0]][secili[1]] : 0;
        for (let r = 0; r < N; r++)
          for (let c = 0; c < N; c++) {
            const b = hucreler[r * N + c];
            const v = tablo[r][c];
            b.textContent = goster(v);
            b.classList.toggle("emo", ctx.ada && !!v);
            b.classList.toggle("secili", !!secili && secili[0] === r && secili[1] === c);
            b.classList.toggle("ayni", !!v && v === sv_);
            b.classList.toggle("cakisma", !verili[r][c] && cakisiyor(r, c));
            b.classList.toggle("komsu", !!secili && (secili[0] === r || secili[1] === c));
          }
      }
      function sec_(r, c) {
        if (bitti) return;
        secili = [r, c];
        ctx.ses.tik();
        ciz();
      }
      function yaz(v) {
        if (bitti || !secili) {
          if (!secili) durum.textContent = "Önce boş bir kareye dokun.";
          return;
        }
        const [r, c] = secili;
        if (verili[r][c]) return;
        tablo[r][c] = v;
        if (v && cakisiyor(r, c)) {
          hata++;
          ctx.ses.yanlis();
          durum.textContent = ctx.ada ? "Bu meyve aynı sırada zaten var!" : "Bu rakam aynı satırda, sütunda ya da kutuda zaten var.";
          if (ctx.ada) ctx.konus("Bu meyve aynı sırada ya da karede zaten var. Başka birini dene!", "tr-TR", { kaydet: false });
        } else {
          durum.textContent = "";
          if (v) ctx.ses.tik();
        }
        ciz();
        kontrol();
      }
      function ipucuVer() {
        if (bitti) return;
        let hedef = secili && !verili[secili[0]][secili[1]] && tablo[secili[0]][secili[1]] !== cozum[secili[0]][secili[1]] ? secili : null;
        if (!hedef) {
          const bos = [];
          for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (tablo[r][c] !== cozum[r][c]) bos.push([r, c]);
          if (!bos.length) return;
          hedef = sec(bos);
        }
        const [r, c] = hedef;
        tablo[r][c] = cozum[r][c];
        verili[r][c] = true;
        hucreler[r * N + c].classList.add("verili", "ipucu");
        yardim++;
        secili = hedef;
        ciz();
        kontrol();
      }
      function kontrol() {
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (tablo[r][c] !== cozum[r][c]) return;
        bitti = true;
        const ceza = hata + yardim;
        const yildiz = ctx.ada ? (ceza <= 2 ? 3 : ceza <= 5 ? 2 : 1) : ceza === 0 ? 3 : ceza <= 3 ? 2 : 1;
        izgara.classList.add("tamam");
        setTimeout(() => ctx.bitir({ yildiz, metin: `${hata} hata, ${yardim} ipucu`, sure: Date.now() - t0 }), 900);
      }
      function tus(e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const v = parseInt(e.key, 10);
        if (v >= 1 && v <= N) yaz(v);
        else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") yaz(0);
        else if (e.key.startsWith("Arrow")) {
          e.preventDefault();
          const [r, c] = secili || [0, 0];
          const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
          sec_((r + d[0] + N) % N, (c + d[1] + N) % N);
        }
      }
      document.addEventListener("keydown", tus);
      ciz();
      return () => document.removeEventListener("keydown", tus);
    },
  });

  // ---------------- Şifre Kırıcı ----------------
  OE.ekle({
    id: "sifre",
    ad: "Şifre Kırıcı",
    simge: "🔐",
    cocuk: "ayaz",
    grup: "Zekâ oyunları",
    aciklama: "İpuçlarıyla gizli sayıyı bul",
    baslat(sahne, ctx) {
      const sv = ctx.seviye;
      const L = sv <= 2 ? 3 : 4;
      const renkli = sv <= 3; // 4. seviyeden sonra yalnızca sayı ipucu verilir
      const hak = sv <= 1 ? 10 : 8;
      const gizli = secN([...Array(10).keys()], L);
      const t0 = Date.now();
      let giris = [];
      let tahminler = 0;
      let bitti = false;
      const notlar = Array(10).fill(0); // 0 bilinmiyor, 1 yok, 2 var

      const satirlar = h("div.sifre-satirlar");
      const yuva = h("div.sifre-giris");
      const durum = h("p.zeka-durum", { "aria-live": "polite" });
      const notSatiri = h(
        "div.sifre-not",
        [...Array(10).keys()].map((d) =>
          h("button.not-tus", { type: "button", title: "Not al: dokundukça “yok” / “var” / boş", onclick: (e) => notDegistir(d, e.currentTarget) }, String(d))
        )
      );
      const tuslar = h(
        "div.sifre-tuslar",
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => h("button.tus", { type: "button", onclick: () => rakam(d) }, String(d))),
        h("button.tus.ikincil", { type: "button", onclick: sil, "aria-label": "Sil" }, "⌫"),
        h("button.tus", { type: "button", onclick: () => rakam(0) }, "0"),
        h("button.tus.onay", { type: "button", onclick: dene }, "Dene")
      );
      const kural = renkli
        ? `${L} basamaklı, rakamları farklı gizli bir sayı var. Yeşil: rakam doğru yerde. Sarı: rakam var ama başka yerde. Gri: rakam yok.`
        : `${L} basamaklı, rakamları farklı gizli bir sayı var. Her tahminden sonra kaç rakamın doğru yerde (●) ve kaçının yanlış yerde (○) olduğunu görürsün.`;
      sahne.replaceChildren(
        h(
          "div.zeka.sifre",
          h("p.soru-metin.kucuk", kural),
          h("div.zeka-bilgi", h("span.kalan-hak", `${hak} hakkın var`)),
          satirlar,
          yuva,
          tuslar,
          h("p.not-baslik", "Not defterin (dokunarak işaretle):"),
          notSatiri,
          durum
        )
      );
      yuvaCiz();

      function notDegistir(d, b) {
        notlar[d] = (notlar[d] + 1) % 3;
        b.className = "not-tus" + (notlar[d] === 1 ? " yok" : notlar[d] === 2 ? " var" : "");
      }
      function yuvaCiz() {
        yuva.replaceChildren(...[...Array(L).keys()].map((i) => h("span.yuva" + (i === giris.length ? ".imlec" : ""), giris[i] != null ? String(giris[i]) : "")));
      }
      function rakam(d) {
        if (bitti || giris.length >= L) return;
        if (giris.includes(d)) {
          durum.textContent = "Rakamlar birbirinden farklı olmalı.";
          ctx.ses.yanlis();
          return;
        }
        durum.textContent = "";
        giris.push(d);
        ctx.ses.tik();
        yuvaCiz();
      }
      function sil() {
        if (bitti) return;
        giris.pop();
        yuvaCiz();
      }
      function dene() {
        if (bitti) return;
        if (giris.length < L) {
          durum.textContent = `${L} rakam yazmalısın.`;
          return;
        }
        tahminler++;
        let yer = 0;
        let var_ = 0;
        const hucre = giris.map((d, i) => {
          const s = gizli[i] === d ? "yer" : gizli.includes(d) ? "var" : "yok";
          if (s === "yer") yer++;
          else if (s === "var") var_++;
          return h("span.sifre-rakam" + (renkli ? "." + s : ""), String(d));
        });
        const sonuc = renkli ? null : h("span.sifre-sonuc", h("b", "●".repeat(yer) || "–"), " ", "○".repeat(var_));
        satirlar.append(h("div.sifre-satir", h("span.sifre-no", tahminler + "."), hucre, sonuc));
        giris = [];
        yuvaCiz();
        sahne.querySelector(".kalan-hak").textContent = `${hak - tahminler} hakkın kaldı`;
        if (yer === L) {
          bitti = true;
          ctx.ses.kutlama();
          const iyi = L === 3 ? 4 : 5;
          const yildiz = tahminler <= iyi ? 3 : tahminler <= iyi + 2 ? 2 : 1;
          setTimeout(() => ctx.bitir({ yildiz, metin: `Şifreyi ${tahminler} tahminde kırdın`, sure: Date.now() - t0 }), 900);
        } else if (tahminler >= hak) {
          bitti = true;
          ctx.ses.yanlis();
          durum.textContent = "Şifre " + gizli.join("") + " idi.";
          setTimeout(() => ctx.bitir({ yildiz: 1, metin: `Şifre ${gizli.join("")} idi. Bir dahakine!` }), 2200);
        } else ctx.ses.tik();
      }
      function tus(e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (/^[0-9]$/.test(e.key)) rakam(+e.key);
        else if (e.key === "Backspace") sil();
        else if (e.key === "Enter") {
          e.preventDefault();
          dene();
        }
      }
      document.addEventListener("keydown", tus);
      return () => document.removeEventListener("keydown", tus);
    },
  });

  // ---------------- Labirent ----------------
  const K = 1, D = 2, G = 4, B = 8; // kuzey, doğu, güney, batı duvarı
  const YON = { K: [0, -1, K, G], D: [1, 0, D, B], G: [0, 1, G, K], B: [-1, 0, B, D] };
  function labirentUret(gen, yuk) {
    const d = new Array(gen * yuk).fill(15);
    const gez = new Uint8Array(gen * yuk);
    const yigin = [0];
    gez[0] = 1;
    while (yigin.length) {
      const i = yigin[yigin.length - 1];
      const x = i % gen;
      const y = Math.floor(i / gen);
      const komsu = Object.values(YON).filter(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return nx >= 0 && ny >= 0 && nx < gen && ny < yuk && !gez[ny * gen + nx];
      });
      if (!komsu.length) {
        yigin.pop();
        continue;
      }
      const [dx, dy, bit, kbit] = sec(komsu);
      const j = (y + dy) * gen + x + dx;
      d[i] &= ~bit;
      d[j] &= ~kbit;
      gez[j] = 1;
      yigin.push(j);
    }
    return d;
  }
  function enKisa(d, gen, yuk) {
    const uz = new Int32Array(gen * yuk).fill(-1);
    uz[0] = 0;
    const kuyruk = [0];
    for (let q = 0; q < kuyruk.length; q++) {
      const i = kuyruk[q];
      for (const [dx, dy, bit] of Object.values(YON)) {
        if (d[i] & bit) continue;
        const j = i + dy * gen + dx;
        if (uz[j] < 0) {
          uz[j] = uz[i] + 1;
          kuyruk.push(j);
        }
      }
    }
    return uz[gen * yuk - 1];
  }

  OE.ekle({
    id: "labirent",
    ad: "Labirent",
    simge: "🌀",
    cocuk: ["ada", "ayaz"],
    grup: "Zekâ oyunları",
    aciklama: "Çıkışa giden yolu bul",
    baslat(sahne, ctx) {
      const sv = ctx.seviye;
      const boy = ctx.ada ? [0, 4, 5, 6, 7, 8][sv] : [0, 8, 10, 13, 16, 20][sv];
      const [oyuncu, hedef] = ctx.ada ? ["🐰", "🥕"] : ["🚀", "🌍"];
      const duvar = labirentUret(boy, boy);
      const kisa = enKisa(duvar, boy, boy);
      const izli = new Set([0]);
      const t0 = Date.now();
      let konum = 0;
      let adim = 0;
      let bitti = false;
      const tuval = h("canvas.labirent-tuval", { "aria-label": "Labirent. Ok tuşlarıyla, kaydırarak ya da yön düğmeleriyle ilerle." });
      const kap = h("div.labirent-kap", tuval);
      const sayac = h("span", "0 adım");
      const yonerge = ctx.ada ? "Tavşanı havuca götür! Gitmek istediğin yere dokun ya da okları kullan." : "Roketi Dünya'ya götür. Ok tuşları, kaydırma ya da yön düğmeleri; koridorlarda kayarak ilerler.";
      const ok = (yon, simge, etiket) => h("button.yon-tus", { type: "button", "aria-label": etiket, onclick: () => git(yon) }, simge);
      sahne.replaceChildren(
        h(
          "div.zeka",
          h("p.soru-metin.kucuk", yonerge),
          h("div.zeka-bilgi", sayac, h("span", `${boy} × ${boy}`)),
          kap,
          h("div.yon-tuslar", ok("K", "↑", "Yukarı"), ok("B", "←", "Sola"), ok("G", "↓", "Aşağı"), ok("D", "→", "Sağa"))
        )
      );
      ctx.konus(yonerge);

      let hucre = 0;
      function ciz() {
        const genislik = Math.min(kap.clientWidth || 320, 560);
        hucre = Math.floor(genislik / boy);
        const px = hucre * boy;
        const oran = window.devicePixelRatio || 1;
        tuval.width = px * oran;
        tuval.height = px * oran;
        tuval.style.width = px + "px";
        tuval.style.height = px + "px";
        const c = tuval.getContext("2d");
        c.setTransform(oran, 0, 0, oran, 0, 0);
        c.fillStyle = tokenRenk("--yuzey");
        c.fillRect(0, 0, px, px);
        c.fillStyle = tokenRenk("--vurgu-acik");
        izli.forEach((i) => c.fillRect((i % boy) * hucre, Math.floor(i / boy) * hucre, hucre, hucre));
        c.strokeStyle = tokenRenk("--murekkep");
        c.lineWidth = Math.max(2, hucre / 9);
        c.lineCap = "round";
        const cizgi = (x1, y1, x2, y2) => {
          c.moveTo(x1, y1);
          c.lineTo(x2, y2);
        };
        c.beginPath();
        for (let i = 0; i < boy * boy; i++) {
          const x = (i % boy) * hucre;
          const y = Math.floor(i / boy) * hucre;
          if (duvar[i] & K) cizgi(x, y, x + hucre, y);
          if (duvar[i] & B) cizgi(x, y, x, y + hucre);
          if (i % boy === boy - 1 && duvar[i] & D) cizgi(x + hucre, y, x + hucre, y + hucre);
          if (i >= boy * (boy - 1) && duvar[i] & G) cizgi(x, y + hucre, x + hucre, y + hucre);
        }
        c.stroke();
        c.font = `${Math.floor(hucre * 0.72)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        const yaz = (e, i) => c.fillText(e, (i % boy) * hucre + hucre / 2, Math.floor(i / boy) * hucre + hucre / 2 + hucre * 0.04);
        yaz(hedef, boy * boy - 1);
        yaz(oyuncu, konum);
      }
      function acikYonler(i) {
        return Object.keys(YON).filter((y) => !(duvar[i] & YON[y][2]));
      }
      function git(yon) {
        if (bitti) return;
        if (duvar[konum] & YON[yon][2]) {
          ctx.ses.ton(160, 0.08, { tip: "sine" });
          return;
        }
        for (;;) {
          const [dx, dy, , geriBit] = YON[yon];
          konum += dy * boy + dx;
          izli.add(konum);
          adim++;
          if (ctx.ada || konum === boy * boy - 1) break;
          // Ayaz: dallanmayan koridorda kaymaya devam et (geldiğimiz yön hariç tek açık yön varsa)
          const acik = acikYonler(konum).filter((y) => YON[y][2] !== geriBit);
          if (acik.length !== 1) break;
          yon = acik[0];
        }
        sayac.textContent = adim + " adım";
        ctx.ses.tik();
        ciz();
        if (konum === boy * boy - 1) {
          bitti = true;
          ctx.ses.kutlama();
          const oran = adim / kisa;
          const yildiz = ctx.ada ? (oran <= 2 ? 3 : 2) : oran <= 1.25 ? 3 : oran <= 2 ? 2 : 1;
          setTimeout(() => ctx.bitir({ yildiz, metin: `${adim} adımda çıktın (en kısa yol ${kisa} adım)`, sure: Date.now() - t0 }), 700);
        }
      }
      function tus(e) {
        const yon = { ArrowUp: "K", ArrowDown: "G", ArrowLeft: "B", ArrowRight: "D", w: "K", s: "G", a: "B", d: "D" }[e.key];
        if (!yon) return;
        e.preventDefault();
        git(yon);
      }
      let basla = null;
      tuval.addEventListener("pointerdown", (e) => (basla = [e.clientX, e.clientY]));
      tuval.addEventListener("pointerup", (e) => {
        if (!basla) return;
        let dx = e.clientX - basla[0];
        let dy = e.clientY - basla[1];
        basla = null;
        if (Math.hypot(dx, dy) < 18) {
          // dokunma: oyuncuya göre baskın yöne bir adım
          const r = tuval.getBoundingClientRect();
          dx = e.clientX - r.left - ((konum % boy) + 0.5) * hucre;
          dy = e.clientY - r.top - (Math.floor(konum / boy) + 0.5) * hucre;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < hucre / 2) return;
        }
        git(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "D" : "B") : dy > 0 ? "G" : "K");
      });
      document.addEventListener("keydown", tus);
      window.addEventListener("resize", ciz);
      requestAnimationFrame(ciz);
      return () => {
        document.removeEventListener("keydown", tus);
        window.removeEventListener("resize", ciz);
      };
    },
  });

  // ---------------- Kaydırmalı Bulmaca ----------------
  OE.ekle({
    id: "kaydirma",
    ad: "Kaydırmalı Bulmaca",
    simge: "🔲",
    cocuk: "ayaz",
    grup: "Zekâ oyunları",
    aciklama: "Sayıları sıraya diz",
    baslat(sahne, ctx) {
      const sv = ctx.seviye;
      const N = sv <= 2 ? 3 : 4;
      const karisim = [0, 20, 40, 40, 70, 120][sv];
      const tahta = [...Array(N * N).keys()].map((i) => (i + 1) % (N * N)); // 0 = boşluk
      let bos = N * N - 1;
      let onceki = -1;
      const komsular = (i) => [i - N, i + N, i % N ? i - 1 : -1, i % N < N - 1 ? i + 1 : -1].filter((j) => j >= 0 && j < N * N);
      do {
        for (let k = 0; k < karisim; k++) {
          const j = sec(komsular(bos).filter((x) => x !== onceki));
          [tahta[bos], tahta[j]] = [tahta[j], tahta[bos]];
          onceki = bos;
          bos = j;
        }
      } while (cozuldu());
      const t0 = Date.now();
      let hamle = 0;
      let bitti = false;
      const sayac = h("span", "0 hamle");
      const alan = h("div.kaydirma", { stil: `--n:${N}` });
      const taslar = {};
      for (let v = 1; v < N * N; v++) {
        taslar[v] = h("button.tas", { type: "button", onclick: () => dokun(tahta.indexOf(v)) }, String(v));
        alan.append(taslar[v]);
      }
      sahne.replaceChildren(
        h("div.zeka", h("p.soru-metin.kucuk", "Taşları kaydırarak 1'den " + (N * N - 1) + "'e kadar sıraya diz. Boşluğun yanındaki taşa dokun."), h("div.zeka-bilgi", sayac, h("span", `${N} × ${N}`)), alan)
      );
      yerlestir();

      function cozuldu() {
        return tahta.every((v, i) => v === (i + 1) % (N * N));
      }
      function yerlestir() {
        tahta.forEach((v, i) => {
          if (!v) return;
          const t = taslar[v];
          t.style.transform = `translate(${(i % N) * 100}%, ${Math.floor(i / N) * 100}%)`;
          t.classList.toggle("yerinde", v === i + 1);
        });
      }
      function dokun(i) {
        if (bitti) return;
        const [r, c, br, bc] = [Math.floor(i / N), i % N, Math.floor(bos / N), bos % N];
        if (r !== br && c !== bc) return;
        // aynı satır/sütundaki taşları boşluğa doğru kaydır
        const adim = r === br ? (c < bc ? -1 : 1) : c < bc || r < br ? -N : N;
        while (bos !== i) {
          const j = bos + adim;
          [tahta[bos], tahta[j]] = [tahta[j], tahta[bos]];
          bos = j;
        }
        hamle++;
        sayac.textContent = hamle + " hamle";
        ctx.ses.tik();
        yerlestir();
        if (cozuldu()) {
          bitti = true;
          ctx.ses.kutlama();
          const yildiz = hamle <= karisim ? 3 : hamle <= karisim * 2 ? 2 : 1;
          setTimeout(() => ctx.bitir({ yildiz, metin: `${hamle} hamlede çözdün`, sure: Date.now() - t0 }), 800);
        }
      }
      function tus(e) {
        // ok yönünde boşluğa kayacak taş: boşluğun karşı tarafındaki taş
        const d = { ArrowUp: N, ArrowDown: -N, ArrowLeft: 1, ArrowRight: -1 }[e.key];
        if (d == null) return;
        e.preventDefault();
        const j = bos + d;
        if (j < 0 || j >= N * N || (Math.abs(d) === 1 && Math.floor(j / N) !== Math.floor(bos / N))) return;
        dokun(j);
      }
      document.addEventListener("keydown", tus);
      return () => document.removeEventListener("keydown", tus);
    },
  });

  // ---------------- Renk Sırası ----------------
  const PEDLER = [
    { renk: "#E53935", ton: 330, e: "🐞" },
    { renk: "#1E88E5", ton: 392, e: "🐳" },
    { renk: "#FDD835", ton: 494, e: "🐥" },
    { renk: "#43A047", ton: 587, e: "🐸" },
    { renk: "#8E24AA", ton: 659, e: "🍇" },
    { renk: "#FB8C00", ton: 784, e: "🦊" },
  ];
  OE.ekle({
    id: "sira",
    ad: "Renk Sırası",
    simge: "🎵",
    cocuk: ["ada", "ayaz"],
    grup: "Zekâ oyunları",
    aciklama: "Yanan sırayı aklında tut",
    baslat(sahne, ctx) {
      const sv = ctx.seviye;
      const z = zamanlayici();
      const adet = !ctx.ada && sv >= 4 ? 6 : 4;
      const hiz = ctx.ada ? 950 - sv * 50 : 720 - sv * 60;
      let dizi = [];
      let giris = 0;
      let izliyor = true;
      let can = ctx.ada ? 2 : 1;
      let skor = 0;
      const durum = h("p.soru-metin", "Hazır mısın?");
      const skorYazi = h("span", "Sıra: 0");
      const pedler = PEDLER.slice(0, adet).map((p, i) =>
        h("button.ped", { type: "button", stil: `--ped:${p.renk}`, "aria-label": "Renk " + (i + 1), onclick: () => bas(i) }, ctx.ada ? h("span.emo", p.e) : null)
      );
      const basla = h("button.dugme", { type: "button", onclick: () => (basla.hidden = true, yeniTur()) }, "Başla");
      sahne.replaceChildren(h("div.zeka", durum, h("div.zeka-bilgi", skorYazi, h("span", ctx.ada ? "2 hakkın var" : "")), h("div.pedler", { stil: `--sutun:${adet === 4 ? 2 : 3}` }, pedler), basla));
      ctx.konus(ctx.ada ? "Renklerin yanışını izle, sonra aynı sırayla dokun. Başla düğmesine bas!" : "Yanan sırayı izle, sonra aynı sırayla bas.");

      function yak(i, sure) {
        const p = pedler[i];
        p.classList.add("yanik");
        OE.ses.ton(PEDLER[i].ton, sure / 1000, { tip: "sine", ses: 0.25 });
        z.sonra(() => p.classList.remove("yanik"), sure);
      }
      function yeniTur() {
        dizi.push(aralik(0, adet - 1));
        oynat();
      }
      function oynat() {
        izliyor = true;
        giris = 0;
        durum.textContent = "İzle…";
        dizi.forEach((p, k) => z.sonra(() => yak(p, hiz * 0.6), 700 + k * hiz));
        z.sonra(() => {
          izliyor = false;
          durum.textContent = "Sıra sende!";
        }, 700 + dizi.length * hiz);
      }
      function bas(i) {
        if (izliyor) return;
        yak(i, 260);
        if (i === dizi[giris]) {
          giris++;
          if (giris === dizi.length) {
            skor = dizi.length;
            skorYazi.textContent = "Sıra: " + skor;
            izliyor = true;
            durum.textContent = "Harika!";
            z.sonra(yeniTur, 900);
          }
          return;
        }
        ctx.ses.yanlis();
        can--;
        if (can > 0) {
          durum.textContent = "Bir daha izle!";
          if (ctx.ada) ctx.konus("Olmadı. Bir daha izle!", "tr-TR", { kaydet: false });
          izliyor = true;
          z.sonra(oynat, 1200);
          return;
        }
        izliyor = true;
        const yildiz = ctx.ada ? (skor >= 5 ? 3 : skor >= 3 ? 2 : 1) : skor >= 9 ? 3 : skor >= 6 ? 2 : 1;
        z.sonra(() => ctx.bitir({ yildiz, skor, metin: `En uzun sıra: ${skor}` }), 900);
      }
      return z.temizle;
    },
  });
})();
