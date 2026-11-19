// Kodlama: Tıkır'a Yol Göster (Ada) — mutlak oklarla "ok treni" kurulur, Tıkır sırayla yürür.
(function () {
  "use strict";
  const { h } = OE;
  const UI = OE.kodUI;
  const K = OE.kod;
  const D = OE.kodBolumler;

  // Ok renkleri veri olarak sabit (Cubetto benzeri renk kodu)
  const OKLAR = [
    { yon: 0, isaret: "➜", don: -90, renk: "#2fb36b", soz: "Yukarı!" },
    { yon: 1, isaret: "➜", don: 0, renk: "#e8483f", soz: "Sağa!" },
    { yon: 2, isaret: "➜", don: 90, renk: "#3d7be0", soz: "Aşağı!" },
    { yon: 3, isaret: "➜", don: 180, renk: "#f2b630", soz: "Sola!" },
  ];
  const okIsaret = (ok) => h("span.kd-ok-ic", { stil: `transform:rotate(${ok.don}deg)` }, ok.isaret);
  const MAKS = 6; // trendeki en çok vagon
  const ADIM = 700; // bir adımın süresi (ms)
  const UNUTULAN = { bahce: "Elmayı", deniz: "Deniz kabuğunu", uzay: "Yıldızı" };
  const sessiz = { kaydet: false };

  // Hazır programa (hata bul / tahmin) yeni id'ler ver
  const idVer = (p) => p.map((b) => ({ ...b, id: K.yeniId(), ic: b.ic && idVer(b.ic) }));
  // Bir vagonun ilk oku (tekrar kartında içteki ok)
  const vagonOku = (b) => OKLAR[(b.t === "tekrar" ? b.ic[0] : b).yon];

  OE.ekle({
    id: "yolgoster",
    ad: "Tıkır'a Yol Göster",
    simge: "🤖",
    cocuk: "ada",
    grup: "Kodlama",
    aciklama: "Okları sırala, Tıkır'ı yürüt!",
    puanli: false,
    baslat(sahne, ctx) {
      const z = UI.zamanlayici();
      // Geri bildirimler 🔊 ile tekrar okunmaz; 🔊 hep bölüm yönergesini okur
      const konus = (m) => ctx.konus(m, "tr-TR", sessiz);

      function haritaGoster() {
        z.temizle();
        UI.harita(sahne, { cocuk: "ada", bolumler: D.ADA, temalar: D.TEMALAR, sec: oyna, ek: OE.kodUI.insanRobot && OE.kodUI.insanRobot(ctx, true) });
        ctx.konus("Hangi bölümü oynayalım? Parlayan kareye dokun!");
      }

      function oyna(no) {
        z.temizle();
        const b = D.ADA[no - 1];
        const tema = D.TEMALAR[b.tema];
        const tahmin = b.tur === "tahmin";
        const kezVar = b.bloklar.includes("tekrar");
        const dunya0 = K.dunyaKur(b);
        const G = UI.izgara(dunya0, tema, { z });
        let tren = b.hazir ? idVer(b.hazir) : [];
        let deneme = 0;
        let ipucuVerildi = false;
        let calisiyor = false;
        let kezModu = false;
        let tahminDeneme = 0;
        let secili = null; // dokunulmuş vagon: sonraki ok onu değiştirir, ikinci dokunuş siler
        let degisti = false; // hata bul: değiştirilmemiş hazır programla çalıştırma deneme sayılmaz

        const trenEl = h("div.kd-tren", { "aria-label": "Ok treni" });
        const okDugmeleri = OKLAR.map((ok) =>
          h("button.kd-ok", { type: "button", stil: `background:${ok.renk}`, "aria-label": ok.soz, onclick: () => okEkle(ok) }, okIsaret(ok))
        );
        const kezDugme = kezVar ? h("button.kd-ok.kez", { type: "button", "aria-label": "İki kez", onclick: kezSec }, "×2") : null;
        const baslaDugme = h("button.kd-basla", { type: "button", "aria-label": "Başla", onclick: basla }, "▶");
        const alt = tahmin ? null : h("div.kd-alt", h("div.kd-oklar", okDugmeleri, kezDugme), baslaDugme);

        sahne.replaceChildren(
          h(
            "div.kd-oyun",
            h(
              "div.kd-ust",
              h("button.dugme.ikincil.kucuk", { type: "button", "aria-label": "Bölümlere dön", onclick: haritaGoster }, h("span.emo", "🗺️")),
              h("span.kd-yildiz", { "aria-hidden": "true" }, tema.topla + " " + no)
            ),
            G.el,
            trenEl,
            alt
          )
        );

        function kilitle(k) {
          calisiyor = k;
          [...okDugmeleri, kezDugme, baslaDugme].forEach((d) => d && (d.disabled = k));
          cizTren();
        }

        function cizTren() {
          const vagonlar = tren.map((v) => {
            const ok = vagonOku(v);
            return h(
              "button.kd-vagon" + (v.id === secili ? ".secili" : ""),
              {
                type: "button",
                "data-id": v.id,
                stil: `background:${ok.renk}`,
                "aria-label": ok.soz + (v.t === "tekrar" ? " iki kez" : ""),
                disabled: calisiyor || tahmin,
                onclick: () => vagonDokun(v.id),
              },
              okIsaret(ok),
              v.t === "tekrar" ? h("span.kd-kez", "×2") : null
            );
          });
          const bos = !tahmin && tren.length < MAKS ? h("span.kd-vagon.bos", { "aria-hidden": "true" }, kezModu ? "×2" : "") : null;
          trenEl.replaceChildren(...vagonlar, bos || "");
        }
        const vagonEl = (id) => {
          const ust = tren.find((v) => v.id === id || (v.ic && v.ic.some((x) => x.id === id)));
          return ust && trenEl.querySelector(`[data-id="${ust.id}"]`);
        };

        function okEkle(ok) {
          if (calisiyor) return;
          const sec = secili != null && tren.find((v) => v.id === secili);
          if (sec) {
            (sec.t === "tekrar" ? sec.ic[0] : sec).yon = ok.yon;
            secili = null;
            degisti = true;
            konus(ok.soz);
            ctx.ses.tik();
            return cizTren();
          }
          degisti = true;
          if (tren.length >= MAKS) return konus("Tren doldu! Bir vagona iki kez dokunup çıkarabilirsin.");
          const tek = { id: K.yeniId(), t: "git", yon: ok.yon };
          tren.push(kezModu ? { id: K.yeniId(), t: "tekrar", n: 2, ic: [tek] } : tek);
          konus(kezModu ? "İki kez " + ok.soz.toLowerCase() : ok.soz);
          kezModu = false;
          if (kezDugme) kezDugme.classList.remove("secili");
          ctx.ses.tik();
          cizTren();
        }
        function kezSec() {
          if (calisiyor) return;
          kezModu = !kezModu;
          kezDugme.classList.toggle("secili", kezModu);
          if (kezModu) konus("İki kez! Şimdi bir ok seç.");
          cizTren();
        }
        function vagonDokun(id) {
          if (calisiyor || tahmin) return;
          if (secili === id) {
            tren = tren.filter((v) => v.id !== id);
            secili = null;
            degisti = true;
            konus("Çıkardım!");
          } else {
            secili = id;
            konus("Bu vagon hangi ok olsun? Çıkarmak için bir daha dokun.");
          }
          ctx.ses.tik();
          cizTren();
        }

        function basaDon(anim = true) {
          G.sifirla();
          G.robotKoy(dunya0.robot, anim);
          G.goz("mutlu");
          G.el.querySelectorAll(".kd-topla.alindi").forEach((e) => e.classList.remove("alindi"));
        }

        // Programı adım adım oynatır; bitince bitince(sonuc, dunya)
        function oynat(bitince) {
          kilitle(true);
          basaDon(false);
          const d = K.dunyaKur(b);
          const it = K.calistir(tren, d, { otoTopla: true });
          const adim = () => {
            trenEl.querySelectorAll(".aktif").forEach((e) => e.classList.remove("aktif"));
            const s = it.next();
            if (s.done) return bitince(s.value, d);
            const o = s.value;
            const v = vagonEl(o.id);
            if (v) v.classList.add("aktif");
            if (o.tur === "adim") {
              G.robotKoy(o.robot);
              ctx.ses.tik();
              const blok = K.bul(tren, o.id);
              if (blok) ctx.konus(OKLAR[blok.blok.yon].soz, "tr-TR", sessiz);
            } else if (o.tur === "topla") {
              G.topla(o.x, o.y);
              ctx.ses.dogru();
            } else if (o.tur === "carp") G.carp();
            z.sonra(adim, o.tur === "tur" ? 250 : ADIM);
          };
          z.sonra(adim, 300);
        }

        function kazandi(yildiz) {
          G.dans();
          ctx.ses.kutlama();
          konus("Yaşasın! Tıkır vardı!");
          UI.ilerleme.yaz("ada", no, yildiz);
          z.sonra(() => ctx.bitir({ yildiz, metin: "Bölüm " + no + " tamam!" }), 1800);
        }

        // Çarpmada çarptıran vagonu, eksik kaldıysa en kısa yoldaki sıradaki oku gösterir
        function ipucu(r) {
          if (calisiyor) return;
          ipucuVerildi = true;
          const parlat = (e) => {
            if (!e) return;
            e.classList.add("ipucu");
            z.sonra(() => e.classList.remove("ipucu"), 2600);
          };
          if (r.sonuc === "carpti") {
            parlat(vagonEl(r.id));
            return konus("Bu ok Tıkır'ı çarptırıyor. Ona dokun, sonra doğru oku seç!");
          }
          if (tren.length >= MAKS) {
            parlat(trenEl.querySelector(".kd-vagon:not(.bos):last-of-type"));
            return konus("Tren doldu. Bir vagona iki kez dokunup çıkar!");
          }
          const yon = K.yolBul(K.sonucu(tren, b, { otoTopla: true }).dunya);
          if (yon == null) return;
          parlat(okDugmeleri[yon]);
          konus("Parlayan oku dene!");
        }

        function basla() {
          if (calisiyor || tahmin) return;
          if (!tren.length) return konus("Önce bir ok seç!");
          secili = null;
          if (b.tur !== "hatabul" || degisti) deneme++;
          oynat((r) => {
            if (r.sonuc === "hedef") return kazandi(deneme <= 1 ? 3 : ipucuVerildi ? 1 : 2);
            if (r.sonuc === "carpti") {
              const v = vagonEl(r.id);
              if (v) v.classList.add("hatali");
              ctx.ses.yanlis();
              G.goz("hata");
              konus("Bu ok nereye gidiyor? Bir daha bakalım.");
            } else {
              ctx.ses.yanlis();
              G.goz("dusunuyor");
              const d = K.sonucu(tren, b, { otoTopla: true }).dunya;
              konus(d.toplanacak.size ? UNUTULAN[b.tema] + " unuttuk!" : "Tıkır daha varmadı. Bir ok daha ekle!");
            }
            z.sonra(() => {
              kilitle(false);
              basaDon();
              if (deneme >= 3) z.sonra(() => ipucu(r), 500);
            }, 1600);
          });
        }

        // Tahmin: kareye dokun, sonra program oynar
        function tahminEt(x, y) {
          if (calisiyor) return;
          tahminDeneme++;
          const c = G.hucre(x, y);
          c.classList.add("isaret");
          oynat(() => {
            c.classList.remove("isaret");
            if (x === b.cevap.x && y === b.cevap.y) return kazandi(tahminDeneme === 1 ? 3 : 2);
            ctx.ses.yanlis();
            G.hucre(b.cevap.x, b.cevap.y).classList.add("isaret");
            if (tahminDeneme >= 2) {
              konus("Tıkır buraya varmış! Bir dahakine bilirsin.");
              UI.ilerleme.yaz("ada", no, 1);
              return z.sonra(() => ctx.bitir({ yildiz: 1, metin: "Bölüm " + no + " tamam!" }), 2600);
            }
            konus("Tıkır buraya varmış! Bir daha deneyelim.");
            z.sonra(() => {
              G.hucre(b.cevap.x, b.cevap.y).classList.remove("isaret");
              kilitle(false);
              basaDon();
            }, 2600);
          });
        }
        if (tahmin)
          for (let y = 0; y < dunya0.yuk; y++)
            for (let x = 0; x < dunya0.gen; x++) {
              const c = G.hucre(x, y);
              if (dunya0.duvar.has(x + "," + y) || (x === dunya0.robot.x && y === dunya0.robot.y)) continue;
              c.classList.add("secilebilir");
              c.addEventListener("click", () => tahminEt(x, y));
            }

        cizTren();
        ctx.konus(b.yonerge);
      }

      haritaGoster();
      return () => {
        z.temizle();
        ctx.sustur();
      };
    },
  });
})();
