// Kodlama oyunlarının bölümleri (elle hazırlanmış). Her bölümün çözülebildiğini test/kodlama.test.js doğrular.
// Harita: '#' duvar, '.' boş, 'R' Tıkır, 'H' hedef, '*' toplanacak. yon: 0 yukarı, 1 sağ (varsayılan), 2 aşağı, 3 sol.
(function () {
  "use strict";

  const TEMALAR = {
    bahce: { ad: "Meyve Bahçesi", topla: "🍎", toplaAd: "elma", hedef: "🏠", hedefAd: "ev", zemin: "#dff3c8", duvar: "🌳" },
    deniz: { ad: "Deniz Dibi", topla: "🐚", toplaAd: "deniz kabuğu", hedef: "⚓", hedefAd: "çapa", zemin: "#cdeefa", duvar: "🪨" },
    uzay: { ad: "Uzay", topla: "⭐", toplaAd: "yıldız", hedef: "🪐", hedefAd: "gezegen", zemin: "#2b2f5e", cizgi: "rgba(255,255,255,0.16)", duvar: "☄️" },
  };

  // ---------- Ada: mutlak oklar ----------
  const OK = { "↑": 0, "→": 1, "↓": 2, "←": 3 };
  const oklar = (s) => [...s].map((c) => ({ t: "git", yon: OK[c] }));
  const iki = (c) => ({ t: "tekrar", n: 2, ic: oklar(c) });
  const G = ["git"];

  const ADA = [
    { tema: "bahce", tur: "yol", harita: ["RH"], cozum: oklar("→"), yonerge: "Tıkır evine gitmek istiyor! Bir ok seç, sonra yeşil düğmeye bas." },
    { tema: "bahce", tur: "yol", harita: ["R", "H"], cozum: oklar("↓"), yonerge: "Tıkır'ı evine götür! Hangi ok?" },
    { tema: "bahce", tur: "yol", harita: ["R.H"], cozum: oklar("→→"), yonerge: "Ev biraz uzakta. Kaç ok gerekir?" },
    { tema: "bahce", tur: "yol", harita: ["R..H"], cozum: oklar("→→→"), yonerge: "Tıkır'ı evine götür. Okları say!" },
    { tema: "bahce", tur: "yol", harita: ["R.#", "#.H"], cozum: oklar("→↓→"), yonerge: "Ağaç yolu kapatmış! Etrafından dolaş." },
    { tema: "deniz", tur: "yol", harita: ["R*.", "##H"], cozum: oklar("→→↓"), yonerge: "Denizin dibine geldik! Deniz kabuğunu alıp çapaya git." },
    { tema: "deniz", tur: "yol", harita: ["R..", ".#*", "..H"], cozum: oklar("→→↓↓"), yonerge: "Önce deniz kabuğunu al, sonra çapaya git." },
    { tema: "deniz", tur: "hatabul", harita: ["R.#", "#*#", "#.H"], cozum: oklar("→↓↓→"), hazir: oklar("→↓→→"), yonerge: "Eyvah! Bir ok yanlış. Hangisi? Önce bir dene!" },
    { tema: "deniz", tur: "yol", harita: ["*.R", "..#", "H##"], cozum: oklar("←←↓↓"), yonerge: "Bu sefer kabuk öbür tarafta! Al ve çapaya git." },
    { tema: "deniz", tur: "yol", harita: ["R#H", ".*."], cozum: oklar("↓→→↑"), yonerge: "Kayanın etrafından dolaş, kabuğu da unutma!" },
    { tema: "uzay", tur: "yol", harita: ["R..#", "#.*.", "##.H"], cozum: oklar("→↓→↓→"), yonerge: "Uzaya çıktık! Yıldızı alıp gezegene uç." },
    { tema: "uzay", tur: "tahmin", harita: ["R...", "....", "...."], hazir: oklar("→→↓"), cevap: { x: 2, y: 1 }, yonerge: "Bu oklarla Tıkır nereye varacak? Kareye dokun!" },
    { tema: "uzay", tur: "yol", harita: ["#.*H", "#.##", "R.##"], cozum: oklar("→↑↑→→"), yonerge: "Yukarı, yukarı! Yıldızı al, gezegene var." },
    { tema: "uzay", tur: "tahmin", harita: ["....", "....", "R..."], hazir: oklar("↑→→↑"), cevap: { x: 2, y: 0 }, yonerge: "Tıkır bu oklarla nereye gidecek? Kareye dokun!" },
    { tema: "uzay", tur: "yol", harita: ["R..", "##.", "##H"], cozum: [iki("→"), iki("↓")], yonerge: "Yeni bir kart var: iki kez! Ona dokun, sonra bir ok seç. Ok iki kez yapılır.", bloklar: ["git", "tekrar"] },
  ].map((b) => ({ bloklar: G, ...b }));

  // ---------- Ayaz: göreli bloklar ----------
  const i = () => ({ t: "ileri" });
  const sa = () => ({ t: "sag" });
  const so = () => ({ t: "sol" });
  const to = () => ({ t: "topla" });
  const bip = () => ({ t: "bip" });
  const T = (n, ...ic) => ({ t: "tekrar", n, ic });
  const V = (...ic) => ({ t: "varana", ic });
  const E = (ic, degil) => ({ t: "eger", kosul: "onAcik", ic, degil });

  const B1 = ["ileri", "sag", "sol"];
  const B2 = [...B1, "topla"];
  const B3 = [...B2, "bip", "goz"];
  const B9 = [...B3, "tekrar"];
  const B15 = [...B9, "eger"];
  const B18 = [...B15, "varana"];

  const AYAZ = [
    { tema: "bahce", tur: "yol", kavram: "Sıra", bloklar: B1, harita: ["R..H"], cozum: [i(), i(), i()],
      yonerge: "Tıkır'ı eve götür. “İleri git” bloğunu programa sürükle, sonra Çalıştır'a bas.",
      ipuclari: ["Her “İleri git” Tıkır'ı bir kare ilerletir.", "Ev 3 kare ötede."] },
    { tema: "bahce", tur: "yol", kavram: "Sıra", bloklar: B2, harita: ["R.*.H"], cozum: [i(), i(), to(), i(), i()],
      yonerge: "Yolda bir elma var! Üstüne gelince “Topla” bloğunu kullan.",
      ipuclari: ["Elma 2 kare ötede.", "İleri, ileri, topla, sonra eve kadar ileri."] },
    { tema: "bahce", tur: "yol", kavram: "Sıra", bloklar: B3, harita: ["R.*H"], cozum: [i(), i(), to(), i(), bip()],
      yonerge: "Elmayı topla, eve varınca “Bip çal” ile sevincini göster! İstersen göz rengini de değiştir.",
      ipuclari: ["“Bip çal” ve “Göz rengi” Tıkır'ı yürütmez; eğlence içindir.", "İleri, ileri, topla, ileri, bip."] },
    { tema: "bahce", tur: "yol", kavram: "Dönüşler", bloklar: B3, harita: ["R.#", "#.#", "#.H"], cozum: [i(), sa(), i(), i(), so(), i()],
      yonerge: "Dönme zamanı! “Sağa dön” Tıkır'ı yerinde çevirir, yürütmez. Sağ ve sol, Tıkır'ın kendi sağı ve solu.",
      ipuclari: ["Takılırsan “Tıkır'ın gözünden” düğmesine bas.", "Bir ileri, sağa dön, iki ileri, sola dön, bir ileri."] },
    { tema: "bahce", tur: "tahmin", kavram: "Kod okuma", bloklar: B3, harita: ["R...", "....", "...."], hazir: [i(), i(), sa(), i(), so(), i()], cevap: { x: 3, y: 1 },
      yonerge: "Bu kod çalışınca Tıkır nerede duracak? Kafanda çalıştır, sonra kareye dokun.",
      ipuclari: ["Her bloğu sırayla parmağınla takip et.", "Sağa dönünce Tıkır aşağı bakar."] },
    { tema: "bahce", tur: "yol", kavram: "Dönüşler", bloklar: B3, yon: 2, harita: ["R##", ".##", "..H"], cozum: [i(), i(), so(), i(), i()],
      yonerge: "Dikkat! Tıkır bu sefer aşağı bakıyor. Onun solu senin solun değil!",
      ipuclari: ["Aşağı bakan Tıkır sola dönünce ekranda sağa bakar.", "İki ileri, sola dön, iki ileri."] },
    { tema: "bahce", tur: "hatabul", kavram: "Hata ayıklama", bloklar: B3, harita: ["R.#", "#.#", "#.*", "##H"],
      cozum: [i(), sa(), i(), i(), so(), i(), to(), sa(), i()], hazir: [i(), sa(), i(), i(), sa(), i(), to(), sa(), i()],
      yonerge: "Bu programda bir hata var. Adım adım çalıştır, hatalı bloğu bul ve düzelt!",
      ipuclari: ["“Adım adım” ile Tıkır'ın nerede yanlış döndüğüne bak.", "Beşinci blok yanlış yöne dönüyor."] },
    { tema: "deniz", tur: "hatabul", kavram: "Hata ayıklama", bloklar: B3, harita: ["R..", "##.", "H.."],
      cozum: [i(), i(), sa(), i(), i(), sa(), i(), i()], hazir: [i(), i(), sa(), i(), i(), so(), i(), i()],
      yonerge: "Deniz dibinde bir hata daha! Programı düzelt, Tıkır çapaya varsın.",
      ipuclari: ["Tıkır aşağı inince hangi yöne dönmeli?", "İkinci dönüş de “Sağa dön” olmalı."] },
    { tema: "deniz", tur: "yol", kavram: "Döngü", bloklar: B9, sinir: 2, harita: ["R.....H"], cozum: [T(6, i())],
      yonerge: "Sadece 2 bloğun var! “Kez tekrarla” bloğu içindekini tekrar tekrar yapar. Sayıya dokunup değiştir.",
      ipuclari: ["“İleri git”i tekrarla bloğunun içine bırak.", "Çapa 6 kare ötede: 6 kez tekrarla."] },
    { tema: "deniz", tur: "tahmin", kavram: "Kod okuma", bloklar: B9, harita: ["R....", ".....", "....."], hazir: [T(2, i(), i(), sa())], cevap: { x: 2, y: 2 },
      yonerge: "Bu döngü çalışınca Tıkır nerede duracak? Kareye dokun.",
      ipuclari: ["İçerdeki üç blok iki kez yapılır.", "İlk turda Tıkır 2 ileri gidip aşağı döner."] },
    { tema: "deniz", tur: "yol", kavram: "Döngü", bloklar: B9, sinir: 4, harita: ["R*.*.*H"], cozum: [T(3, i(), to(), i())],
      yonerge: "Üç deniz kabuğu var. Bir örüntü görüyor musun? 4 blokla çöz!",
      ipuclari: ["Hep aynı şey tekrar ediyor: ileri, topla, ileri.", "Bu üç bloğu 3 kez tekrarla."] },
    { tema: "deniz", tur: "yol", kavram: "Döngü", bloklar: B9, sinir: 5, harita: ["R####", "..###", "#..##", "##..#", "###.H"], cozum: [T(4, sa(), i(), so(), i())],
      yonerge: "Merdiven! Bir basamağı nasıl inersin? Sonra onu tekrarla.",
      ipuclari: ["Bir basamak: sağa dön, ileri, sola dön, ileri.", "Bu basamağı 4 kez tekrarla."] },
    { tema: "deniz", tur: "yol", kavram: "İç içe döngü", bloklar: B9, sinir: 7, harita: ["R..*", "H##.", ".##.", "*..*"], cozum: [T(3, T(3, i()), to(), sa()), i(), i()],
      yonerge: "Köşelerdeki kabukları topla ve çapaya dön. Döngünün içine döngü koyabilirsin!",
      ipuclari: ["Bir kenar: 3 ileri, topla, sağa dön.", "Kenarı 3 kez tekrarla, sonra 2 ileri git."] },
    { tema: "deniz", tur: "yol", kavram: "İç içe döngü", bloklar: B9, sinir: 7,
      harita: ["R..####", "##.####", "##...##", "####.##", "####...", "######.", "######H"],
      cozum: [T(3, T(2, i()), sa(), T(2, i()), so())],
      yonerge: "Büyük merdiven! Her basamak 2 kare. 7 blokla çözebilir misin?",
      ipuclari: ["Bir basamak: 2 ileri, sağa dön, 2 ileri, sola dön.", "İçteki “2 ileri”yi de döngüyle yap."] },
    { tema: "uzay", tur: "yol", kavram: "Eğer", bloklar: B15, sinir: 4, harita: ["R...#", "###.#", "###H#"], cozum: [T(6, E([i()], [sa()]))],
      yonerge: "Tıkır'ın sensörü var! “Eğer önün açıksa” önüne bakar: açıksa ilk kısmı, değilse ikinci kısmı yapar.",
      ipuclari: ["Önü açıksa ileri git, değilse sağa dön.", "Bu kararı 6 kez tekrarla."] },
    { tema: "uzay", tur: "tahmin", kavram: "Kod okuma", bloklar: B15, harita: ["R..#", "....", "...."], hazir: [T(4, E([i()], [sa()]))], cevap: { x: 2, y: 1 },
      yonerge: "Sensörlü bu kod çalışınca Tıkır nerede duracak? Kareye dokun.",
      ipuclari: ["Her turda Tıkır önüne bakar.", "Üçüncü turda önü kapalı, sağa döner."] },
    { tema: "uzay", tur: "yol", kavram: "Eğer", bloklar: B15, sinir: 4, harita: ["H..#", "##.#", "R..#"], cozum: [T(8, E([i()], [so()]))],
      yonerge: "Bu sefer yol hep sola kıvrılıyor. 4 blokla gezegene ulaş!",
      ipuclari: ["Önü kapalıysa sola dön.", "Toplam 8 tur yeter."] },
    { tema: "uzay", tur: "yol", kavram: "Hedefe varana kadar", bloklar: B18, sinir: 4, harita: ["R....#", "####.#", "##H..#"], cozum: [V(E([i()], [sa()]))],
      yonerge: "Yeni blok: “Hedefe varana kadar tekrarla”. Kaç tur gerektiğini saymana gerek yok!",
      ipuclari: ["Önü açıksa ileri, değilse sağa dön.", "Bu kararı hedefe varana kadar tekrarla."] },
    { tema: "uzay", tur: "yol", kavram: "Hedefe varana kadar", bloklar: B18, sinir: 4,
      harita: ["......", ".####.", "H####.", "#####.", "R....."], cozum: [V(E([i()], [so()]))],
      yonerge: "Uzun bir uzay yolu! Aynı kısa kod uzun yolu da çözer mi?",
      ipuclari: ["Yol hep sola dönüyor.", "Hedefe varana kadar: önü açıksa ileri, değilse sola dön."] },
    { tema: "uzay", tur: "tahmin", kavram: "Final", bloklar: B18, harita: ["R..#.", ".....", "....."], hazir: [T(2, T(2, i()), sa()), i()], cevap: { x: 1, y: 2 },
      yonerge: "Final sorusu! Bu kod çalışınca Tıkır nerede duracak? Kareye dokun.",
      ipuclari: ["İçteki döngü 2 ileri gider, sonra sağa döner.", "Bu iki kez olur, en sonda bir ileri daha."] },
  ];

  const D = { TEMALAR, ADA, AYAZ };
  if (typeof module !== "undefined" && module.exports) module.exports = D;
  else window.OE.kodBolumler = D;
})();
