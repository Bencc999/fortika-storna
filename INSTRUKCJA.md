# Strona Fortika z panelem treści – instrukcja

Strona działa tak:

```
Panel /admin (Decap CMS)  →  zapis w repozytorium GitHub  →  Netlify sam buduje stronę  →  fortika.pl
```

Treści są w plikach `src/_data/*.json` (teksty, usługi, cennik, FAQ, opinie, dane kontaktowe)
i `src/polityka-prywatnosci.md`. Zdjęcia wgrane w panelu trafiają do `src/img/uploads/`.
Wygląd (`src/index.njk`, `src/styles.css`) jest oddzielony od treści i panel go nie zmienia.

Wszystko poniżej da się zrobić w przeglądarce, bez instalowania czegokolwiek.
Nazwy przycisków w GitHubie i Netlify mogą się nieco różnić, bo te serwisy co jakiś czas zmieniają wygląd.

---

## Część 1. Publikacja strony na Netlify

### Krok 1. Konto i repozytorium na GitHubie
1. Załóż darmowe konto na **github.com**. Twój login będzie potrzebny za chwilę.
2. Kliknij **+** (prawy górny róg), a potem **New repository**.
3. Nazwa: `fortika`. Wybierz **Private** (prywatne, panel działa także z nim). Kliknij **Create repository**.

### Krok 2. Wpisz nazwę repozytorium w konfiguracji panelu
Otwórz plik `src/admin/config.yml` w Notatniku i zmień linię:

```yaml
  repo: TWOJ-LOGIN-GITHUB/fortika
```

na swój login, np. `repo: jankowalski/fortika`. Zapisz plik.

### Krok 3. Wgraj pliki do repozytorium
1. Na stronie nowego repozytorium kliknij link **uploading an existing file**.
2. Przeciągnij do okna **całą zawartość folderu projektu** (pliki i foldery, w tym `src`).
   **Nie wgrywaj** folderów `node_modules` i `_site`, jeśli są w folderze (to pliki tymczasowe).
3. Na dole kliknij **Commit changes**.

> Wygodniej robi się to w darmowym programie **GitHub Desktop**: wskazujesz folder,
> a on sam pomija `node_modules` i `_site` (dzięki plikowi `.gitignore`).

### Krok 4. Podłącz repozytorium do Netlify
1. Załóż darmowe konto na **netlify.com**. Najprościej przyciskiem „Sign up with GitHub”.
2. Kliknij **Add new project** (albo **Add new site**), a potem **Import an existing project** i **GitHub**.
3. Zezwól Netlify na dostęp do repozytorium `fortika` i wybierz je z listy.
4. Ustawienia budowania wypełnią się same z pliku `netlify.toml`
   (polecenie `npm run build`, folder `_site`). Kliknij **Deploy**.
5. Po 1–2 minutach strona będzie dostępna pod adresem w rodzaju `https://nazwa-123.netlify.app`.

### Krok 5. Własna domena fortika.pl
1. W Netlify: **Domain management**, a potem **Add a domain** i wpisz `fortika.pl`.
2. Netlify pokaże, co ustawić w DNS. Zrób to w panelu firmy, w której jest zarejestrowana domena
   (np. home.pl, OVH, nazwa.pl). Zmiana DNS zaczyna działać po kilku minutach do 24 godzin.
3. Certyfikat HTTPS Netlify włączy automatycznie.

---

## Część 2. Logowanie do panelu e-mailem i hasłem (DecapBridge)

Do panelu loguje się **e-mailem i hasłem**, bez konta GitHub. Logowanie obsługuje
**DecapBridge** (decapbridge.com). W darmowym planie pozwala na 3 strony i 10 osób na stronę.
Zmiany z panelu DecapBridge zapisuje w repozytorium na GitHubie, a Netlify jak dotąd sam przebudowuje stronę.

Konfigurację robisz raz (kroki 1–4). Potem tylko zapraszasz kolejne osoby (krok 5).

> Nazwy przycisków w DecapBridge mogą się trochę różnić od opisanych, bo serwis się rozwija.

### Krok 1. Załóż konto w DecapBridge
1. Wejdź na **decapbridge.com** i kliknij **Sign up** (albo **Get started**).
2. Zarejestruj się e-mailem i hasłem (albo kontem Google).
3. Potwierdź adres e-mail, jeśli przyjdzie wiadomość z linkiem.

### Krok 2. Utwórz token dostępu na GitHubie
DecapBridge potrzebuje zgody na zapisywanie zmian w repozytorium. Daje się ją tokenem:

1. Na GitHubie kliknij swoje zdjęcie, a potem **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Wypełnij:
   - **Token name:** `DecapBridge Fortika`
   - **Expiration:** najdłuższy możliwy termin, np. 1 rok. Zapisz sobie w kalendarzu datę wygaśnięcia.
   - **Repository access:** **Only select repositories** i wybierz `Bencc999/fortika-storna`
   - **Permissions → Repository permissions → Contents:** **Read and write**
     (uprawnienie **Metadata: Read-only** doda się samo)
3. Kliknij **Generate token** i **skopiuj token**. Widać go tylko raz.
   Nie wysyłaj go nikomu: daje dostęp do zapisu w repozytorium.

### Krok 3. Dodaj stronę w DecapBridge
1. W DecapBridge kliknij **Add site** / **New site**.
2. Wypełnij (pola mogą się nazywać trochę inaczej):
   - **Repozytorium:** `Bencc999/fortika-storna`
   - **Gałąź (branch):** `main`
   - **Token dostępu (Git access token):** wklej token z kroku 2
   - **Adres panelu (CMS / login URL):** `https://fortika-storna.netlify.app/admin/`
     (po podpięciu domeny dodaj też `https://fortika.pl/admin/`)
3. Zapisz. DecapBridge pokaże **Site ID** (długi ciąg w rodzaju `3a50bd5e-79a1-…`)
   albo gotowy fragment pliku `config.yml` z linią `identity_url`. Skopiuj Site ID.

### Krok 4. Wklej Site ID do konfiguracji panelu
Najprościej w przeglądarce, na GitHubie:
1. Otwórz repozytorium **Bencc999/fortika-storna** i wejdź w plik `src/admin/config.yml`.
2. Kliknij ikonę **ołówka** (Edit this file).
3. Znajdź linię:
   ```yaml
     identity_url: https://auth.decapbridge.com/sites/WKLEJ-SITE-ID-Z-DECAPBRIDGE
   ```
   i zamień `WKLEJ-SITE-ID-Z-DECAPBRIDGE` na swój Site ID. Reszty linii nie zmieniaj.
4. Kliknij **Commit changes…** i jeszcze raz **Commit changes**.
5. Po 1–2 minutach Netlify opublikuje zmianę. Logowanie e-mailem zacznie działać.

> Możesz też przesłać Site ID osobie technicznej, żeby wkleiła go za Ciebie. Site ID nie jest tajny.

### Krok 5. Dodaj klienta (lub siebie) jako użytkownika
1. W DecapBridge otwórz stronę **fortika-storna**, a potem zakładkę **Collaborators** (albo **Users**).
2. Kliknij **Invite** i wpisz **e-mail klienta**. Wyślij zaproszenie.
3. Jeśli chcesz też sam edytować treści, a nie widzisz siebie na liście, zaproś również swój adres.

Dostęp odbierasz w tym samym miejscu, usuwając osobę z listy.
W darmowym planie możesz mieć do 10 osób na stronę.

### Krok 6. Co robi klient przy pierwszym logowaniu
1. Klient dostaje e-mail z zaproszeniem od DecapBridge. Warto go uprzedzić, żeby zajrzał też do spamu.
2. Klika link w wiadomości i **ustawia sobie hasło**. Może też wybrać logowanie kontem Google lub Microsoft.
3. Wchodzi na **https://fortika-storna.netlify.app/admin/**, wpisuje **e-mail i hasło** i klika **Zaloguj się**.

**Zapomniane hasło:** klient może ustawić nowe na stronie logowania DecapBridge
(link „Forgot password”). Jeśli go nie znajdzie, wyślij mu zaproszenie jeszcze raz.

### Ważne: token wygasa
Gdy token z kroku 2 wygaśnie, panel przestanie zapisywać zmiany. Wtedy utwórz na GitHubie
nowy token (krok 2) i podmień go w ustawieniach strony w DecapBridge. Site ID się nie zmienia.

### Stare logowanie przez GitHub
Po przejściu na DecapBridge aplikacja OAuth na GitHubie i dostawca GitHub w Netlify
(Access & security → OAuth) nie są już potrzebne. Możesz je usunąć.

---

## Część 3. Zmiana treści w panelu

1. Wejdź na **fortika-storna.netlify.app/admin** (po podpięciu domeny: **fortika.pl/admin**) i zaloguj się.
2. Po lewej wybierz:
   - **Logo, telefon, adres i godziny**: logo, telefon, e-mail, adres, godziny pracy, Facebook, dane rejestrowe,
   - **Sekcje strony głównej**: sekcje w kolejności od góry (baner, usługi, dla kogo, …, kontakt),
   - **Polityka prywatności**,
   - **Google i Facebook (rzadko zmieniane)**: opis strony w wynikach Google i po udostępnieniu linku.
3. Kliknij sekcję i zmień tekst. Pod każdym polem jest podpowiedź, co ono zmienia.
   **Po prawej widzisz podgląd** tej części strony. Zmienia się na bieżąco, w trakcie pisania.
   Ikoną oka (👁) w prawym górnym rogu podglądu możesz go ukryć albo pokazać.
4. Na górze kliknij **Opublikuj**, a potem **Opublikuj teraz**.
5. Poczekaj **1–2 minuty** i odśwież stronę (**Ctrl+F5**). Zmiana będzie widoczna.
   Postęp widać w Netlify, w zakładce **Deploys**.

### Przykład: wpisanie numeru telefonu
**Logo, telefon, adres i godziny → Logo i dane kontaktowe firmy → Numer telefonu** → wpisz np. `42 123 45 67` → **Opublikuj teraz**.
Numer pojawi się w nagłówku, banerze, sekcji kontakt i stopce. Kliknięcie go na telefonie od razu dzwoni.

### Logo firmy
**Logo, telefon, adres i godziny → Logo i dane kontaktowe firmy**, a potem pola:
- **Logo firmy**: w nagłówku strony (na białym tle),
- **Logo na ciemne tło (stopka)**: jasna wersja do granatowej stopki,
- **Ikonka na karcie przeglądarki**: mały kwadratowy znak.

Najlepiej plik SVG albo PNG z przezroczystym tłem. Dopóki pola są puste, widać obecny znak „F Fortika”.

### Zespół i zdjęcia pracowników
**Sekcje strony głównej → 5. Nasz zespół**:
- **Wspólne zdjęcie całego zespołu**: duże, poziome zdjęcie nad kartami (opcjonalnie),
- **Pracownicy → Dodaj pracownika**: zdjęcie (pionowe), imię i nazwisko, stanowisko, kilka słów, e-mail i telefon (opcjonalnie).

Dopóki nie dodasz nikogo, na stronie widać trzy puste ramki. Sekcję możesz ukryć przełącznikiem „Pokazuj sekcję zespołu”.
Zdjęcia i dane pracowników publikuj tylko za ich zgodą.
### Listy (usługi, FAQ, opinie, cennik, kroki)
- **Dodaj:** przycisk „Dodaj …” na górze listy.
- **Usuń:** ikona **×** przy pozycji.
- **Zmień kolejność:** przeciągnij pozycję za uchwyt (poziome kreski).
- **Rozwiń lub zwiń:** strzałka po lewej stronie pozycji.

### Zdjęcia
W polu ze zdjęciem kliknij **Wybierz obraz**, a potem **Wgraj** i wskaż plik z komputera.
Wszystkie wgrane pliki są też w zakładce **Multimedia** u góry panelu.
Zanim wgrasz zdjęcie, zmniejsz je do rozmiaru z podpowiedzi (np. 1200×800 px). Strona będzie się szybciej ładować.

### Opinie klientów
Dopóki lista opinii jest pusta, na stronie widać trzy puste ramki. Po dodaniu pierwszej
prawdziwej opinii ramki znikną. Sekcję można też całkiem ukryć przełącznikiem
„Pokazuj sekcję opinii” w sekcji **7. Opinie klientów**.

### Coś poszło nie tak? Cofnięcie zmiany
Każda publikacja jest zapisywana. W Netlify wejdź w **Deploys**, kliknij wcześniejszą wersję,
a potem **Publish deploy**. Strona od razu wróci do tamtej wersji.

---

## Dla osoby technicznej (opcjonalnie)

Wymaga Node.js 18+.

```powershell
npm install
npm start            # podgląd strony na http://localhost:8080 z odświeżaniem
npx decap-server     # w drugim oknie: panel http://localhost:8080/admin/ bez logowania
```

- Szablon strony: `src/index.njk`, stopka: `src/_includes/stopka.njk`, ikony: `src/_data/ikony.js`.
- Konfiguracja panelu: `src/admin/config.yml`.
- Formularze: aby wysyłały się bez programu pocztowego, ustaw `FORM_ENDPOINT` w `src/script.js`
  (np. Netlify Forms lub Formspree).
