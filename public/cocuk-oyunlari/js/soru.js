// Çoktan seçmeli soru motoru. Oyunlar yalnızca soru üretir; ilerleme, puan, geri bildirim ve klavye burada.
//
// OE.soruOyunu({ uret(seviye, sira, ctx), soruSayisi = 10, tekrarDene = ctx.ada, sureli = false }) → baslat(sahne, ctx)
// Soru nesnesi:
//   metin       ekranda yazan soru (HTML olabilir)
//   sesli, dil  okunacak metin ve dili (Ada'da kendiliğinden okunur; Ayaz'da 🔊 ile ya da sesliHep ile)
//   gorsel      sorunun üstündeki görsel (HTML dizesi ya da düğüm)
//   secenekler  [{ html, dogru, etiket }] — sirali verilmezse karıştırılır
//   tur         seçenek düzeni: "buyuk" (emoji/resim), "rakam", "grup", "metin" (uzun yazı)
//   denklem     metni büyük matematik yazısıyla göster
//   anahtar     aynı turda tekrar sorulmasın diye kimlik
//   aciklama    yanlış cevaptan sonra gösterilen kısa açıklama
//   dogruSesli, dogruDil   doğru cevapta okunacak cümle (yoksa kısa bir övgü)
(function () {
  "use strict";
  const { h, yard } = OE;
  const { sec, karistir, sureBicim } = yard;
  const OVGU_ADA = ["Aferin!", "Harika!", "Süpersin!", "Bravo!", "Çok güzel!", "Muhteşem!"];
  const OVGU_AYAZ = ["Doğru!", "Harika!", "Süper!", "Tam isabet!", "Bravo!", "Çok iyi!"];
  const TEKRAR = ["Tekrar dene!", "Bir daha bak!", "Neredeyse! Bir daha dene."];

  const duzMetin = (html) => {
    const d = document.createElement("div");
    d.innerHTML = html || "";
    return d.textContent.trim();
  };

  OE.soruOyunu = (ayar) =>
    function baslat(sahne, ctx) {
      const N = ayar.soruSayisi || 10;
      const tekrarDene = ayar.tekrarDene != null ? ayar.tekrarDene : ctx.ada;
      const goruldu = new Set();
      const t0 = Date.now();
      let sira = 0;
      let dogru = 0;
      let aktif = true;
      let zaman = null;
      let saat = null;
      let devam = null;

      const dolgu = h("span");
      const ilerleme = h("div.ilerleme", { "aria-hidden": "true" }, dolgu);
      const sayac = h("span.soru-sayac");
      const sure = ayar.sureli ? h("span.sure", "0:00") : null;
      const metin = h("p.soru-metin", { "aria-live": "polite" });
      const gorsel = h("div.soru-gorsel");
      const secenekler = h("div.secenekler");
      const alt = h("div.soru-alt");
      sahne.replaceChildren(h("div.soru-oyunu", h("div.soru-ust", sayac, ilerleme, sure), metin, gorsel, secenekler, alt));
      if (sure) saat = setInterval(() => (sure.textContent = sureBicim(Date.now() - t0)), 500);

      function uret() {
        for (let d = 0; d < 40; d++) {
          const s = ayar.uret(ctx.seviye, sira, ctx);
          if (!s.anahtar || !goruldu.has(s.anahtar)) {
            if (s.anahtar) goruldu.add(s.anahtar);
            return s;
          }
        }
        goruldu.clear(); // havuz bitti, yeni tur
        return ayar.uret(ctx.seviye, sira, ctx);
      }

      function sutunSayisi(s) {
        const n = s.secenekler.length;
        if (s.sutun) return s.sutun;
        if (s.tur === "metin") return 1;
        if (s.tur === "buyuk" || s.tur === "rakam") return n <= 4 ? n : 3;
        const uzun = s.secenekler.some((x) => duzMetin(x.html).length > 26);
        return uzun ? 1 : 2;
      }

      function goster(s) {
        devam = null;
        sayac.textContent = `${sira + 1} / ${N}`;
        dolgu.style.width = (sira / N) * 100 + "%";
        metin.className = "soru-metin" + (s.denklem ? " denklem" : "");
        metin.innerHTML = s.metin || "";
        gorsel.replaceChildren();
        if (s.gorsel) {
          if (typeof s.gorsel === "string") gorsel.innerHTML = s.gorsel;
          else gorsel.append(s.gorsel);
        }
        gorsel.hidden = !s.gorsel;
        secenekler.className = "secenekler" + (s.tur ? " " + s.tur : "");
        secenekler.style.setProperty("--sutun", sutunSayisi(s));
        alt.replaceChildren();

        const liste = s.sirali ? s.secenekler : karistir(s.secenekler);
        let hata = false;
        let bitti = false;
        let dogruDugme = null;
        secenekler.replaceChildren(
          ...liste.map((sc, i) => {
            const b = h("button.secenek", { type: "button", html: sc.html, "aria-label": sc.etiket || null });
            if (!ctx.ada && liste.length <= 9) b.prepend(h("kbd.tus", { "aria-hidden": "true" }, String(i + 1)));
            if (sc.dogru) dogruDugme = b;
            b.addEventListener("click", () => {
              if (bitti || !aktif) return;
              if (sc.dogru) {
                bitti = true;
                b.classList.add("dogru");
                ctx.ses.dogru();
                if (!hata) dogru++;
                const ovgu = sec(ctx.ada ? OVGU_ADA : OVGU_AYAZ);
                if (s.dogruSesli) ctx.konus(s.dogruSesli, s.dogruDil || "tr-TR", { kaydet: false });
                else if (ctx.ada) ctx.konus(ovgu, "tr-TR", { kaydet: false });
                if (!ctx.ada) alt.replaceChildren(h("p.geri-bildirim.iyi", ovgu));
                zaman = setTimeout(sonraki, ctx.ada ? (s.dogruSesli ? 2000 : 1200) : s.dogruSesli ? 1300 : 750);
              } else {
                hata = true;
                b.classList.add("yanlis");
                b.disabled = true;
                ctx.ses.yanlis();
                if (tekrarDene) {
                  if (ctx.ada) ctx.konus(sec(TEKRAR), "tr-TR", { kaydet: false });
                  else alt.replaceChildren(h("p.geri-bildirim", "Bir daha dene."));
                } else {
                  bitti = true;
                  dogruDugme.classList.add("dogru");
                  secenekler.querySelectorAll("button").forEach((x) => (x.disabled = true));
                  devam = h("button.dugme", { type: "button", onclick: sonraki }, sira + 1 < N ? "Devam" : "Bitir");
                  alt.replaceChildren(h("p.geri-bildirim.kotu", h("strong", "Doğru cevap yeşil olan. "), s.aciklama || ""), devam);
                  devam.focus({ preventScroll: true });
                }
              }
            });
            return b;
          })
        );
        const okunacak = s.sesli || duzMetin(s.metin);
        ctx.konus(okunacak, s.dil || "tr-TR", { sessiz: !(ctx.ada || s.sesliHep) });
      }

      function sonraki() {
        clearTimeout(zaman);
        if (!aktif) return;
        sira++;
        if (sira >= N) {
          aktif = false;
          clearInterval(saat);
          ctx.bitir({ dogru, toplam: N, sure: ayar.sureli ? Date.now() - t0 : null });
        } else goster(uret());
      }

      function tus(e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (/^[1-9]$/.test(e.key)) {
          const b = secenekler.children[+e.key - 1];
          if (b && !b.disabled) b.click();
        } else if (e.key === "Enter" && devam && devam.isConnected && document.activeElement !== devam) {
          e.preventDefault();
          devam.click();
        }
      }
      document.addEventListener("keydown", tus);
      goster(uret());
      return () => {
        aktif = false;
        clearTimeout(zaman);
        clearInterval(saat);
        document.removeEventListener("keydown", tus);
      };
    };

  // Sayı cevaplı sorular için yakın ve inandırıcı yanlış seçenekler
  OE.sayiSecenekleri = function (dogruCevap, adaylar, { n = 4, bicimle = yard.bicim, sonek = "" } = {}) {
    const kume = new Set([dogruCevap]);
    for (const a of karistir(adaylar)) {
      if (kume.size >= n) break;
      if (Number.isInteger(a) && a >= 0 && a !== dogruCevap) kume.add(a);
    }
    for (let fark = 1; kume.size < n; fark++) {
      const a = dogruCevap + (Math.random() < 0.5 ? -1 : 1) * fark;
      if (a >= 0) kume.add(a);
    }
    return [...kume].map((x) => ({ html: bicimle(x) + sonek, dogru: x === dogruCevap }));
  };
})();
