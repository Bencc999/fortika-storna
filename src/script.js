/* Fortika – interakcje strony */
(function () {
  "use strict";

  /* ---- Konfiguracja ----
     FORM_ENDPOINT: adres backendu do wysyłki formularzy (np. Formspree, własny PHP).
     Gdy pusty, formularz otwiera program pocztowy z gotową wiadomością (mailto). */
  var FORM_ENDPOINT = "";
  // E-mail i adres pochodzą z danych firmy w panelu CMS (atrybuty data-* w HTML).
  var MAIL_TO = document.body.dataset.email || "biuro@fortika.pl";
  var MAP_SRC = "https://www.google.com/maps?q=" +
    encodeURIComponent(document.getElementById("map").dataset.address ||
      "ul. Prezydenta Gabriela Narutowicza 7/9, 90-117 Łódź") + "&z=16&output=embed";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---- Nagłówek: cień po przewinięciu, mobilny pasek CTA ---- */
  var header = document.querySelector(".header");
  var mobileCta = document.querySelector(".mobile-cta");
  var hero = document.querySelector(".hero");
  var contact = document.getElementById("kontakt");

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    var pastHero = y > hero.offsetHeight * 0.7;
    var atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.6;
    mobileCta.classList.toggle("is-visible", pastHero && !atContact);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Menu mobilne ---- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  }
  burger.addEventListener("click", function () {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---- Animacje przy przewijaniu ---- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    // lekkie opóźnienie kolejnych elementów w tej samej siatce
    items.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains("reveal");
      });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i * 70, 350) + "ms";
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Mapa Google ładowana po kliknięciu (RODO) ---- */
  var mapBtn = document.getElementById("mapLoad");
  mapBtn.addEventListener("click", function () {
    var iframe = document.createElement("iframe");
    iframe.src = MAP_SRC;
    iframe.title = "Mapa: ul. Narutowicza 7/9, Łódź";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;
    document.getElementById("map").replaceChildren(iframe);
  });

  /* ---- Formularze ---- */
  function validate(form) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (field) {
      var valid = field.type === "checkbox" ? field.checked : field.value.trim() !== "";
      if (valid && field.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      if (field.type === "checkbox") {
        field.closest(".check").classList.toggle("is-invalid-check", !valid);
      } else {
        field.classList.toggle("is-invalid", !valid);
      }
      if (!valid && ok) { field.focus(); ok = false; }
    });
    return ok;
  }

  function serialize(form) {
    var lines = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === "submit") return;
      if (el.type === "checkbox") {
        if (el.name !== "Zgoda RODO") lines.push(el.name + ": " + (el.checked ? "tak" : "nie"));
        return;
      }
      if (el.value.trim()) lines.push(el.name + ": " + el.value.trim());
    });
    return lines.join("\n");
  }

  function handle(form, subject) {
    var status = form.querySelector(".form__status");
    form.addEventListener("input", function (e) {
      e.target.classList.remove("is-invalid");
      var c = e.target.closest(".check");
      if (c) c.classList.remove("is-invalid-check");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form__status";
      if (!validate(form)) {
        status.textContent = "Uzupełnij zaznaczone pola.";
        status.classList.add("is-err");
        return;
      }
      var body = serialize(form);

      if (FORM_ENDPOINT) {
        var btn = form.querySelector("[type=submit]");
        btn.disabled = true;
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        }).then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          status.textContent = "Dziękujemy! Odezwiemy się najszybciej, jak to możliwe.";
          status.classList.add("is-ok");
        }).catch(function () {
          status.textContent = "Nie udało się wysłać. Napisz do nas na " + MAIL_TO + ".";
          status.classList.add("is-err");
        }).finally(function () { btn.disabled = false; });
      } else {
        window.location.href = "mailto:" + MAIL_TO +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
        status.textContent = "Otwieramy Twój program pocztowy z gotową wiadomością…";
        status.classList.add("is-ok");
      }
    });
  }

  handle(document.getElementById("quoteForm"), "Zapytanie o wycenę obsługi księgowej");
  handle(document.getElementById("contactForm"), "Prośba o bezpłatną konsultację");
})();
