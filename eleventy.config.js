import fs from "node:fs";
import path from "node:path";
import markdownIt from "markdown-it";
import { MD_OPTIONS, telHref, absoluteUrl, mdFilter } from "./src/admin/filtry.js";

const md = markdownIt(MD_OPTIONS);

export default function (eleventyConfig) {
  // Pliki kopiowane 1:1 (bez przetwarzania)
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/script.js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/img");

  // Bezpieczne wstawianie tekstów z panelu (znaki < > & są escapowane)
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true });

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addGlobalData("rok", () => new Date().getFullYear());
  eleventyConfig.addFilter("md", mdFilter(md));
  eleventyConfig.addFilter("telHref", telHref);
  eleventyConfig.addFilter("absoluteUrl", absoluteUrl);

  // Podgląd w panelu: kopia szablonów i treści w /admin/podglad/,
  // z których panel składa stronę w przeglądarce w trakcie edycji.
  eleventyConfig.on("eleventy.after", ({ dir }) => {
    const cel = path.join(dir.output, "admin", "podglad");
    fs.mkdirSync(cel, { recursive: true });
    fs.copyFileSync("src/index.njk", path.join(cel, "index.njk"));
    fs.copyFileSync("src/_includes/stopka.njk", path.join(cel, "stopka.njk"));
    fs.copyFileSync("src/_includes/polityka.njk", path.join(cel, "polityka.njk"));
    fs.cpSync("src/_data", path.join(cel, "dane"), { recursive: true });
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
