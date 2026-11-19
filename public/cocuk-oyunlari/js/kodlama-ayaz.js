// Kodlama: Tıkır'ın Kod Atölyesi (Ayaz) — sürükle-bırak bloklar, döngü, eğer, hata ayıklama.
(function () {
  "use strict";
  const { h } = OE;
  const UI = OE.kodUI;
  const K = OE.kod;
  const D = OE.kodBolumler;

  // Blok türleri: k = kategori (renk), kap = içine blok alır
  const BLOK = {
    ileri: { k: "hareket", ad: "İleri git" },
    sag: { k: "hareket", ad: "Sağa dön ↻" },
    sol: { k: "hareket", ad: "Sola dön ↺" },
    topla: { k: "eylem", ad: "Topla" },
    bip: { k: "eylem", ad: "Bip çal" },
    goz: { k: "eylem", ad: "Göz rengi" },
    tekrar: { k: "dongu", ad: "kez tekrarla", kap: true },
    varana: { k: "dongu", ad: "Hedefe varana kadar tekrarla", kap: true },
    eger: { k: "kosul", ad: "Eğer önün açıksa", kap: true },
  };
  const RENKLER = ["mavi", "mutlu", "dans", "dusunuyor"];
  const HIZ = [500, 250];
  const ESIK = 8; // bu kadar pikselden az kayma dokunma sayılır

  function yeniBlok(t) {
    const b = { id: K.yeniId(), t };
    if (t === "tekrar") Object.assign(b, { n: 2, ic: [] });
    if (t === "varana") b.ic = [];
    if (t === "eger") Object.assign(b, { kosul: "onAcik", ic: [], degil: [] });
    if (t === "goz") b.renk = "mavi";
    return b;
  }
  const idVer = (p) => p.map((b) => ({ ...b, id: K.yeniId(), ic: b.ic && idVer(b.ic), degil: b.degil && idVer(b.degil) }));

  OE.ekle({
    id: "kodatolye",
    ad: "Tıkır'ın Kod Atölyesi",
    simge: "🤖",
    cocuk: "ayaz",
    grup: "Kodlama",
    aciklama: "Blokları birleştir: döngü, eğer, hata ayıklama.",
    puanli: false,
    baslat(sahne, ctx) {
      const z = UI.zamanlayici();
      let temizSurukle = () => {};

      function haritaGoster() {
        z.temizle();
        temizSurukle();
        ctx.sustur();
        UI.harita(sahne, { cocuk: "ayaz", bolumler: D.AYAZ, temalar: D.TEMALAR, sec: oyna, ek: OE.kodUI.insanRobot && OE.kodUI.insanRobot(ctx, false) });
      }

      function oyna(no) {
        z.temizle();
        const b = D.AYAZ[no - 1];
        const tema = D.TEMALAR[b.tema];
        const tahmin = b.tur === "tahmin";
        const dunya0 = K.dunyaKur(b);
        const G = UI.izgara(dunya0, tema, { goreli: true, z });
        let program = b.hazir ? idVer(b.hazir) : [];
        let calisiyor = false; // program çalışıyor (otomatik ya da adım adım)
        let otomatik = false;
        let it = null;
        let hiz = 0;
        let basarisiz = 0;
        let ipucuKademe = 0;
        let cozumGosterildi = false;
        let gozunden = false;
        let tahminDeneme = 0;
        let bekleme = null;
        let bitti = false; // kazanıldı/bitti: sonuç ekranı gelene kadar her giriş yok sayılır

        // ---------- Arayüz ----------
        const mesaj = h("p.kd-ipucu", { hidden: true, role: "status" });
        const sayac = h("span.kd-sayac");
        const progEl = h("div.kd-program", { "aria-label": "Program" });
        const copEl = h("div.kd-cop", "🗑 Silmek için buraya sürükle");
        const paletEl = h(
          "div.kd-palet",
          h("p.kd-bolge-baslik", "Bloklar"),
          b.bloklar.map((t) => blokEl(yeniBlok(t), true)),
          copEl
        );
        const dugme = (metin, etiket, f) => h("button.dugme.ikincil.kucuk", { type: "button", "aria-label": etiket, onclick: f }, metin);
        const calistirD = h("button.dugme.kucuk", { type: "button", onclick: calistir }, "▶ Çalıştır");
        const adimD = dugme("⏭ Adım adım", "Adım adım çalıştır", adimAdim);
        const bastanD = dugme("↺ Baştan al", "Baştan al", bastanAl);
        const hizD = dugme("🐢", "Hızı değiştir", () => {
          hiz = 1 - hiz;
          hizD.textContent = hiz ? "🐇" : "🐢";
        });
        const gozD = dugme("👁 Tıkır'ın gözünden", "Tıkır'ın gözünden bak", () => {
          gozunden = !gozunden;
          G.gozundenBak(gozunden);
          gozD.classList.toggle("secili", gozunden);
        });
        const ipucuD = h("button.dugme.ikincil.kucuk.kd-ipucu-dugme", { type: "button", "aria-label": "İpucu", onclick: ipucu }, "💡");
        const atolye = h(
          "div.kd-atolye",
          tahmin ? null : paletEl,
          h("div", h("p.kd-bolge-baslik", "Program · ", sayac), progEl)
        );

        sahne.replaceChildren(
          h(
            "div.kd-oyun.kd-ayaz",
            h(
              "div.kd-ust",
              dugme("🗺️", "Bölümlere dön", haritaGoster),
              h("strong", "Bölüm " + no + " · " + b.kavram),
              h("p.kd-yonerge", b.yonerge)
            ),
            G.el,
            h("div.kd-dugmeler", tahmin ? null : [calistirD, adimD, bastanD], hizD, gozD, ipucuD),
            mesaj,
            atolye
          )
        );

        function yaz(metin) {
          mesaj.hidden = !metin;
          mesaj.textContent = metin || "";
        }

        // ---------- Program çizimi ----------
        function yuva(kap, dal, sira) {
          return h("div.kd-yuva", { "data-yuva": "1", "data-kap": kap == null ? "" : kap, "data-dal": dal, "data-sira": sira });
        }
        function liste(dizi, kap, dal) {
          if (!dizi.length)
            return [h("div.kd-bos-yuva", { "data-yuva": "1", "data-kap": kap == null ? "" : kap, "data-dal": dal, "data-sira": 0 }, kap == null ? "Blokları buraya sürükle" : "buraya bırak")];
          const out = [yuva(kap, dal, 0)];
          dizi.forEach((x, i) => out.push(blokEl(x, false), yuva(kap, dal, i + 1)));
          return out;
        }
        function blokEl(x, palet) {
          const tanim = BLOK[x.t];
          const bas = h(
            "div.kd-blok-bas",
            x.t === "tekrar" ? [h("button.kd-sayi", { type: "button", tabindex: palet ? -1 : null, "aria-label": "Tekrar sayısı" }, x.n), " " + tanim.ad] : tanim.ad,
            x.t === "goz" ? h("span.kd-renk", { stil: `background:${UI.GOZ[x.renk]}` }) : null,
            tanim.kap && !palet ? h("span.kd-tur") : null
          );
          const el = h("div.kd-blok" + (tanim.kap ? ".kap" : ""), { "data-k": tanim.k, "data-id": palet ? null : x.id, "data-t": x.t }, bas);
          if (tanim.kap) {
            el.append(h("div.kd-blok-ic", palet ? null : liste(x.ic, x.id, "ic")));
            if (x.t === "eger") el.append(h("div.kd-blok-ara", "değilse"), h("div.kd-blok-ic", palet ? null : liste(x.degil, x.id, "degil")));
            el.append(h("div.kd-blok-son"));
          }
          bas.addEventListener("pointerdown", (e) => tut(e, palet ? x.t : null, palet ? null : x.id, el));
          bas.addEventListener("dragstart", (e) => e.preventDefault());
          return el;
        }
        function cizProgram() {
          if (s) bitirSurukle(); // yeniden çizim sürüklenen bloğu DOM'dan çıkarır
          progEl.replaceChildren(...liste(program, null, "ic"));
          const n = K.blokSay(program);
          if (b.sinir) {
            sayac.textContent = "Kalan blok: " + (b.sinir - n);
            sayac.classList.toggle("asti", n > b.sinir);
          } else sayac.textContent = n + " blok";
          atolye.classList.toggle("kd-kilit", calisiyor || tahmin);
        }

        // ---------- Sürükle-bırak ----------
        let s = null; // etkin sürükleme
        function tut(e, paletTur, id, el) {
          if (bitti || calisiyor || tahmin || s || (e.pointerType === "mouse" && e.button !== 0)) return;
          const bas = e.currentTarget;
          s = { bas, pid: e.pointerId, paletTur, id, el, x0: e.clientX, y0: e.clientY, hedef: null, hayalet: null, ilk: e.target };
          try {
            bas.setPointerCapture(e.pointerId);
          } catch {}
          bas.addEventListener("pointermove", hareket);
          bas.addEventListener("pointerup", birak);
          bas.addEventListener("pointercancel", iptal);
          bas.addEventListener("lostpointercapture", iptal);
          bekleIpucu();
        }
        function hareket(e) {
          if (!s || e.pointerId !== s.pid) return;
          if (!s.hayalet) {
            if (Math.hypot(e.clientX - s.x0, e.clientY - s.y0) < ESIK) return;
            const r = s.el.getBoundingClientRect();
            s.dx = s.x0 - r.left;
            s.dy = s.y0 - r.top;
            s.hayalet = s.paletTur ? blokEl(yeniBlok(s.paletTur), true) : s.el.cloneNode(true);
            s.hayalet.classList.add("kd-hayalet");
            s.hayalet.style.width = r.width + "px";
            document.body.append(s.hayalet);
            if (!s.paletTur) s.el.classList.add("surukleniyor");
          }
          s.hayalet.style.transform = `translate(${e.clientX - s.dx}px, ${e.clientY - s.dy}px)`;
          // ekran kenarına yaklaşınca sayfayı kaydır
          if (e.clientY < 70) window.scrollBy(0, -14);
          else if (e.clientY > innerHeight - 70) window.scrollBy(0, 14);
          hedefBul(e.clientX, e.clientY);
        }
        function hedefIsaretSil() {
          progEl.querySelectorAll(".hedef").forEach((x) => x.classList.remove("hedef"));
          copEl.classList.remove("hedef");
        }
        function hedefBul(x, y) {
          hedefIsaretSil();
          s.hedef = null;
          const alt = document.elementFromPoint(x, y);
          if (!alt) return;
          if (alt.closest(".kd-palet")) {
            if (!s.paletTur) {
              s.hedef = "sil";
              copEl.classList.add("hedef");
            }
            return;
          }
          if (!alt.closest(".kd-program")) return;
          let en = null;
          let enPuan = Infinity;
          progEl.querySelectorAll("[data-yuva]").forEach((yv) => {
            if (!s.paletTur && s.el.contains(yv)) return; // kendi içine bırakılamaz
            const r = yv.getBoundingClientRect();
            const puan = Math.abs((r.top + r.bottom) / 2 - y) + (x < r.left - 4 ? 1000 : 0) - r.left * 0.01;
            if (puan < enPuan) {
              enPuan = puan;
              en = yv;
            }
          });
          if (en) {
            en.classList.add("hedef");
            s.hedef = en;
          }
        }
        function bitirSurukle() {
          if (!s) return;
          const { bas, hayalet, el } = s;
          bas.removeEventListener("pointermove", hareket);
          bas.removeEventListener("pointerup", birak);
          bas.removeEventListener("pointercancel", iptal);
          bas.removeEventListener("lostpointercapture", iptal);
          if (hayalet) hayalet.remove();
          el.classList.remove("surukleniyor");
          hedefIsaretSil();
          s = null;
        }
        temizSurukle = bitirSurukle;
        function iptal() {
          bitirSurukle();
        }
        function birak(e) {
          if (!s || e.pointerId !== s.pid) return;
          const { paletTur, id, hedef, hayalet, ilk } = s;
          bitirSurukle();
          if (!hayalet) return dokun(paletTur, id, ilk);
          if (hedef === "sil") {
            K.cikar(program, id);
            ctx.ses.tik();
          } else if (hedef) {
            const kap = hedef.dataset.kap === "" ? null : Number(hedef.dataset.kap);
            const dal = hedef.dataset.dal;
            let sira = Number(hedef.dataset.sira);
            if (paletTur) K.ekle(program, yeniBlok(paletTur), { kapId: kap, dal, sira });
            else {
              const r = K.bul(program, id);
              const hedefListe = kap == null ? program : K.bul(program, kap).blok[dal];
              if (r.liste === hedefListe && r.sira < sira) sira--;
              K.cikar(program, id);
              K.ekle(program, r.blok, { kapId: kap, dal, sira });
            }
            ctx.ses.tik();
          }
          yaz("");
          cizProgram();
        }
        // Sürüklemeden dokunma: paletteki blok sona eklenir; sayı ve renk değişir
        function dokun(paletTur, id, ilk) {
          if (paletTur) {
            K.ekle(program, yeniBlok(paletTur));
            ctx.ses.tik();
          } else {
            const r = K.bul(program, id);
            if (!r) return;
            if (ilk.closest(".kd-sayi")) r.blok.n = r.blok.n >= 9 ? 2 : r.blok.n + 1;
            else if (ilk.closest(".kd-renk")) r.blok.renk = RENKLER[(RENKLER.indexOf(r.blok.renk) + 1) % RENKLER.length];
            else return;
            ctx.ses.tik();
          }
          cizProgram();
        }

        // ---------- Çalıştırma ----------
        function vurgula(id, sinif) {
          progEl.querySelectorAll("." + sinif).forEach((x) => x.classList.remove(sinif));
          const e = id != null && progEl.querySelector(`[data-id="${id}"]`);
          if (e) e.classList.add(sinif);
        }
        function basaDon() {
          G.sifirla();
          G.robotKoy(dunya0.robot, false);
          G.goz("mutlu");
          G.el.querySelectorAll(".kd-topla.alindi").forEach((x) => x.classList.remove("alindi"));
          progEl.querySelectorAll(".kd-tur").forEach((x) => (x.textContent = ""));
          vurgula(null, "calisan");
          vurgula(null, "hatali");
        }
        function baslat() {
          basaDon();
          it = K.calistir(program, K.dunyaKur(b));
          calisiyor = true;
          cizProgram();
        }
        function bitis(r) {
          calisiyor = false;
          otomatik = false;
          it = null;
          vurgula(null, "calisan");
          cizProgram();
          if (r.sonuc === "hedef") return kazandi();
          basarisiz++;
          ctx.ses.yanlis();
          if (r.sonuc === "carpti") {
            vurgula(r.id, "hatali");
            G.goz("hata");
            yaz("Tıkır çarptı! Kırmızı bloğa bak. “↺ Baştan al” ile tekrar dene.");
          } else if (r.sonuc === "sinir") yaz("Tıkır çok yoruldu! Program hiç bitmiyor olabilir.");
          else if (r.sonuc === "bos") yaz("Önce programa blok ekle.");
          else {
            const d = K.sonucu(program, b).dunya;
            G.goz("dusunuyor");
            yaz(d.toplanacak.size ? `Toplanmayan ${tema.toplaAd} kaldı!` : `Tıkır ${tema.hedefAd} karesine varmadı.`);
          }
          bekleIpucu();
        }
        // Bir olay işler; program bittiyse false
        function adimAt() {
          const n = it.next();
          if (n.done) {
            bitis(n.value);
            return false;
          }
          const o = n.value;
          vurgula(o.id, "calisan");
          switch (o.tur) {
            case "adim":
            case "don":
              G.robotKoy(o.robot);
              break;
            case "topla":
              G.topla(o.x, o.y);
              ctx.ses.dogru();
              break;
            case "bos-topla":
              G.balon("Burada bir şey yok");
              break;
            case "bip":
              ctx.ses.ton(880, 0.15);
              G.balon("Bip!", 700);
              break;
            case "goz":
              G.goz(o.renk);
              break;
            case "sensor":
              G.sensor(o.acik, o.x, o.y);
              if (!o.acik) G.balon("Duvar var!", 900);
              break;
            case "carp":
              G.carp();
              break;
            case "tur": {
              const t = progEl.querySelector(`[data-id="${o.kapId}"] > .kd-blok-bas .kd-tur`);
              if (t) t.textContent = o.toplam ? `${o.toplam} tekrardan ${o.kac}.` : `${o.kac}. tur`;
              break;
            }
          }
          return true;
        }
        function dongu() {
          if (!otomatik || !it) return;
          if (adimAt()) z.sonra(dongu, HIZ[hiz]);
        }
        function calistir() {
          if (bitti || tahmin || otomatik) return;
          if (!K.blokSay(program)) return yaz("Önce programa blok ekle.");
          yaz("");
          if (!it) baslat();
          otomatik = true;
          cizProgram();
          z.sonra(dongu, 200);
        }
        function adimAdim() {
          if (bitti || tahmin || otomatik) return;
          if (!K.blokSay(program)) return yaz("Önce programa blok ekle.");
          if (!it) {
            yaz("Adım adım: her basışta bir blok çalışır.");
            baslat();
          }
          adimAt();
        }
        function bastanAl() {
          if (bitti) return;
          z.temizle();
          otomatik = false;
          it = null;
          calisiyor = false;
          basaDon();
          yaz("");
          cizProgram();
        }

        function yildizHesap() {
          if (cozumGosterildi) return 1;
          if (ipucuKademe > 0 || (b.sinir && K.blokSay(program) > b.sinir)) return 2;
          return 3;
        }
        function kazandi(y = yildizHesap()) {
          bitti = true;
          G.dans();
          ctx.ses.kutlama();
          yaz("Harika! Tıkır vardı!");
          UI.ilerleme.yaz("ayaz", no, y);
          z.sonra(() => ctx.bitir({ yildiz: y, metin: "Bölüm " + no + ": " + b.kavram + " tamam!" }), 1800);
        }

        // ---------- İpucu ----------
        function bekleIpucu() {
          ipucuD.classList.remove("parla");
          if (bekleme) clearTimeout(bekleme);
          bekleme = basarisiz ? z.sonra(() => ipucuD.classList.add("parla"), 5000) : null;
        }
        function ipucu() {
          if (bitti) return;
          ipucuD.classList.remove("parla");
          if (ipucuKademe < b.ipuclari.length) {
            yaz("💡 " + b.ipuclari[ipucuKademe++]);
          } else if (tahmin) {
            yaz("💡 " + b.ipuclari[b.ipuclari.length - 1]);
          } else if (ipucuD.dataset.onay) {
            delete ipucuD.dataset.onay;
            ipucuD.textContent = "💡";
            bastanAl();
            program = idVer(b.cozum);
            cozumGosterildi = true;
            cizProgram();
            yaz("İşte bir çözüm! Çalıştır'a basıp izle, sonra nasıl çalıştığını düşün.");
          } else {
            ipucuD.dataset.onay = "1";
            ipucuD.textContent = "💡 Çözümü göster";
            yaz("Bir daha basarsan çözümü gösteririm (1 yıldız).");
          }
        }

        // ---------- Tahmin ----------
        function tahminEt(x, y) {
          if (calisiyor || bitti) return;
          tahminDeneme++;
          const c = G.hucre(x, y);
          c.classList.add("isaret");
          baslat();
          otomatik = true;
          const son = () => {
            c.classList.remove("isaret");
            if (x === b.cevap.x && y === b.cevap.y) return kazandi(tahminDeneme === 1 ? 3 : 2);
            ctx.ses.yanlis();
            G.hucre(b.cevap.x, b.cevap.y).classList.add("isaret");
            if (tahminDeneme >= 2) {
              bitti = true;
              yaz("Tıkır burada durdu. Kodu bir daha oku!");
              UI.ilerleme.yaz("ayaz", no, 1);
              return z.sonra(() => ctx.bitir({ yildiz: 1, metin: "Bölüm " + no + " tamam!" }), 2600);
            }
            yaz("Tıkır burada durdu. Bir daha dene: kodu blok blok takip et.");
            z.sonra(() => {
              G.hucre(b.cevap.x, b.cevap.y).classList.remove("isaret");
              basaDon();
              calisiyor = false; // kilit sıfırlamadan sonra açılır
            }, 2600);
          };
          const tahminDongu = () => {
            const n = it.next();
            if (n.done) {
              otomatik = false;
              it = null;
              vurgula(null, "calisan");
              return son();
            }
            const o = n.value;
            vurgula(o.id, "calisan");
            if (o.tur === "adim" || o.tur === "don") G.robotKoy(o.robot);
            else if (o.tur === "sensor") G.sensor(o.acik, o.x, o.y);
            else if (o.tur === "tur") {
              const t = progEl.querySelector(`[data-id="${o.kapId}"] > .kd-blok-bas .kd-tur`);
              if (t) t.textContent = o.toplam ? `${o.toplam} tekrardan ${o.kac}.` : `${o.kac}. tur`;
            }
            z.sonra(tahminDongu, HIZ[hiz]);
          };
          z.sonra(tahminDongu, 300);
        }
        if (tahmin)
          for (let y = 0; y < dunya0.yuk; y++)
            for (let x = 0; x < dunya0.gen; x++) {
              if (dunya0.duvar.has(x + "," + y) || (x === dunya0.robot.x && y === dunya0.robot.y)) continue;
              const c = G.hucre(x, y);
              c.classList.add("secilebilir");
              c.addEventListener("click", () => tahminEt(x, y));
            }

        cizProgram();
        ctx.konus(b.yonerge);
      }

      haritaGoster();
      return () => {
        z.temizle();
        temizSurukle();
        ctx.sustur();
      };
    },
  });
})();
