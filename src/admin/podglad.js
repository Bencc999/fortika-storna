// Podgląd na żywo w panelu: składa stronę z tych samych szablonów co Eleventy,
// podstawiając treść, którą właśnie edytujesz (jeszcze przed publikacją).
import { MD_OPTIONS, telHref, absoluteUrl, mdFilter } from "./filtry.js";

const { CMS, h, createClass, nunjucks, markdownit } = window;
const md = markdownit(MD_OPTIONS);

const PLIKI = ["firma", "seo", "hero", "uslugi", "dla_kogo", "dlaczego", "kroki", "wycena", "opinie", "faq", "kontakt"];

// Które fragmenty strony pokazać w podglądzie przy edycji danego pliku
const FRAGMENTY = {
  hero: [".header", ".hero"],
  uslugi: ["#uslugi"],
  dla_kogo: ["#dla-kogo"],
  dlaczego: ["#dlaczego"],
  kroki: ["#jak-zaczac"],
  wycena: ["#wycena"],
  opinie: ["#opinie"],
  faq: ["#faq"],
  kontakt: ["#kontakt"],
  firma: [".header", ".hero", "#kontakt", ".footer"],
};

const BAZA = "/admin/podglad/";
const tekst = (p) => fetch(BAZA + p, { cache: "no-cache" }).then((r) => {
  if (!r.ok) throw new Error(p);
  return r.text();
});
const bezFrontMatter = (s) => s.replace(/^---[\s\S]*?---\s*/, "");

const gotowe = (async () => {
  const [index, stopka, polityka, ikony, ...dane] = await Promise.all([
    tekst("index.njk"),
    tekst("stopka.njk"),
    tekst("polityka.njk"),
    import(BAZA + "dane/ikony.js"),
    ...PLIKI.map((n) => tekst(`dane/${n}.json`).then(JSON.parse)),
  ]);
  const env = new nunjucks.Environment(null, { autoescape: true });
  env.addFilter("md", mdFilter(md));
  env.addFilter("telHref", telHref);
  env.addFilter("absoluteUrl", absoluteUrl);
  env.addGlobal("rok", new Date().getFullYear());
  const szablonStrony = bezFrontMatter(index).replace(/\{%-?\s*include\s+"stopka\.njk"\s*-?%\}/, stopka);
  const data = { ikony: ikony.default };
  PLIKI.forEach((n, i) => (data[n] = dane[i]));
  return {
    glowna: nunjucks.compile(szablonStrony, env),
    polityka: nunjucks.compile(polityka, env),
    data,
  };
})();

// Z pełnego dokumentu HTML zostawia samą treść <body> (bez skryptów)
function trescBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return (m ? m[1] : html).replace(/<script[\s\S]*?<\/script>/gi, "");
}

// Zdjęcia wgrane przed publikacją nie są jeszcze na serwerze – panel podaje ich tymczasowy adres
function podmienZdjecia(html, getAsset) {
  return html.replace(/(src|content)="(\/img\/uploads\/[^"]+)"/g, (_, atr, sciezka) => `${atr}="${getAsset(sciezka)}"`);
}

// Zostawia tylko wybrane fragmenty strony (np. samą sekcję FAQ)
function wybierzFragmenty(html, selektory) {
  if (!selektory) return html;
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  return selektory.map((s) => (doc.querySelector(s) || {}).outerHTML || "").join("");
}

function utworzPodglad(nazwa, renderuj) {
  return createClass({
    componentDidMount() {
      gotowe
        .then((z) => { this.z = z; this.forceUpdate(); })
        .catch(() => { this.blad = true; this.forceUpdate(); });
    },
    render() {
      const info = (t) => h("p", { style: { padding: "2rem", fontFamily: "sans-serif", color: "#5a6878" } }, t);
      if (this.blad) return info("Nie udało się wczytać podglądu. Zmiany możesz zapisać normalnie.");
      if (!this.z) return info("Wczytywanie podglądu…");
      const wpis = this.props.entry.getIn(["data"]).toJS();
      let html;
      try {
        html = renderuj(this.z, wpis);
      } catch (e) {
        return info("Podgląd chwilowo niedostępny: uzupełnij wymagane pola.");
      }
      html = wybierzFragmenty(trescBody(html), FRAGMENTY[nazwa]);
      if (!html.trim()) return info("Ta sekcja jest teraz ukryta na stronie.");
      html = podmienZdjecia(html, (p) => String(this.props.getAsset(p)));
      return h("div", { dangerouslySetInnerHTML: { __html: html } });
    },
  });
}

// Sekcje strony głównej i dane firmy: cała strona z podmienioną edytowaną częścią
for (const nazwa of Object.keys(FRAGMENTY)) {
  CMS.registerPreviewTemplate(nazwa, utworzPodglad(nazwa, (z, wpis) =>
    z.glowna.render({ ...z.data, [nazwa]: wpis })));
}

// Polityka prywatności
CMS.registerPreviewTemplate("polityka", utworzPodglad("polityka", (z, wpis) =>
  z.polityka.render({ ...z.data, ...wpis, content: md.render(String(wpis.body || "")) })));

// Style strony w okienku podglądu
CMS.registerPreviewStyle("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap");
CMS.registerPreviewStyle("/styles.css");
CMS.registerPreviewStyle(
  ".reveal{opacity:1!important;transform:none!important}" +
  ".mobile-cta{display:none!important}body{padding-bottom:0!important}" +
  "*,*::before,*::after{transition:none!important}" +
  ".header{position:static!important}" +
  "@media (max-width:1023px){.nav{display:none!important}}" +
  "a{pointer-events:none}", // kliknięcia w podglądzie nic nie psują
  { raw: true }
);
