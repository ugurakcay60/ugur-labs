// Bebek Süsle çizimleri (SVG): bebek, kıyafetler, saçlar, makyaj ve süsler. Oyun mantığı bebek.js'tedir.
// Her şey tek bir 400x590 alanında çizilir (bebek x=200 ekseninde simetrik); küçük resimler viewBox ile kırpılır.
// Parçalar katmanlıdır: B.ciz(durum) bütün bebeği, B.onizle(kategori, sıra, durum) tek bir seçeneğin küçük resmini verir.
(function () {
  "use strict";
  const B = (OE.bebek = {});

  // ---------- Renk ve şekil yardımcıları ----------
  let sayac = 0;
  const uid = () => "bb" + ++sayac;
  const rgb = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
  function karisim(a, b, t) {
    const A = rgb(a);
    const Bb = rgb(b);
    return "#" + A.map((v, i) => Math.round(v + (Bb[i] - v) * t).toString(16).padStart(2, "0")).join("");
  }
  const koyu = (c, t = 0.25) => karisim(c, "#000000", t);
  const acik = (c, t = 0.4) => karisim(c, "#ffffff", t);
  const yildizYol = (cx, cy, r, ic = r * 0.45) => {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? ic : r;
      d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1);
    }
    return d + "Z";
  };
  const kalpYol = (cx, cy, s) =>
    `M${cx} ${cy + s * 0.9}C${cx - s * 1.5} ${cy - s * 0.1} ${cx - s * 0.6} ${cy - s * 1.1} ${cx} ${cy - s * 0.35}C${cx + s * 0.6} ${cy - s * 1.1} ${cx + s * 1.5} ${cy - s * 0.1} ${cx} ${cy + s * 0.9}Z`;
  const yildiz = (x, y, r, renk, o = 1) => `<path d="${yildizYol(x, y, r)}" fill="${renk}" opacity="${o}"/>`;
  const kalp = (x, y, s, renk) => `<path d="${kalpYol(x, y, s)}" fill="${renk}"/>`;
  const ayna = (s) => `<g transform="translate(400 0) scale(-1 1)">${s}</g>`;
  const kes = (yol, ic) => {
    const id = uid();
    return `<clipPath id="${id}"><path d="${yol}"/></clipPath><g clip-path="url(#${id})">${ic}</g>`;
  };
  const cift = (f) => f(1) + ayna(f(1)); // sol tarafı çiz, sağa yansıt

  // ---------- Seçenekler ----------
  const TEN = [
    { ad: "Açık ten", c: "#FFE1CB" },
    { ad: "Buğday ten", c: "#F4C7A1" },
    { ad: "Bronz ten", c: "#D49A6A" },
    { ad: "Koyu ten", c: "#9A6540" },
  ];
  const SAC_RENK = [
    { ad: "Kahverengi", c: "#6B3F26" },
    { ad: "Sarı", c: "#F2C94C" },
    { ad: "Kızıl", c: "#C8501E" },
    { ad: "Siyah", c: "#2A2230" },
    { ad: "Pembe", c: "#FF7FB2" },
    { ad: "Mor", c: "#9B6BE0" },
    { ad: "Mavi", c: "#4DA3FF" },
  ];
  const YOK = { ad: "Hiçbiri", yok: true };
  const RUJ = [YOK, { ad: "Kırmızı", c: "#E0334C" }, { ad: "Pembe", c: "#FF5FA2" }, { ad: "Mercan", c: "#FF7A59" }, { ad: "Mor", c: "#A64DB5" }, { ad: "Fuşya", c: "#D6246E" }, { ad: "Bordo", c: "#8E1B3A" }];
  const FAR = [YOK, { ad: "Pembe", c: "#FFA6C9" }, { ad: "Mor", c: "#B79CFF" }, { ad: "Mavi", c: "#7CC4FF" }, { ad: "Yeşil", c: "#7FDDB0" }, { ad: "Altın", c: "#F4C95D" }, { ad: "Turuncu", c: "#FF9F6B" }];
  const ALLIK = [YOK, { ad: "Şeftali", c: "#FF9A8A" }, { ad: "Pembe", c: "#FF6F9C" }, { ad: "Kırmızı", c: "#E8505B" }, { ad: "Mor", c: "#C77DFF" }];
  const OJE = [YOK, { ad: "Kırmızı", c: "#E0334C" }, { ad: "Pembe", c: "#FF7FB2" }, { ad: "Mor", c: "#9B6BE0" }, { ad: "Mavi", c: "#4DA3FF" }, { ad: "Sarı", c: "#FFD43B" }, { ad: "Yeşil", c: "#51CF66" }];

  // ---------- Elbiseler ----------
  const KISA_YOL = "M163 290Q200 306 237 290L252 432Q200 448 148 432Z";
  const kisaKol = (c) => `<circle cx="158" cy="298" r="15" fill="${c}"/><circle cx="242" cy="298" r="15" fill="${c}"/>`;

  function balo(c, c2) {
    const yol = "M162 290Q200 308 238 290L236 356C262 380 292 436 305 492Q284 512 263 494Q242 512 221 494Q200 512 179 494Q158 512 137 494Q116 512 95 492C108 436 138 380 164 356Z";
    return (
      `<path d="${yol}" fill="${c}"/>` +
      kes(yol, `<path d="M90 468Q200 524 310 468L320 530L80 530Z" fill="${c2}" opacity=".55"/><path d="M190 362C182 410 166 452 150 492M214 362C222 410 240 452 256 492" stroke="${koyu(c, 0.14)}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>`) +
      `<path d="M95 492Q116 512 137 494Q158 512 179 494Q200 512 221 494Q242 512 263 494Q284 512 305 492" fill="none" stroke="${c2}" stroke-width="5" stroke-linecap="round"/>` +
      `<rect x="163" y="346" width="74" height="13" rx="6.5" fill="${koyu(c, 0.2)}"/>` +
      `<path d="M200 324L183 315L183 333ZM200 324L217 315L217 333Z" fill="${c2}"/><circle cx="200" cy="324" r="5" fill="${koyu(c, 0.2)}"/>` +
      `<circle cx="158" cy="298" r="16" fill="${c}"/><circle cx="242" cy="298" r="16" fill="${c}"/>` +
      yildiz(178, 420, 7, "#fff", 0.9) + yildiz(226, 446, 6, "#fff", 0.9) + yildiz(148, 470, 6, "#fff", 0.85) + yildiz(256, 472, 7, "#fff", 0.85) + yildiz(204, 484, 5, "#fff", 0.8)
    );
  }
  function kisa(c, c2, desen) {
    let ic = "";
    if (desen === "nokta") {
      for (const [x, y] of [[178, 322], [218, 318], [196, 350], [232, 358], [170, 384], [208, 392], [240, 410], [186, 424], [158, 412], [222, 430]]) ic += `<circle cx="${x}" cy="${y}" r="6" fill="${c2}"/>`;
    } else {
      for (const [x, y] of [[178, 324], [222, 324], [200, 356], [168, 388], [232, 388], [200, 420], [160, 424], [240, 428]]) ic += kalp(x, y, 8, c2);
    }
    return (
      `<path d="${KISA_YOL}" fill="${c}"/>` + kes(KISA_YOL, ic) +
      `<path d="M148 432Q200 448 252 432" fill="none" stroke="${c2}" stroke-width="6" stroke-linecap="round"/>` +
      `<rect x="165" y="346" width="70" height="10" rx="5" fill="${koyu(c, 0.18)}"/>` + kisaKol(c) +
      `<circle cx="200" cy="351" r="6" fill="${c2}"/>`
    );
  }
  function gokkusagi() {
    const bant = ["#FF6B6B", "#FFA94D", "#FFE066", "#69DB7C", "#4DABF7", "#B197FC"];
    return (
      kes(KISA_YOL, bant.map((b, i) => `<rect x="130" y="${284 + i * 26}" width="140" height="27" fill="${b}"/>`).join("")) +
      `<circle cx="158" cy="298" r="15" fill="#FF6B6B"/><circle cx="242" cy="298" r="15" fill="#FF6B6B"/>` +
      yildiz(180, 330, 6, "#fff", 0.9) + yildiz(222, 372, 6, "#fff", 0.9) + yildiz(190, 416, 6, "#fff", 0.9)
    );
  }
  function tutu(c, c2) {
    const gov = "M166 292Q200 308 234 292L238 372Q200 386 162 372Z";
    return (
      `<ellipse cx="200" cy="396" rx="104" ry="26" fill="${acik(c, 0.5)}"/><ellipse cx="200" cy="388" rx="94" ry="22" fill="${acik(c, 0.25)}"/><ellipse cx="200" cy="380" rx="82" ry="19" fill="${c}"/>` +
      [112, 140, 168, 232, 260, 288].map((x) => `<circle cx="${x}" cy="${392 + (Math.abs(x - 200) < 40 ? 14 : 8)}" r="9" fill="${acik(c, 0.35)}"/>`).join("") +
      `<path d="${gov}" fill="${c}"/><rect x="164" y="358" width="72" height="12" rx="6" fill="${c2}"/>` +
      `<path d="M178 292L172 306M222 292L228 306" stroke="${c}" stroke-width="9" stroke-linecap="round"/>` +
      kalp(200, 330, 9, c2) + yildiz(150, 396, 6, "#fff", 0.9) + yildiz(250, 398, 6, "#fff", 0.9) + yildiz(200, 410, 5, "#fff", 0.8)
    );
  }
  function tulum(c, c2) {
    return (
      `<path d="M162 290Q200 306 238 290L236 352L164 352Z" fill="${c2}"/><circle cx="158" cy="298" r="15" fill="${c2}"/><circle cx="242" cy="298" r="15" fill="${c2}"/>` +
      `<path d="M163 344L237 344L247 430L206 430L200 394L194 430L153 430Z" fill="${c}"/>` +
      `<rect x="177" y="314" width="46" height="40" rx="7" fill="${c}"/><path d="M182 318L172 292M218 318L228 292" stroke="${c}" stroke-width="9" stroke-linecap="round"/>` +
      kalp(200, 335, 7, c2) + `<circle cx="180" cy="320" r="4" fill="#FFD43B"/><circle cx="220" cy="320" r="4" fill="#FFD43B"/>` +
      `<path d="M153 430L206 430M194 430L247 430" stroke="${koyu(c, 0.2)}" stroke-width="4" stroke-linecap="round"/>`
    );
  }
  function peri(c, c2) {
    const yol = "M163 290Q200 306 237 290L238 360L252 440L230 474L212 444L200 478L188 444L170 474L148 440L162 360Z";
    return (
      `<path d="${yol}" fill="${c}"/>` +
      kes(yol, `<path d="M200 310L200 470M200 340L176 360M200 340L224 360M200 380L172 404M200 380L228 404M200 420L180 440M200 420L220 440" stroke="${acik(c, 0.5)}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`) +
      `<rect x="164" y="346" width="72" height="11" rx="5" fill="${koyu(c, 0.2)}"/>` +
      [[200, 322, "#FF8FB8"], [176, 340, "#FFD43B"], [224, 340, "#FF8FB8"]].map(([x, y, k]) => `<circle cx="${x}" cy="${y}" r="7" fill="${k}"/><circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join("") +
      `<path d="M150 296Q138 284 142 276Q158 280 162 296ZM250 296Q262 284 258 276Q242 280 238 296Z" fill="${c2}"/>` + kisaKol(c)
    );
  }

  const ELBISE = [
    { ad: "Pembe balo elbisesi", ciz: () => balo("#FF8DB8", "#FFD1E3") },
    { ad: "Mavi prenses elbisesi", ciz: () => balo("#6EC1FF", "#D3EEFF") },
    { ad: "Sarı puantiyeli elbise", ciz: () => kisa("#FFD84D", "#FF8FA3", "nokta") },
    { ad: "Mor balerin elbisesi", ciz: () => tutu("#B58CFF", "#FFC2E2") },
    { ad: "Gökkuşağı elbise", ciz: () => gokkusagi() },
    { ad: "Turuncu tulum", ciz: () => tulum("#FF9F43", "#FFF6E5") },
    { ad: "Yeşil peri elbisesi", ciz: () => peri("#6FCF97", "#C6F5D5") },
    { ad: "Kalpli elbise", ciz: () => kisa("#F0506E", "#FFFFFF", "kalp") },
  ];

  // ---------- Ayakkabılar (sol ayak x=182, sağ ayak x=218) ----------
  function ayakkabiCift(f) {
    return f(182, -1) + f(218, 1);
  }
  const AYAKKABI = [
    { ad: "Pembe babet", ciz: () => ayakkabiCift((x, s) => `<ellipse cx="${x + s * 4}" cy="544" rx="26" ry="13" fill="#FF8FB8"/><ellipse cx="${x + s * 2}" cy="536" rx="14" ry="6" fill="#FFB3D0"/>` + kalp(x + s * 12, 542, 5, "#fff")) },
    { ad: "Mor spor ayakkabı", ciz: () => ayakkabiCift((x, s) => `<ellipse cx="${x + s * 4}" cy="542" rx="27" ry="14" fill="#B58CFF"/><path d="M${x + s * 4 - 27} 549Q${x + s * 4} 568 ${x + s * 4 + 27} 549L${x + s * 4 + 26} 554Q${x + s * 4} 571 ${x + s * 4 - 26} 554Z" fill="#fff"/><path d="M${x + s * 4 - 8} 532L${x + s * 4 + 4} 538M${x + s * 4 - 12} 538L${x + s * 4} 544" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` + yildiz(x + s * 16, 544, 5, "#FFD43B")) },
    { ad: "Sarı yağmur çizmesi", ciz: () => ayakkabiCift((x, s) => `<path d="M${x - 15} 474L${x + 15} 474L${x + 16} 538Q${x + 16 + s * 18} 538 ${x + s * 18 + 14} 556L${x - 22} 556Q${x - 24} 540 ${x - 16} 536Z" fill="#FFD43B"/><path d="M${x - 15} 474L${x + 15} 474L${x + 15} 484L${x - 15} 484Z" fill="#FF8FA3"/><path d="M${x - 8} 492L${x - 8} 530" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`) },
    { ad: "Kırmızı topuklu", ciz: () => ayakkabiCift((x, s) => `<path d="M${x - 24} 534Q${x - 26} 552 ${x} 552L${x + 22} 548L${x + 22} 534Z" fill="#E0334C"/><rect x="${x + (s > 0 ? 8 : 12) - 6}" y="548" width="9" height="15" rx="3" fill="#B72540"/>` + `<ellipse cx="${x - 2}" cy="535" rx="11" ry="4" fill="#FF6B7F"/>`) },
    { ad: "Altın sandalet", ciz: () => ayakkabiCift((x, s) => `<ellipse cx="${x + s * 3}" cy="552" rx="26" ry="7" fill="#F4C95D"/><rect x="${x - 14}" y="536" width="28" height="7" rx="3" fill="#F4C95D"/><rect x="${x - 12}" y="546" width="26" height="6" rx="3" fill="#FFD875"/><circle cx="${x}" cy="539" r="4" fill="#FF8FB8"/>`) },
  ];

  // ---------- Saçlar ----------
  const kapak = (c) =>
    `<path d="M108 176C98 80 152 56 200 56C248 56 302 80 292 176C284 150 272 128 252 116C238 140 214 148 198 130C182 146 150 146 142 116C124 130 114 152 108 176Z" fill="${c}"/>` +
    `<path d="M146 84Q190 64 238 78" stroke="${acik(c, 0.4)}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/>`;
  const yanLuk = (c) => cift(() => `<path d="M108 176C100 220 106 262 120 292C132 252 130 212 134 182Z" fill="${c}"/>`);
  const SAC = [
    {
      ad: "Uzun saç",
      arka: (c) => `<path d="M102 170C82 262 88 332 108 376C140 392 152 332 150 272L250 272C248 332 260 392 292 376C312 332 318 262 298 170Z" fill="${c}"/><path d="M118 300C124 330 122 350 116 366M282 300C276 330 278 350 284 366" stroke="${koyu(c, 0.18)}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      on: (c) => kapak(c) + yanLuk(c),
    },
    {
      ad: "Atkuyruğu",
      arka: (c) => `<path d="M268 100C326 70 380 116 372 188C366 248 334 292 304 322C322 262 326 214 298 170C284 150 272 132 268 100Z" fill="${c}"/><path d="M330 150C340 200 330 250 312 290" stroke="${koyu(c, 0.18)}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      on: (c) => kapak(c) + `<rect x="258" y="96" width="26" height="14" rx="7" fill="#FF7FB2" transform="rotate(-25 271 103)"/>`,
    },
    {
      ad: "İki kuyruk",
      arka: (c) => cift(() => `<path d="M122 118C70 128 50 200 66 272C76 304 104 320 120 302C98 262 102 204 128 160Z" fill="${c}"/>`),
      on: (c) => kapak(c) + cift(() => `<circle cx="124" cy="126" r="9" fill="#FF7FB2"/>`),
    },
    {
      ad: "Küt saç",
      arka: (c) => `<path d="M100 170C86 230 94 276 116 292L284 292C306 276 314 230 300 170Z" fill="${c}"/>`,
      on: (c) => kapak(c) + cift(() => `<path d="M108 176C100 214 106 250 122 276C136 252 132 214 134 182Z" fill="${c}"/>`),
    },
    {
      ad: "Kıvırcık saç",
      arka: (c) => cift(() => [[100, 150, 30], [86, 202, 30], [94, 254, 30], [116, 298, 28]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join("")) + `<circle cx="200" cy="64" r="40" fill="${c}"/>`,
      on: (c) => [[132, 100, 28], [168, 84, 28], [212, 82, 30], [252, 96, 28], [276, 128, 22], [124, 132, 22], [150, 120, 20], [236, 116, 20]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join("") + `<circle cx="184" cy="76" r="9" fill="${acik(c, 0.4)}" opacity=".5"/>`,
    },
    {
      ad: "Topuz",
      arka: (c) => `<circle cx="200" cy="46" r="38" fill="${c}"/><path d="M178 40Q200 24 222 40M182 56Q200 70 218 56" stroke="${koyu(c, 0.18)}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      on: (c) => kapak(c) + yanLuk(c) + `<rect x="170" y="78" width="60" height="13" rx="6.5" fill="#FF7FB2"/>`,
    },
  ];

  // ---------- Saç süsleri ----------
  const cicek = (x, y, r, renk, orta = "#FFD43B") =>
    [0, 1, 2, 3, 4].map((i) => `<circle cx="${(x + r * 1.15 * Math.cos((i * 2 * Math.PI) / 5 - Math.PI / 2)).toFixed(1)}" cy="${(y + r * 1.15 * Math.sin((i * 2 * Math.PI) / 5 - Math.PI / 2)).toFixed(1)}" r="${r}" fill="${renk}"/>`).join("") + `<circle cx="${x}" cy="${y}" r="${r * 0.8}" fill="${orta}"/>`;
  const fiyonk = (x, y, k, renk) => `<g transform="translate(${x} ${y}) rotate(${k})"><path d="M0 0L-30 -17Q-36 0 -30 17ZM0 0L30 -17Q36 0 30 17Z" fill="${renk}"/><path d="M0 0L-30 -17M0 0L-30 17M0 0L30 -17M0 0L30 17" stroke="${koyu(renk, 0.18)}" stroke-width="2" opacity=".6"/><circle r="8" fill="${koyu(renk, 0.15)}"/></g>`;
  const TOKA = [
    YOK,
    { ad: "Pembe fiyonk", ciz: () => fiyonk(262, 98, -18, "#FF5FA2") },
    { ad: "Çiçek tokası", ciz: () => cicek(138, 104, 9, "#FFFFFF") + cicek(122, 126, 6, "#FF8FB8") },
    { ad: "Kelebek tokası", ciz: () => `<g transform="translate(262 106) rotate(-15)"><ellipse cx="-13" cy="-7" rx="14" ry="10" fill="#B58CFF"/><ellipse cx="13" cy="-7" rx="14" ry="10" fill="#B58CFF"/><ellipse cx="-10" cy="9" rx="9" ry="8" fill="#FF8FB8"/><ellipse cx="10" cy="9" rx="9" ry="8" fill="#FF8FB8"/><rect x="-2.5" y="-14" width="5" height="30" rx="2.5" fill="#4A3A62"/><circle cx="-12" cy="-7" r="4" fill="#fff" opacity=".7"/><circle cx="12" cy="-7" r="4" fill="#fff" opacity=".7"/></g>` },
    { ad: "Kafa bandı", ciz: () => `<path d="M114 158Q104 64 200 58Q296 64 286 158" fill="none" stroke="#FF5FA2" stroke-width="11" stroke-linecap="round"/><path d="M114 158Q104 64 200 58Q296 64 286 158" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>` + fiyonk(250, 66, 14, "#FF5FA2") },
    { ad: "Yıldız tokaları", ciz: () => yildiz(136, 118, 15, "#FFD43B") + yildiz(264, 118, 15, "#FFD43B") + yildiz(136, 118, 6, "#fff", 0.7) + yildiz(264, 118, 6, "#fff", 0.7) },
  ];

  // ---------- Taç ve şapkalar ----------
  const TAC = [
    YOK,
    { ad: "Altın taç", ciz: () => `<path d="M146 76L150 38L176 58L200 26L224 58L250 38L254 76Z" fill="#FFC93C"/><rect x="146" y="70" width="108" height="14" rx="5" fill="#F5A623"/><circle cx="150" cy="38" r="5" fill="#FF5FA2"/><circle cx="200" cy="26" r="6" fill="#4DA3FF"/><circle cx="250" cy="38" r="5" fill="#FF5FA2"/><circle cx="200" cy="77" r="5" fill="#E0334C"/><circle cx="170" cy="77" r="3.5" fill="#fff"/><circle cx="230" cy="77" r="3.5" fill="#fff"/>` },
    { ad: "Işıltılı tiara", ciz: () => `<path d="M134 100Q200 22 266 100" fill="none" stroke="#DDE3EC" stroke-width="7" stroke-linecap="round"/><path d="M200 54L190 70L200 84L210 70Z" fill="#7CC4FF"/>` + [[160, 72], [240, 72], [140, 92], [260, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#FF8FB8"/>`).join("") + yildiz(200, 40, 9, "#FFD43B") },
    {
      ad: "Çiçek tacı",
      ciz: () => {
        const renk = ["#FF8FB8", "#FFFFFF", "#C9A8FF", "#FFD1E3", "#FFFFFF"];
        let s = `<path d="M124 124Q200 24 276 124" fill="none" stroke="#51A35F" stroke-width="5"/>`;
        for (let i = 0; i < 7; i++) {
          const a = Math.PI * (1.12 + (i * 0.76) / 6);
          s += cicek(+(200 + 82 * Math.cos(a)).toFixed(1), +(112 + 66 * Math.sin(a)).toFixed(1), 8, renk[i % 5]);
        }
        return s;
      },
    },
    { ad: "Kedi kulağı", ciz: () => `<path d="M118 120Q110 60 138 34L184 76Z" fill="#FF8FB8"/><path d="M282 120Q290 60 262 34L216 76Z" fill="#FF8FB8"/><path d="M130 100Q126 66 142 52L170 78Z" fill="#FFD1E3"/><path d="M270 100Q274 66 258 52L230 78Z" fill="#FFD1E3"/><path d="M112 128Q200 36 288 128" fill="none" stroke="#FF8FB8" stroke-width="9" stroke-linecap="round"/>` },
    { ad: "Parti şapkası", ciz: () => `<path d="M166 78L200 4L234 78Z" fill="#B58CFF"/><path d="M176 56L224 56M170 70L230 70" stroke="#FFD43B" stroke-width="6"/><path d="M190 32L210 32" stroke="#FF8FB8" stroke-width="6"/><circle cx="200" cy="6" r="9" fill="#FFD43B"/><path d="M162 78Q200 90 238 78" fill="none" stroke="#FFD43B" stroke-width="5" stroke-linecap="round"/>` },
  ];

  // ---------- Gözlükler ----------
  const GOZ_L = 162;
  const GOZ_R = 238;
  const GOZLUK = [
    YOK,
    { ad: "Pembe güneş gözlüğü", ciz: () => [GOZ_L, GOZ_R].map((x) => `<rect x="${x - 27}" y="164" width="54" height="40" rx="17" fill="#C2185B" opacity=".72" stroke="#FF5FA2" stroke-width="5"/>`).join("") + `<path d="M189 178Q200 172 211 178" stroke="#FF5FA2" stroke-width="5" fill="none"/><path d="M135 178L116 176M265 178L284 176" stroke="#FF5FA2" stroke-width="5" stroke-linecap="round"/><path d="M144 172L156 168" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>` },
    { ad: "Kalpli gözlük", ciz: () => [GOZ_L, GOZ_R].map((x) => `<path d="${kalpYol(x, 188, 24)}" fill="#FF5FA2" fill-opacity=".45" stroke="#E0334C" stroke-width="5" stroke-linejoin="round"/>`).join("") + `<path d="M186 180Q200 172 214 180" stroke="#E0334C" stroke-width="4" fill="none"/><path d="M128 178L116 176M272 178L284 176" stroke="#E0334C" stroke-width="4" stroke-linecap="round"/>` },
    { ad: "Yıldızlı gözlük", ciz: () => [GOZ_L, GOZ_R].map((x) => `<path d="${yildizYol(x, 186, 30, 15)}" fill="#FFD43B" fill-opacity=".4" stroke="#F5A623" stroke-width="5" stroke-linejoin="round"/>`).join("") + `<path d="M190 182Q200 176 210 182" stroke="#F5A623" stroke-width="4" fill="none"/><path d="M133 180L116 176M267 180L284 176" stroke="#F5A623" stroke-width="4" stroke-linecap="round"/>` },
    { ad: "Yuvarlak gözlük", ciz: () => [GOZ_L, GOZ_R].map((x) => `<circle cx="${x}" cy="186" r="27" fill="#BDE6FF" fill-opacity=".3" stroke="#6B4FA0" stroke-width="5"/><path d="M${x - 14} 174Q${x - 8} 168 ${x} 168" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>`).join("") + `<path d="M189 184Q200 178 211 184" stroke="#6B4FA0" stroke-width="4" fill="none"/><path d="M135 184L116 180M265 184L284 180" stroke="#6B4FA0" stroke-width="4" stroke-linecap="round"/>` },
  ];

  // ---------- Kolyeler ----------
  const KOLYE_ZINCIR = "M170 276Q200 322 230 276";
  const KOLYE = [
    YOK,
    { ad: "İnci kolye", ciz: () => Array.from({ length: 9 }, (_, i) => { const t = (i + 0.5) / 9; const x = (1 - t) ** 2 * 170 + 2 * t * (1 - t) * 200 + t * t * 230; const y = (1 - t) ** 2 * 276 + 2 * t * (1 - t) * 322 + t * t * 276; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="#FFF7EE" stroke="#E4D3C4" stroke-width="1.5"/><circle cx="${(x - 1.8).toFixed(1)}" cy="${(y - 2).toFixed(1)}" r="1.8" fill="#fff"/>`; }).join("") },
    { ad: "Kalpli kolye", ciz: () => `<path d="${KOLYE_ZINCIR}" fill="none" stroke="#F4C95D" stroke-width="3"/>` + kalp(200, 308, 11, "#FF5FA2") + `<circle cx="196" cy="304" r="2.5" fill="#fff" opacity=".8"/>` },
    { ad: "Yıldızlı kolye", ciz: () => `<path d="${KOLYE_ZINCIR}" fill="none" stroke="#F4C95D" stroke-width="3"/>` + yildiz(200, 311, 14, "#FFD43B") + yildiz(200, 311, 6, "#fff", 0.6) },
    { ad: "Renkli boncuk kolye", ciz: () => { const k = ["#FF6B6B", "#FFA94D", "#FFE066", "#69DB7C", "#4DABF7", "#B197FC", "#FF8FB8"]; return Array.from({ length: 9 }, (_, i) => { const t = (i + 0.5) / 9; const x = (1 - t) ** 2 * 170 + 2 * t * (1 - t) * 200 + t * t * 230; const y = (1 - t) ** 2 * 276 + 2 * t * (1 - t) * 322 + t * t * 276; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="${k[i % 7]}"/>`; }).join(""); } },
  ];

  // ---------- Küpeler (sol kulak x=113; sağ yansıtılır) ----------
  const KUPE_SOL = [
    null,
    () => `<circle cx="113" cy="214" r="7" fill="#FFF7EE" stroke="#E4D3C4" stroke-width="1.5"/><circle cx="111" cy="212" r="2" fill="#fff"/>`,
    () => kalp(113, 218, 8, "#FF5FA2"),
    () => `<circle cx="113" cy="226" r="13" fill="none" stroke="#F4C95D" stroke-width="4"/>`,
    () => yildiz(113, 220, 11, "#FFD43B"),
  ];
  const KUPE = [YOK, { ad: "İnci küpe" }, { ad: "Kalpli küpe" }, { ad: "Altın halka küpe" }, { ad: "Yıldızlı küpe" }];

  // ---------- Eldeki eşyalar (sol el 133,378 · sağ el 267,378) ----------
  const EL = [
    YOK,
    { ad: "Peri asası", ciz: () => `<path d="M267 378L300 300" stroke="#E4C9FF" stroke-width="7" stroke-linecap="round"/>` + yildiz(302, 284, 22, "#FFD43B") + yildiz(302, 284, 9, "#fff", 0.7) + yildiz(332, 262, 6, "#FFD43B") + yildiz(272, 262, 5, "#FF8FB8") },
    { ad: "Pembe çanta", ciz: () => `<path d="M121 400Q121 366 133 366Q145 366 145 400" fill="none" stroke="#C2185B" stroke-width="5"/><rect x="108" y="398" width="50" height="36" rx="9" fill="#FF8FB8"/><rect x="108" y="408" width="50" height="5" fill="#FF5FA2"/><circle cx="133" cy="416" r="5" fill="#FFD43B"/>` },
    { ad: "Kırmızı balon", ciz: () => `<path d="M267 378Q276 340 296 296" fill="none" stroke="#9AA6B2" stroke-width="2.5"/><ellipse cx="298" cy="262" rx="28" ry="34" fill="#F0506E"/><path d="M298 296L292 304L304 304Z" fill="#F0506E"/><ellipse cx="288" cy="248" rx="7" ry="11" fill="#fff" opacity=".45"/>` },
    { ad: "Çiçek buketi", ciz: () => `<path d="M133 378L122 332M133 378L136 326M133 378L150 332" stroke="#51A35F" stroke-width="4" stroke-linecap="round"/>` + cicek(120, 322, 8, "#FF8FB8") + cicek(137, 314, 8, "#FFFFFF") + cicek(152, 324, 8, "#C9A8FF") + `<path d="M118 372L148 372L133 396Z" fill="#FFD1E3"/>` },
    { ad: "Dondurma", ciz: () => `<path d="M254 344L280 344L267 386Z" fill="#E8B26A"/><path d="M258 352L276 360M262 366L274 372" stroke="#C98B3E" stroke-width="2.5"/><circle cx="267" cy="336" r="17" fill="#FF8FB8"/><circle cx="267" cy="316" r="15" fill="#8D5A3B"/><circle cx="267" cy="302" r="5" fill="#E0334C"/>` },
  ];

  // ---------- Kanatlar ----------
  const KANAT = [
    YOK,
    {
      ad: "Kelebek kanatları",
      ciz: () => cift(() => `<path d="M186 306C100 206 20 226 38 318C54 364 130 354 186 330Z" fill="#B58CFF"/><path d="M188 338C132 340 68 402 98 444C130 464 172 404 188 352Z" fill="#FF8FB8"/><circle cx="78" cy="288" r="14" fill="#fff" opacity=".7"/><circle cx="116" cy="316" r="9" fill="#fff" opacity=".7"/><circle cx="104" cy="420" r="9" fill="#fff" opacity=".7"/>`),
    },
    {
      ad: "Peri kanatları",
      ciz: () => cift(() => `<path d="M186 308C150 196 76 150 38 190C20 244 100 300 186 330Z" fill="#9EE7F5" fill-opacity=".7" stroke="#fff" stroke-width="3"/><path d="M188 336C140 350 92 402 70 434C112 446 172 404 190 354Z" fill="#CDEEFF" fill-opacity=".7" stroke="#fff" stroke-width="3"/>` + yildiz(70, 210, 7, "#fff") + yildiz(100, 400, 6, "#fff")),
    },
    {
      ad: "Melek kanatları",
      ciz: () => cift(() => [[-44, 92], [-24, 104], [-4, 100], [16, 88], [36, 68]].map(([a, L]) => `<ellipse cx="${-L}" cy="0" rx="${L}" ry="16" fill="${a % 2 ? "#FFFFFF" : "#EEF3FA"}" stroke="#B9C6DA" stroke-width="2.5" transform="translate(186 322) rotate(${a})"/>`).join("")),
    },
  ];

  // ---------- Yüz süsleri ----------
  const SUS = [
    YOK,
    { ad: "Yıldız süsü", yuz: () => yildiz(140, 214, 9, "#FFD43B") + yildiz(260, 214, 9, "#FFD43B") + yildiz(140, 214, 4, "#fff", 0.7) + yildiz(260, 214, 4, "#fff", 0.7), ikon: "⭐" },
    { ad: "Kalp süsü", yuz: () => kalp(142, 212, 8, "#FF5FA2") + kalp(258, 212, 8, "#FF5FA2"), ikon: "💗" },
    { ad: "Işıltılı pullar", yuz: () => [[132, 200, "#FF8FB8"], [148, 214, "#7CC4FF"], [136, 226, "#FFD43B"], [268, 200, "#7CC4FF"], [252, 214, "#FF8FB8"], [264, 226, "#B58CFF"], [196, 134, "#FFD43B"], [215, 144, "#FF8FB8"]].map(([x, y, k]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${k}"/><circle cx="${x - 1}" cy="${y - 1}" r="1.2" fill="#fff"/>`).join(""), ikon: "✨" },
    { ad: "Çiller", yuz: () => [[176, 208], [188, 212], [182, 220], [224, 208], [212, 212], [218, 220], [160, 214], [240, 214]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#B5683F" opacity=".75"/>`).join(""), ikon: "🟤" },
  ];

  // ---------- Kategoriler ----------
  // anahtar = durum alanı; liste[0] "Hiçbiri" ise boş bırakılabilir; zorunlu olanlarda yok.
  // kirp: küçük resim viewBox'ı; tur "renk": renkli yuvarlak/ikon küçük resmi
  const KAT = {
    elbise: { ad: "Elbise", simge: "👗", liste: ELBISE, kirp: "86 268 228 258" },
    ayakkabi: { ad: "Ayakkabı", simge: "👠", liste: AYAKKABI, kirp: "140 466 120 104" },
    ten: { ad: "Ten rengi", simge: "🧒", liste: TEN, tur: "renk" },
    sac: { ad: "Saç modeli", simge: "💇‍♀️", liste: SAC, kirp: "56 20 288 330" },
    sacRenk: { ad: "Saç rengi", simge: "🎨", liste: SAC_RENK, tur: "renk" },
    toka: { ad: "Saç süsü", simge: "🎀", liste: TOKA, kirp: "100 30 200 160" },
    ruj: { ad: "Ruj", simge: "💋", liste: RUJ, tur: "renk" },
    far: { ad: "Far", simge: "👁️", liste: FAR, tur: "renk" },
    allik: { ad: "Allık", simge: "🌸", liste: ALLIK, tur: "renk" },
    oje: { ad: "Oje", simge: "💅", liste: OJE, tur: "renk" },
    sus: { ad: "Yüz süsü", simge: "✨", liste: SUS, tur: "ikon" },
    tac: { ad: "Taç ve şapka", simge: "👑", liste: TAC, kirp: "104 0 192 130" },
    gozluk: { ad: "Gözlük", simge: "🕶️", liste: GOZLUK, kirp: "112 156 176 56" },
    kolye: { ad: "Kolye", simge: "📿", liste: KOLYE, kirp: "156 266 88 66" },
    kupe: { ad: "Küpe", simge: "💎", liste: KUPE, kirp: "92 190 44 50" },
    el: { ad: "Elde tut", simge: "🪄", liste: EL, kirp: "96 240 252 200" },
    kanat: { ad: "Kanat", simge: "🦋", liste: KANAT, kirp: "10 150 380 310" },
  };
  B.KAT = KAT;
  B.VARSAYILAN = { ten: 0, elbise: 0, ayakkabi: 0, sac: 0, sacRenk: 0, toka: 0, ruj: 0, far: 0, allik: 0, oje: 0, sus: 0, tac: 0, gozluk: 0, kolye: 0, kupe: 0, el: 0, kanat: 0 };
  B.SAC_RENK = SAC_RENK;

  // ---------- Yüz ve gövde ----------
  function goz(x, yon, far) {
    return (
      `<g class="goz"><ellipse cx="${x}" cy="184" rx="16" ry="20" fill="#4A3228"/><ellipse cx="${x}" cy="187" rx="12" ry="15" fill="#8A5A40"/><ellipse cx="${x}" cy="189" rx="7.5" ry="10" fill="#241513"/>` +
      `<circle cx="${x + 6}" cy="177" r="6.5" fill="#fff"/><circle cx="${x - 6}" cy="194" r="3" fill="#fff" opacity=".9"/>` +
      `<path d="M${x + yon * 15} 172Q${x + yon * 21} 167 ${x + yon * 24} 168M${x + yon * 16} 179Q${x + yon * 22} 177 ${x + yon * 25} 179" stroke="#241513" stroke-width="3" fill="none" stroke-linecap="round"/></g>` +
      (far ? `<ellipse cx="${x}" cy="165" rx="22" ry="9" fill="${far}" opacity=".78"/>` : "")
    );
  }
  function kol(ten, oje) {
    const el = (x, s) => {
      let u = `<circle cx="${x}" cy="380" r="14" fill="${ten}"/>`;
      if (oje) for (const dx of [-8, -2.7, 2.7, 8]) u += `<ellipse cx="${x + dx + s * 0}" cy="${392 - Math.abs(dx) * 0.35}" rx="3.2" ry="4.4" fill="${oje}"/>`;
      return u;
    };
    return `<path d="M166 298Q142 334 135 374" fill="none" stroke="${ten}" stroke-width="22" stroke-linecap="round"/><path d="M234 298Q258 334 265 374" fill="none" stroke="${ten}" stroke-width="22" stroke-linecap="round"/>` + el(134, 1) + el(266, -1);
  }

  B.ciz = function (d) {
    const ten = TEN[d.ten].c;
    const sac = SAC_RENK[d.sacRenk].c;
    const model = SAC[d.sac];
    const ruj = RUJ[d.ruj].c;
    const far = FAR[d.far].c;
    const allik = ALLIK[d.allik].c;
    const oje = OJE[d.oje].c;
    const dudak = ruj || "#F29A9E";
    const k = KAT;
    const parcalar = [];
    const p = (s) => s && parcalar.push(s);

    p(`<ellipse cx="200" cy="566" rx="96" ry="11" fill="#000" opacity=".14"/>`);
    p(KANAT[d.kanat].ciz ? `<g data-bolge="kanat">${KANAT[d.kanat].ciz()}</g>` : "");
    p(model.arka(sac));
    // bacaklar ve ayakkabı
    p(`<g data-bolge="ayak"><path d="M184 360L182 524M216 360L218 524" stroke="${ten}" stroke-width="25" stroke-linecap="round" fill="none"/>${AYAKKABI[d.ayakkabi].ciz()}</g>`);
    // gövde: kollar, boyun, elbise
    p(`<g data-bolge="govde">${kol(ten, oje)}<path d="M178 278L222 278Q234 288 241 298L236 366L164 366L159 298Q166 288 178 278Z" fill="${ten}"/>${ELBISE[d.elbise].ciz()}</g>`);
    p(EL[d.el].ciz ? EL[d.el].ciz() : "");
    p(`<rect x="186" y="238" width="28" height="48" rx="12" fill="${ten}"/><ellipse cx="200" cy="262" rx="18" ry="9" fill="${koyu(ten, 0.14)}" opacity=".55"/>`);
    p(KOLYE[d.kolye].ciz ? KOLYE[d.kolye].ciz() : "");
    // kafa
    const sol = KUPE_SOL[d.kupe];
    p(`<g data-bolge="kafa"><circle cx="113" cy="188" r="14" fill="${ten}"/><circle cx="287" cy="188" r="14" fill="${ten}"/>` +
      `<ellipse cx="200" cy="170" rx="88" ry="82" fill="${ten}"/>` +
      `<ellipse cx="141" cy="212" rx="19" ry="12" fill="${allik || "#FF8FA3"}" opacity="${allik ? 0.62 : 0.22}"/><ellipse cx="259" cy="212" rx="19" ry="12" fill="${allik || "#FF8FA3"}" opacity="${allik ? 0.62 : 0.22}"/>` +
      goz(GOZ_L, -1, far) + goz(GOZ_R, 1, far) +
      `<path d="M146 156Q162 146 178 154M222 154Q238 146 254 156" stroke="${koyu(sac, 0.25)}" stroke-width="4.5" fill="none" stroke-linecap="round"/>` +
      `<path d="M195 205Q200 210 205 205" stroke="${koyu(ten, 0.22)}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<g class="agiz-kapali"><path d="M184 224Q192 217 200 221Q208 217 216 224Q200 245 184 224Z" fill="${dudak}" stroke="${koyu(dudak, 0.2)}" stroke-width="1.5" stroke-linejoin="round"/><path d="M192 230Q200 235 208 230" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="${ruj ? 0.5 : 0.35}"/></g>` +
      `<g class="agiz-acik"><path d="M184 222Q200 217 216 222Q214 248 200 250Q186 248 184 222Z" fill="#8E2A3C"/><ellipse cx="200" cy="243" rx="9" ry="5" fill="#FF8FA3"/><path d="M184 222Q200 217 216 222" fill="none" stroke="${dudak}" stroke-width="5" stroke-linecap="round"/></g>` +
      (SUS[d.sus].yuz ? SUS[d.sus].yuz() : "") + `</g>`);
    p(model.on(sac));
    p(TOKA[d.toka].ciz ? TOKA[d.toka].ciz() : "");
    p(TAC[d.tac].ciz ? `<g data-bolge="kafa">${TAC[d.tac].ciz()}</g>` : "");
    p(GOZLUK[d.gozluk].ciz ? GOZLUK[d.gozluk].ciz() : "");
    if (sol) p(sol() + ayna(sol()));
    return parcalar.join("");
  };

  B.svg = (d, ek = "") => `<svg class="bebek-svg" viewBox="0 0 400 590" role="img" aria-label="Bebek Lila" ${ek}>${B.ciz(d)}</svg>`;

  // ---------- Küçük resimler ----------
  const kopya = (d, anahtar, i) => Object.assign({}, d, { [anahtar]: i });
  const kirp = (vb, ic) => `<svg viewBox="${vb}" aria-hidden="true">${ic}</svg>`;
  B.onizle = function (anahtar, i, d) {
    const kat = KAT[anahtar];
    const o = kat.liste[i];
    if (o.yok) return `<span class="yok-ikon" aria-hidden="true">🚫</span>`;
    if (kat.tur === "ikon") return `<span class="ikon-buyuk">${o.ikon}</span>`;
    if (kat.tur === "renk") return renkIkon(anahtar, o.c);
    const ten = TEN[d.ten].c;
    const sac = SAC_RENK[d.sacRenk].c;
    let ic;
    switch (anahtar) {
      case "elbise": ic = `<rect x="150" y="270" width="100" height="30" fill="none"/>` + o.ciz(); break;
      case "ayakkabi": ic = o.ciz(); break;
      case "sac": ic = o.arka(sac) + `<ellipse cx="200" cy="170" rx="88" ry="82" fill="${ten}"/><circle cx="162" cy="186" r="12" fill="#4A3228"/><circle cx="238" cy="186" r="12" fill="#4A3228"/><path d="M186 222Q200 236 214 222" stroke="#C45B6B" stroke-width="5" fill="none" stroke-linecap="round"/>` + o.on(sac); break;
      case "toka": ic = kapak(sac) + o.ciz(); break;
      case "kupe": ic = KUPE_SOL[i](); break;
      default: ic = o.ciz();
    }
    return kirp(kat.liste[i] && kat.kirp ? kat.kirp : "0 0 400 590", ic);
  };
  function renkIkon(anahtar, c) {
    switch (anahtar) {
      case "ruj": return kirp("0 0 60 50", `<path d="M6 26Q20 10 30 20Q40 10 54 26Q30 52 6 26Z" fill="${c}" stroke="${koyu(c, 0.25)}" stroke-width="2.5" stroke-linejoin="round"/><path d="M20 32Q30 38 40 32" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>`);
      case "far": return kirp("0 0 60 50", `<path d="M4 34Q30 2 56 34Q30 22 4 34Z" fill="${c}"/><path d="M8 38Q30 20 52 38" stroke="#4A3228" stroke-width="3.5" fill="none" stroke-linecap="round"/>`);
      case "allik": return kirp("0 0 60 60", `<defs><radialGradient id="g${c.slice(1)}"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><circle cx="30" cy="30" r="27" fill="url(#g${c.slice(1)})"/>`);
      case "oje": return kirp("0 0 50 60", `<rect x="20" y="4" width="10" height="16" rx="3" fill="#4A3A62"/><rect x="10" y="18" width="30" height="38" rx="9" fill="${c}"/><rect x="15" y="24" width="5" height="22" rx="2.5" fill="#fff" opacity=".45"/>`);
      default: return `<span class="renk-top" style="background:${c}"></span>`;
    }
  }
})();
