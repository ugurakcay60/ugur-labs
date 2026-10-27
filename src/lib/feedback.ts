// Geri bildirim formu Web3Forms üzerinden e-postaya gider (statik sitede sunucu yok).
// Erişim anahtarı tarayıcıda görünür olacak şekilde tasarlanmıştır; gizli değildir, sadece
// mesajların hangi e-postaya gideceğini belirler. Anahtar: https://web3forms.com
export const WEB3FORMS_ACCESS_KEY = "0076b08a-57cd-4feb-88a9-72173878f27e";

// Web3Forms ücretsiz planının ortak hCaptcha site anahtarı; doğrulamayı Web3Forms sunucuda yapar
export const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

export const MESSAGE_MAX = 2000;

export type FeedbackFields = { message: string; name: string; email: string; botcheck: boolean };

export async function sendFeedback(fields: FeedbackFields, captchaToken: string, lang: string): Promise<boolean> {
  if (!WEB3FORMS_ACCESS_KEY) return false;
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Ugur Labs geri bildirim (${lang.toUpperCase()})`,
        from_name: "ugur-labs.com",
        message: fields.message,
        // Boş alanlar gönderilmez; e-posta verilirse yanıt adresi olur
        ...(fields.name && { name: fields.name }),
        ...(fields.email && { email: fields.email }),
        botcheck: fields.botcheck,
        "h-captcha-response": captchaToken,
      }),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    return res.ok && data?.success === true;
  } catch {
    return false;
  }
}
