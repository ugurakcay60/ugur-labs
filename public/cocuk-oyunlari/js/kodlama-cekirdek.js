// Kodlama oyunlarının çekirdeği (DOM'suz): dünya, yorumlayıcı ve program düzenleme.
// Tarayıcıda OE.kod, Node testlerinde require ile kullanılır.
(function () {
  "use strict";

  // 0 yukarı, 1 sağ, 2 aşağı, 3 sol
  const YON = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
  ];
  const anahtar = (x, y) => x + "," + y;

  // Harita: '#' duvar, '.' boş, 'R' robot, 'H' hedef, '*' toplanacak
  function dunyaKur(bolum) {
    const satirlar = bolum.harita;
    const d = {
      gen: Math.max(...satirlar.map((s) => s.length)),
      yuk: satirlar.length,
      duvar: new Set(),
      hedef: null,
      toplanacak: new Set(),
      robot: { x: 0, y: 0, yon: bolum.yon == null ? 1 : bolum.yon },
      toplanan: 0,
    };
    satirlar.forEach((s, y) => {
      [...s].forEach((c, x) => {
        if (c === "#") d.duvar.add(anahtar(x, y));
        else if (c === "R") Object.assign(d.robot, { x, y });
        else if (c === "H") d.hedef = { x, y };
        else if (c === "*") d.toplanacak.add(anahtar(x, y));
      });
    });
    return d;
  }

  const acikMi = (d, x, y) => x >= 0 && y >= 0 && x < d.gen && y < d.yuk && !d.duvar.has(anahtar(x, y));
  const hedefte = (d) => !!d.hedef && d.robot.x === d.hedef.x && d.robot.y === d.hedef.y;

  // Programı adım adım çalıştırır; her olaydan önce dünyayı değiştirir.
  // Dönüş: { sonuc: "hedef" | "eksik" | "carpti" | "sinir" | "bos", id?, adim }
  function* calistir(program, d, { otoTopla = false, sinir = 200 } = {}) {
    if (!blokSay(program)) return { sonuc: "bos", adim: 0 };
    let adim = 0;
    let dur = null; // { sonuc, id? } — çalıştırmayı bitirir
    const r = () => ({ ...d.robot });

    function* ver(olay) {
      if (++adim > sinir) {
        dur = { sonuc: "sinir" };
        return;
      }
      yield olay;
    }

    function* git(b, yon) {
      const nx = d.robot.x + YON[yon].dx;
      const ny = d.robot.y + YON[yon].dy;
      if (!acikMi(d, nx, ny)) {
        yield* ver({ id: b.id, tur: "carp", robot: r(), x: nx, y: ny });
        if (!dur) dur = { sonuc: "carpti", id: b.id };
        return;
      }
      d.robot.x = nx;
      d.robot.y = ny;
      yield* ver({ id: b.id, tur: "adim", robot: r() });
      const k = anahtar(nx, ny);
      if (!dur && otoTopla && d.toplanacak.has(k)) {
        d.toplanacak.delete(k);
        d.toplanan++;
        yield* ver({ id: b.id, tur: "topla", robot: r(), x: nx, y: ny });
      }
    }

    function* yurut(liste) {
      for (const b of liste) {
        if (dur) return;
        switch (b.t) {
          case "git":
            yield* git(b, b.yon);
            break;
          case "ileri":
            yield* git(b, d.robot.yon);
            break;
          case "sag":
          case "sol":
            d.robot.yon = (d.robot.yon + (b.t === "sag" ? 1 : 3)) % 4;
            yield* ver({ id: b.id, tur: "don", robot: r() });
            break;
          case "topla": {
            const k = anahtar(d.robot.x, d.robot.y);
            if (d.toplanacak.has(k)) {
              d.toplanacak.delete(k);
              d.toplanan++;
              yield* ver({ id: b.id, tur: "topla", robot: r(), x: d.robot.x, y: d.robot.y });
            } else yield* ver({ id: b.id, tur: "bos-topla", robot: r() });
            break;
          }
          case "bip":
            yield* ver({ id: b.id, tur: "bip", robot: r() });
            break;
          case "goz":
            yield* ver({ id: b.id, tur: "goz", renk: b.renk, robot: r() });
            break;
          case "tekrar":
            for (let kac = 1; kac <= b.n && !dur; kac++) {
              yield* ver({ id: b.id, tur: "tur", kapId: b.id, kac, toplam: b.n, robot: r() });
              yield* yurut(b.ic);
            }
            break;
          case "varana":
            for (let kac = 1; !dur && !hedefte(d); kac++) {
              yield* ver({ id: b.id, tur: "tur", kapId: b.id, kac, robot: r() });
              yield* yurut(b.ic);
            }
            break;
          case "eger": {
            const o = YON[d.robot.yon];
            const x = d.robot.x + o.dx;
            const y = d.robot.y + o.dy;
            const acik = acikMi(d, x, y);
            yield* ver({ id: b.id, tur: "sensor", acik, x, y, robot: r() });
            yield* yurut(acik ? b.ic : b.degil || []);
            break;
          }
        }
      }
    }

    yield* yurut(program);
    if (dur) return { ...dur, adim };
    return { sonuc: hedefte(d) && d.toplanacak.size === 0 ? "hedef" : "eksik", adim };
  }

  function sonucu(program, bolum, secenek) {
    const d = dunyaKur(bolum);
    const it = calistir(program, d, secenek);
    let s = it.next();
    while (!s.done) s = it.next();
    return { ...s.value, dunya: d };
  }

  const altlar = (b) => [].concat(b.ic || [], b.degil || []);
  function blokSay(program) {
    let n = 0;
    for (const b of program) n += 1 + blokSay(altlar(b));
    return n;
  }

  // İpucu için: robotun yerinden kalan toplanacakları alıp hedefe giden en kısa yolun ilk yönü (mutlak, 0–3).
  // Zaten bittiyse ya da yol yoksa null. Durum: konum + alınanlar maskesi (BFS).
  function yolBul(d) {
    const esyalar = [...d.toplanacak];
    const tam = (1 << esyalar.length) - 1;
    const bitti = (x, y, m) => m === tam && !!d.hedef && x === d.hedef.x && y === d.hedef.y;
    if (bitti(d.robot.x, d.robot.y, 0) && !esyalar.length) return null;
    const al = (x, y, m) => {
      const i = esyalar.indexOf(anahtar(x, y));
      return i < 0 ? m : m | (1 << i);
    };
    const bas = { x: d.robot.x, y: d.robot.y, m: al(d.robot.x, d.robot.y, 0), ilk: null };
    if (bitti(bas.x, bas.y, bas.m)) return null;
    const goruldu = new Set([bas.x + "," + bas.y + "," + bas.m]);
    const kuyruk = [bas];
    while (kuyruk.length) {
      const s = kuyruk.shift();
      for (let yon = 0; yon < 4; yon++) {
        const x = s.x + YON[yon].dx;
        const y = s.y + YON[yon].dy;
        if (!acikMi(d, x, y)) continue;
        const m = al(x, y, s.m);
        const k = x + "," + y + "," + m;
        if (goruldu.has(k)) continue;
        const ilk = s.ilk == null ? yon : s.ilk;
        if (bitti(x, y, m)) return ilk;
        goruldu.add(k);
        kuyruk.push({ x, y, m, ilk });
      }
    }
    return null;
  }

  // ---------- Program düzenleme ----------
  let sonId = 1000;
  const yeniId = () => ++sonId;

  // id'li bloğu bulur: { liste (içinde durduğu dizi), sira, blok } ya da null
  function bul(program, id) {
    for (let i = 0; i < program.length; i++) {
      const b = program[i];
      if (b.id === id) return { liste: program, sira: i, blok: b };
      for (const dal of [b.ic, b.degil]) {
        const r = dal && bul(dal, id);
        if (r) return r;
      }
    }
    return null;
  }

  function cikar(program, id) {
    const r = bul(program, id);
    if (!r) return null;
    r.liste.splice(r.sira, 1);
    return r.blok;
  }

  // kapId null → ana liste; dal "ic" ya da "degil"; sira listenin sonuna sıkıştırılır
  function ekle(program, blok, { kapId = null, dal = "ic", sira = Infinity } = {}) {
    let liste = program;
    if (kapId != null) {
      const r = bul(program, kapId);
      if (!r) return false;
      liste = r.blok[dal] || (r.blok[dal] = []);
    }
    liste.splice(Math.max(0, Math.min(sira, liste.length)), 0, blok);
    return true;
  }

  // id'li blok, kapId'li bloğun içinde mi (kendisi dahil değil)?
  function icindeMi(program, kapId, id) {
    const r = bul(program, kapId);
    return !!r && !!bul(altlar(r.blok), id);
  }

  const kopya = (program) => JSON.parse(JSON.stringify(program));

  const K = { YON, anahtar, dunyaKur, calistir, sonucu, blokSay, yolBul, yeniId, bul, cikar, ekle, icindeMi, kopya };
  if (typeof module !== "undefined" && module.exports) module.exports = K;
  else window.OE.kod = K;
})();
