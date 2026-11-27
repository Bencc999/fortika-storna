// Wspólne funkcje dla budowania strony (Eleventy) i podglądu w panelu (przeglądarka).
// Dzięki temu podgląd w panelu wygląda dokładnie tak jak opublikowana strona.

export const MD_OPTIONS = { html: false, linkify: true, typographer: false };

// Numer telefonu do linku tel:  "42 123 45 67" -> "+48421234567"
export function telHref(phone) {
  let digits = String(phone || "").replace(/[^\d+]/g, "");
  if (!digits.replace("+", "")) return "+48000000000"; // numer jeszcze nie wpisany
  if (digits.startsWith("00")) digits = "+" + digits.slice(2);
  if (!digits.startsWith("+")) digits = "+48" + digits.replace(/^48(?=\d{9}$)/, "");
  return digits;
}

// Pełny adres obrazka do podglądu w social media
export function absoluteUrl(path, base) {
  try { return new URL(path, base).href; } catch { return path; }
}

// Tekst z edytora (pogrubienia, linki, listy) -> HTML
export function mdFilter(md) {
  return (text) => md.render(String(text || "")).trim();
}
