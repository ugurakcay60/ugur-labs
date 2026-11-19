// Kodlama oyunlarının ortak arayüzü: Tıkır, ızgara, bölüm haritası, ilerleme kaydı.
(function () {
  "use strict";
  const { h } = OE;

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

  // ---------- İlerleme: { ada: { acik, yildiz: { no: 1..3 } }, ayaz: {...} } ----------
  const ANAHTAR = "cocuk-oyunlari:kodlama";
  function hepsi() {
    try {
      const v = JSON.parse(localStorage.getItem(ANAHTAR) || "{}");
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch {
      return {};
    }
  }
  const ilerleme = {
    oku(cocuk) {
      const k = hepsi()[cocuk] || {};
      const acik = Number.isInteger(k.acik) && k.acik > 0 ? k.acik : 1;
      const yildiz = k.yildiz && typeof k.yildiz === "object" ? k.yildiz : {};
      return { acik, yildiz };
    },
    yaz(cocuk, no, yildiz) {
      const v = hepsi();
      const k = ilerleme.oku(cocuk);
      k.yildiz[no] = Math.max(k.yildiz[no] || 0, yildiz);
      k.acik = Math.max(k.acik, no + 1);
      v[cocuk] = k;
      try {
        localStorage.setItem(ANAHTAR, JSON.stringify(v));
      } catch {}
    },
  };

  // ---------- Tıkır ----------
  const TIKIR_SVG = `<svg class="kd-tikir" viewBox="0 0 100 100" aria-hidden="true">
    <line x1="50" y1="22" x2="50" y2="9" stroke="#5b6b8c" stroke-width="4" stroke-linecap="round"/>
    <circle class="kd-anten" cx="50" cy="8" r="6"/>
    <rect x="14" y="20" width="72" height="66" rx="30" fill="#9fb3d1" stroke="#41506e" stroke-width="4"/>
    <rect x="24" y="32" width="52" height="32" rx="14" fill="#25304a"/>
    <circle class="kd-goz" cx="38" cy="48" r="7"/>
    <circle class="kd-goz" cx="62" cy="48" r="7"/>
    <path d="M40 74 Q50 80 60 74" stroke="#41506e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="6" y="48" width="10" height="20" rx="5" fill="#7d91b3"/>
    <rect x="84" y="48" width="10" height="20" rx="5" fill="#7d91b3"/>
  </svg>`;
  const tikir = () => {
    const kap = h("span.kd-tikir-kap");
    kap.innerHTML = TIKIR_SVG;
    return kap;
  };
  const GOZ = { mutlu: "#3ddc84", dusunuyor: "#ffd23f", dans: "#b06cff", hata: "#ff5a5f", mavi: "#4cc3ff" };

  // ---------- Izgara ----------
  // goreli: Tıkır'ın baktığı yönü ve sensör konisini göster (Ayaz)
  function izgara(dunya, tema, { goreli = false, z } = {}) {
    const zz = z || zamanlayici();
    const kap = h("div.kd-izgara-kap");
    const el = h("div.kd-izgara", { stil: `--kd-gen:${dunya.gen};--kd-yuk:${dunya.yuk};--kd-zemin:${tema.zemin};--kd-cizgi:${tema.cizgi || "rgba(0,0,0,0.08)"}` });
    const hucreler = {};
    for (let y = 0; y < dunya.yuk; y++)
      for (let x = 0; x < dunya.gen; x++) {
        const k = x + "," + y;
        let ic = null;
        if (dunya.duvar.has(k)) ic = h("span.kd-esya.kd-duvar", tema.duvar);
        else if (dunya.toplanacak.has(k)) ic = h("span.kd-esya.kd-topla", tema.topla);
        else if (dunya.hedef && dunya.hedef.x === x && dunya.hedef.y === y) ic = h("span.kd-esya.kd-hedef", tema.hedef);
        const c = h("div.kd-hucre" + (dunya.duvar.has(k) ? ".dolu" : ""), { "data-x": x, "data-y": y }, ic);
        hucreler[k] = c;
        el.append(c);
      }
    const koni = goreli ? h("span.kd-koni") : null;
    const yonOk = goreli ? h("span.kd-yon", koni, h("span.kd-burun")) : null;
    const balon = h("span.kd-balon");
    const robot = h("div.kd-robot", yonOk, tikir(), balon);
    el.append(robot);
    kap.append(el);

    let aci = dunya.robot.yon * 90; // birikimli: 270 → 0 geçişinde ters dönmesin
    let gozundenAcik = false;
    const cevir = () => {
      el.style.setProperty("--kd-don", gozundenAcik ? -aci + "deg" : "0deg");
      // dikdörtgen ızgara 90° dönünce kabın yüksekliği uzun kenara göre ayarlanır
      const yan = gozundenAcik && Math.abs(Math.round(aci / 90)) % 2 === 1 && dunya.gen !== dunya.yuk;
      kap.style.height = yan ? Math.max(el.offsetWidth, el.offsetHeight) + 12 + "px" : "";
    };
    function robotKoy(r, anim = true) {
      if (!anim) robot.classList.add("anlik");
      const fark = ((r.yon * 90 - aci) % 360 + 540) % 360 - 180;
      aci += fark;
      robot.style.transform = `translate(${r.x * 100}%, ${r.y * 100}%)`;
      if (yonOk) yonOk.style.transform = `rotate(${aci}deg)`;
      cevir();
      if (!anim) {
        void robot.offsetWidth;
        robot.classList.remove("anlik");
      }
    }
    const sinifAn = (e, sinif, ms) => {
      e.classList.remove(sinif);
      void e.offsetWidth;
      e.classList.add(sinif);
      zz.sonra(() => e.classList.remove(sinif), ms);
    };
    const api = {
      el: kap,
      izgaraEl: el,
      robotKoy,
      hucre: (x, y) => hucreler[x + "," + y],
      topla(x, y) {
        const e = hucreler[x + "," + y] && hucreler[x + "," + y].querySelector(".kd-topla");
        if (e) e.classList.add("alindi");
      },
      goz(renk) {
        robot.style.setProperty("--goz", GOZ[renk] || renk || GOZ.mutlu);
      },
      carp() {
        sinifAn(robot, "sars", 450);
      },
      dans() {
        api.goz("dans");
        sinifAn(robot, "dans", 1600);
      },
      balon(metin, ms = 1200) {
        balon.textContent = metin;
        sinifAn(balon, "gor", ms);
      },
      sensor(acik, x, y) {
        if (koni) sinifAn(koni, acik ? "acik" : "kapali", 450);
        const c = hucreler[x + "," + y];
        if (c) sinifAn(c, acik ? "tara-acik" : "tara-kapali", 450);
      },
      // zamanlayıcılar iptal edilince takılı kalabilecek görsel durumları temizler
      sifirla() {
        kap.querySelectorAll(".sars, .dans, .gor, .acik, .kapali, .tara-acik, .tara-kapali").forEach((e) =>
          e.classList.remove("sars", "dans", "gor", "acik", "kapali", "tara-acik", "tara-kapali")
        );
      },
      gozundenBak(acik) {
        gozundenAcik = acik;
        cevir();
      },
    };
    robotKoy(dunya.robot, false);
    api.goz("mutlu");
    return api;
  }

  // ---------- Bölüm haritası ----------
  // bolumler: tema ve (Ayaz'da) kavram alanlı liste; sec(no) 1-tabanlı
  function harita(sahne, { cocuk, bolumler, temalar, sec, ek }) {
    const ada = cocuk === "ada";
    const k = ilerleme.oku(cocuk);
    const gruplar = [];
    bolumler.forEach((b, i) => {
      if (!gruplar.length || gruplar[gruplar.length - 1].tema !== b.tema) gruplar.push({ tema: b.tema, liste: [] });
      gruplar[gruplar.length - 1].liste.push(i + 1);
    });
    const yildiz = (n) => h("span.kd-yildiz", "★".repeat(n), h("i", "★".repeat(3 - n)));
    const tumu = h(
      "div.kd-harita",
      tikir(),
      gruplar.map((g) => {
        const t = temalar[g.tema];
        return h(
          "section.kd-dunya",
          { stil: `--kd-zemin:${t.zemin}` },
          h("h2", h("span.emo", t.topla), ada ? null : " " + t.ad),
          h(
            "div.kd-bolumler",
            g.liste.map((no) => {
              const b = bolumler[no - 1];
              const kilitli = no > k.acik;
              const simge = b.tur === "tahmin" ? "❓" : b.tur === "hatabul" ? "🔧" : t.hedef;
              return h(
                "button.kd-bolum-dugme" + (kilitli ? ".kilitli" : "") + (no === k.acik ? ".siradaki" : ""),
                {
                  type: "button",
                  disabled: kilitli,
                  "aria-label": "Bölüm " + no + (kilitli ? " (kilitli)" : ""),
                  onclick: () => sec(no),
                },
                h("span.kd-bolum-no", kilitli ? "🔒" : ada ? simge : no),
                ada ? null : h("span.kd-bolum-ad", b.kavram),
                yildiz(k.yildiz[no] || 0)
              );
            })
          )
        );
      }),
      ek || null
    );
    sahne.replaceChildren(tumu);
    return tumu;
  }

  // ---------- Ekransız oyun: İnsan robot ----------
  const INSAN_YONERGE =
    "İnsan robot oyunu! Anne ya da baba robot olur. Sen okları sırayla söyle ya da göster; robot yalnızca söyleneni yapar. Yanlış giderse hatayı birlikte bulun!";
  const KOMUTLAR = [
    { isaret: "➜", don: -90, renk: "#2fb36b", soz: "İleri!" },
    { isaret: "↻", don: 0, renk: "#e8483f", soz: "Sağa dön!" },
    { isaret: "↺", don: 0, renk: "#f2b630", soz: "Sola dön!" },
    { isaret: "🦘", don: 0, renk: "#8b5cf6", soz: "Zıpla!" },
  ];
  function insanRobot(ctx, ada) {
    const ic = h(
      "div.kd-insan-ic",
      { hidden: true },
      ada ? null : h("p.kd-yonerge", INSAN_YONERGE),
      h(
        "div.kd-oklar",
        KOMUTLAR.map((k) =>
          h(
            "button.kd-ok",
            { type: "button", stil: `background:${k.renk}`, "aria-label": k.soz, onclick: () => (ctx.ses.tik(), ctx.konus(k.soz)) },
            h("span.kd-ok-ic", { stil: `transform:rotate(${k.don}deg)` }, k.isaret)
          )
        )
      )
    );
    const ac = h(
      "button.dugme.ikincil",
      {
        type: "button",
        onclick: () => {
          ic.hidden = !ic.hidden;
          if (!ic.hidden) ctx.konus(INSAN_YONERGE);
        },
      },
      h("span.emo", "🧍"),
      " İnsan robot"
    );
    return h("section.kd-dunya.kd-insan-kart", { stil: "--kd-zemin:var(--gunes-acik)" }, ac, ic);
  }

  OE.kodUI = { zamanlayici, ilerleme, tikir, izgara, harita, insanRobot, GOZ };
})();
