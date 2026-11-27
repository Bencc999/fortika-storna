import markdownIt from "markdown-it";

const md = markdownIt({ html: false, linkify: true, typographer: false });

export default function (eleventyConfig) {
  // Pliki kopiowane 1:1 (bez przetwarzania)
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/script.js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/img");

  // Bezpieczne wstawianie tekstów z panelu (znaki < > & są escapowane)
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true });

  eleventyConfig.setLibrary("md", md);

  // Rok w stopce
  eleventyConfig.addGlobalData("rok", () => new Date().getFullYear());

  // "Markdown" z panelu (pogrubienia, linki) -> HTML
  eleventyConfig.addFilter("md", (text) => md.render(String(text || "")).trim());

  // Numer telefonu do linku tel:  "42 123 45 67" -> "+48421234567"
  eleventyConfig.addFilter("telHref", (phone) => {
    let digits = String(phone || "").replace(/[^\d+]/g, "");
    if (!digits.replace("+", "")) return "+48000000000"; // numer jeszcze nie wpisany
    if (digits.startsWith("00")) digits = "+" + digits.slice(2);
    if (!digits.startsWith("+")) digits = "+48" + digits.replace(/^48(?=\d{9}$)/, "");
    return digits;
  });

  // Pełny adres obrazka do podglądu w social media
  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    try { return new URL(path, base).href; } catch { return path; }
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
