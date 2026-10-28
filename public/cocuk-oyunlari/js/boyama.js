// Resim Yap (Ada): fırça, boya kovası, silgi, damga ve hazır boyama sayfaları.
// İki katman: alttaki "boya" tuvali çizim ve dolgular, üstteki "çizgi" tuvali sayfa kenar çizgileri (dokunmayı geçirir).
(function () {
  "use strict";
  const { h } = OE;
  const W = 1000;
  const H = 750;
  const PALET = ["#E53935", "#FB8C00", "#FDD835", "#43A047", "#00ACC1", "#1E88E5", "#8E24AA", "#F48FB1", "#8D6E63", "#9E9E9E", "#263238", "#FFFFFF"];
  const DAMGA = ["⭐", "❤️", "🌸", "🦋", "🐞", "🌈", "☀️", "🐱"];
  const KALINLIK = [10, 22, 44];

  // Boyama sayfaları: kalın siyah kenar çizgileri
  const SAYFA = {
    bos: { simge: "⬜", ad: "Boş sayfa", ciz() {} },
    ev: {
      simge: "🏠",
      ad: "Ev",
      ciz(c) {
        c.strokeRect(300, 340, 400, 320);
        yol(c, [[250, 350], [500, 150], [750, 350]], true);
        c.strokeRect(455, 500, 90, 160);
        c.strokeRect(340, 400, 90, 80);
        c.strokeRect(570, 400, 90, 80);
        cizgi(c, 385, 400, 385, 480);
        cizgi(c, 340, 440, 430, 440);
        cizgi(c, 615, 400, 615, 480);
        cizgi(c, 570, 440, 660, 440);
        daire(c, 140, 130, 65);
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          cizgi(c, 140 + 85 * Math.cos(a), 130 + 85 * Math.sin(a), 140 + 115 * Math.cos(a), 130 + 115 * Math.sin(a));
        }
        cizgi(c, 40, 660, 960, 660);
        bulut(c, 820, 140);
      },
    },
    balik: {
      simge: "🐟",
      ad: "Balık",
      ciz(c) {
        c.beginPath();
        c.ellipse(470, 390, 260, 150, 0, 0, Math.PI * 2);
        c.stroke();
        yol(c, [[715, 390], [900, 250], [900, 530]], true);
        daire(c, 330, 350, 26);
        daire(c, 330, 350, 8);
        c.beginPath();
        c.moveTo(520, 228);
        c.quadraticCurveTo(580, 390, 520, 552);
        c.moveTo(620, 260);
        c.quadraticCurveTo(670, 390, 620, 520);
        c.stroke();
        yol(c, [[430, 245], [500, 160], [570, 255]], false);
        daire(c, 170, 200, 26);
        daire(c, 215, 120, 18);
        daire(c, 150, 80, 12);
        c.beginPath();
        c.moveTo(80, 740);
        c.quadraticCurveTo(40, 640, 90, 560);
        c.moveTo(130, 740);
        c.quadraticCurveTo(170, 650, 120, 580);
        c.stroke();
      },
    },
    cicek: {
      simge: "🌸",
      ad: "Çiçek",
      ciz(c) {
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          daire(c, 500 + 115 * Math.cos(a), 270 + 115 * Math.sin(a), 72);
        }
        daire(c, 500, 270, 62);
        cizgi(c, 500, 450, 500, 620);
        c.beginPath();
        c.ellipse(420, 540, 80, 32, -0.5, 0, Math.PI * 2);
        c.stroke();
        c.beginPath();
        c.ellipse(580, 520, 80, 32, 0.5, 0, Math.PI * 2);
        c.stroke();
        yol(c, [[380, 620], [620, 620], [580, 730], [420, 730]], true);
        cizgi(c, 395, 660, 605, 660);
      },
    },
    kelebek: {
      simge: "🦋",
      ad: "Kelebek",
      ciz(c) {
        const kanat = (x, y, rx, ry, don) => {
          c.beginPath();
          c.ellipse(x, y, rx, ry, don, 0, Math.PI * 2);
          c.stroke();
        };
        kanat(330, 290, 165, 115, -0.5);
        kanat(670, 290, 165, 115, 0.5);
        kanat(370, 520, 115, 85, 0.5);
        kanat(630, 520, 115, 85, -0.5);
        daire(c, 290, 270, 45);
        daire(c, 710, 270, 45);
        daire(c, 360, 530, 32);
        daire(c, 640, 530, 32);
        c.beginPath();
        c.ellipse(500, 420, 32, 190, 0, 0, Math.PI * 2);
        c.stroke();
        daire(c, 500, 195, 42);
        c.beginPath();
        c.moveTo(485, 160);
        c.quadraticCurveTo(450, 80, 400, 70);
        c.moveTo(515, 160);
        c.quadraticCurveTo(550, 80, 600, 70);
        c.stroke();
        daire(c, 395, 70, 14);
        daire(c, 605, 70, 14);
      },
    },
  };
  function cizgi(c, x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }
  function yol(c, noktalar, kapali) {
    c.beginPath();
    noktalar.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    if (kapali) c.closePath();
    c.stroke();
  }
  function daire(c, x, y, r) {
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.stroke();
  }
  function bulut(c, x, y) {
    c.beginPath();
    c.arc(x - 60, y + 10, 40, Math.PI * 0.5, Math.PI * 1.5);
    c.arc(x - 20, y - 30, 50, Math.PI, Math.PI * 1.85);
    c.arc(x + 45, y - 5, 45, Math.PI * 1.3, Math.PI * 0.5);
    c.closePath();
    c.stroke();
  }
  const hexRgb = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));

  OE.ekle({
    id: "boyama",
    ad: "Resim Yap",
    simge: "🖍️",
    cocuk: "ada",
    grup: "Eğlence",
    puanli: false,
    aciklama: "Boya, çiz, damga bas",
    baslat(sahne, ctx) {
      const boya = h("canvas.tuval", { width: W, height: H, "aria-label": "Resim tuvali" });
      const cizgiT = h("canvas.tuval.cizgi-katman", { width: W, height: H, "aria-hidden": "true" });
      const b = boya.getContext("2d", { willReadFrequently: true });
      const cz = cizgiT.getContext("2d", { willReadFrequently: true });
      let arac = "firca";
      let renk = PALET[0];
      let kalin = KALINLIK[1];
      let damga = DAMGA[0];
      let son = null;

      const aracDugme = (id, simge, ad, soz) =>
        h("button.arac", { type: "button", "data-arac": id, "aria-label": ad, title: ad, onclick: () => aracSec(id, soz) }, h("span.emo", simge));
      const araclar = h(
        "div.arac-cubugu",
        aracDugme("firca", "🖌️", "Fırça", "Fırça. Parmağınla çiz!"),
        aracDugme("kova", "🪣", "Boya kovası", "Boya kovası. Bir yere dokun, içi boyansın!"),
        aracDugme("damga", "⭐", "Damga", "Damga. Dokunduğun yere resim bas!"),
        aracDugme("silgi", "🧽", "Silgi", "Silgi. Sürterek sil!")
      );
      const palet = h(
        "div.palet",
        PALET.map((p) => h("button.renk-sec", { type: "button", stil: `--r:${p}`, "aria-label": "Renk", onclick: (e) => renkSec(p, e.currentTarget) }))
      );
      const kalinlik = h(
        "div.kalinlik",
        KALINLIK.map((k, i) => h("button.kalin-sec", { type: "button", "aria-label": ["İnce", "Orta", "Kalın"][i], onclick: (e) => kalinSec(k, e.currentTarget) }, h("span", { stil: `width:${8 + i * 9}px;height:${8 + i * 9}px` })))
      );
      const damgalar = h(
        "div.damgalar",
        { hidden: true },
        DAMGA.map((d) => h("button.damga-sec.emo", { type: "button", onclick: (e) => damgaSec(d, e.currentTarget) }, d))
      );
      const temizle = h("button.dugme.ikincil.kucuk", { type: "button" }, "Temizle");
      let onay = null;
      temizle.addEventListener("click", () => {
        if (!onay) {
          temizle.textContent = "Emin misin? Tekrar bas";
          onay = setTimeout(() => ((onay = null), (temizle.textContent = "Temizle")), 3000);
          return;
        }
        clearTimeout(onay);
        onay = null;
        temizle.textContent = "Temizle";
        sayfaAc(aktifSayfa);
      });
      let aktifSayfa = "bos";
      const sayfalar = h(
        "div.sayfalar",
        Object.entries(SAYFA).map(([id, s]) => h("button.sayfa-sec", { type: "button", "aria-label": s.ad, title: s.ad, "data-sayfa": id, onclick: () => sayfaAc(id) }, h("span.emo", s.simge)))
      );

      sahne.replaceChildren(
        h(
          "div.boyama",
          h("div.boyama-ust", sayfalar, temizle),
          h("div.tuval-kap", boya, cizgiT),
          araclar,
          palet,
          h("div.boyama-alt", kalinlik, damgalar)
        )
      );

      function isaretle(kap, el) {
        kap.querySelectorAll("button").forEach((x) => x.classList.toggle("secili", x === el));
      }
      function aracSec(id, soz) {
        arac = id;
        isaretle(araclar, araclar.querySelector(`[data-arac="${id}"]`));
        damgalar.hidden = id !== "damga";
        kalinlik.hidden = id === "damga" || id === "kova";
        if (soz) ctx.konus(soz, "tr-TR", { kaydet: false });
      }
      function renkSec(p, el) {
        renk = p;
        isaretle(palet, el);
        if (arac === "silgi" || arac === "damga") aracSec("firca");
        ctx.ses.tik();
      }
      function kalinSec(k, el) {
        kalin = k;
        isaretle(kalinlik, el);
      }
      function damgaSec(d, el) {
        damga = d;
        isaretle(damgalar, el);
      }
      function sayfaAc(id) {
        aktifSayfa = id;
        isaretle(sayfalar, sayfalar.querySelector(`[data-sayfa="${id}"]`));
        b.fillStyle = "#FFFFFF";
        b.fillRect(0, 0, W, H);
        cz.clearRect(0, 0, W, H);
        cz.strokeStyle = "#1F1F1F";
        cz.lineWidth = 8;
        cz.lineJoin = "round";
        cz.lineCap = "round";
        SAYFA[id].ciz(cz);
        if (id !== "bos") {
          aracSec("kova");
          ctx.konus(`${SAYFA[id].ad}! Bir renk seç, sonra boyamak istediğin yere dokun.`);
        }
      }

      const nokta = (e) => {
        const r = boya.getBoundingClientRect();
        return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
      };
      boya.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        const [x, y] = nokta(e);
        if (arac === "kova") return doldur(Math.round(x), Math.round(y));
        if (arac === "damga") {
          b.font = '110px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
          b.textAlign = "center";
          b.textBaseline = "middle";
          b.fillText(damga, x, y);
          ctx.ses.ton(880, 0.08);
          return;
        }
        boya.setPointerCapture(e.pointerId);
        son = [x, y];
        cizgiCek(x, y, x + 0.1, y + 0.1);
      });
      boya.addEventListener("pointermove", (e) => {
        if (!son) return;
        const [x, y] = nokta(e);
        cizgiCek(son[0], son[1], x, y);
        son = [x, y];
      });
      const birak = () => (son = null);
      boya.addEventListener("pointerup", birak);
      boya.addEventListener("pointercancel", birak);

      function cizgiCek(x1, y1, x2, y2) {
        b.strokeStyle = arac === "silgi" ? "#FFFFFF" : renk;
        b.lineWidth = arac === "silgi" ? kalin * 1.6 : kalin;
        b.lineCap = "round";
        b.lineJoin = "round";
        b.beginPath();
        b.moveTo(x1, y1);
        b.lineTo(x2, y2);
        b.stroke();
      }

      // Boya kovası: başlangıç rengine benzeyen ve sayfa çizgisine takılmayan bitişik bölgeyi boyar
      function doldur(x, y) {
        if (x < 0 || y < 0 || x >= W || y >= H) return;
        const resim = b.getImageData(0, 0, W, H);
        const d = resim.data;
        const sinir = cz.getImageData(0, 0, W, H).data;
        const bas = y * W + x;
        if (sinir[bas * 4 + 3] > 100) return;
        const [r, g, bl] = hexRgb(renk);
        const [sr, sg, sb] = [d[bas * 4], d[bas * 4 + 1], d[bas * 4 + 2]];
        if (Math.abs(sr - r) + Math.abs(sg - g) + Math.abs(sb - bl) < 12) return;
        const benzer = (p) => sinir[p * 4 + 3] <= 100 && Math.abs(d[p * 4] - sr) + Math.abs(d[p * 4 + 1] - sg) + Math.abs(d[p * 4 + 2] - sb) < 90;
        const gor = new Uint8Array(W * H);
        const yigin = [bas];
        const boyanacak = [];
        gor[bas] = 1;
        while (yigin.length) {
          const p = yigin.pop();
          boyanacak.push(p);
          const px = p % W;
          for (const q of [px > 0 ? p - 1 : -1, px < W - 1 ? p + 1 : -1, p - W, p + W]) {
            if (q < 0 || q >= W * H || gor[q]) continue;
            gor[q] = 1;
            // kenar piksellerini de boya ki çizgi altında beyaz hale kalmasın
            if (benzer(q)) yigin.push(q);
            else boyanacak.push(q);
          }
        }
        for (const p of boyanacak) {
          d[p * 4] = r;
          d[p * 4 + 1] = g;
          d[p * 4 + 2] = bl;
          d[p * 4 + 3] = 255;
        }
        b.putImageData(resim, 0, 0);
        ctx.ses.ton(660, 0.1);
      }

      sayfaAc("bos");
      aracSec("firca");
      isaretle(palet, palet.firstChild);
      isaretle(kalinlik, kalinlik.children[1]);
      isaretle(damgalar, damgalar.firstChild);
      ctx.konus("Resim yapalım! Bir renk seç ve parmağınla çiz. Yukarıdan boyama sayfası da seçebilirsin.");
      return () => clearTimeout(onay);
    },
  });
})();
