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

## Część 2. Logowanie do panelu

Do panelu logujesz się kontem GitHub. Netlify tylko pośredniczy w logowaniu.

> Dlaczego nie „Netlify Identity”? Starsze poradniki do Decap CMS używają Netlify Identity
> i Git Gateway. Netlify ogłosił wycofanie obu. Według wpisu na forum Netlify Identity
> zostało jednak utrzymane, ale **Git Gateway nadal jest wycofywane**. Logowanie przez GitHub
> nie zależy od tych usług.

### Krok 1. Utwórz aplikację logowania na GitHubie
1. Na GitHubie: kliknij swoje zdjęcie, a potem **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Wypełnij:
   - **Application name:** `Panel Fortika`
   - **Homepage URL:** `https://fortika.pl` (albo adres `...netlify.app`, dopóki domena nie działa)
   - **Authorization callback URL:** `https://api.netlify.com/auth/done` (dokładnie tak)
3. Kliknij **Register application**.
4. Skopiuj **Client ID**. Kliknij **Generate a new client secret** i skopiuj też **Client secret**.
   Sekret widać tylko raz, a pokazuje się tylko Tobie. Nie wysyłaj go nikomu mailem.

### Krok 2. Wklej dane w Netlify
1. W Netlify otwórz projekt, a potem **Project configuration** (albo **Site configuration**) → **Access & security** → **OAuth**.
2. W części **Authentication providers** kliknij **Install provider** i wybierz **GitHub**.
3. Wklej **Client ID** i **Client secret**, a potem kliknij **Install**.

### Krok 3. Zaloguj się
1. Wejdź na `https://fortika.pl/admin/` (albo `https://nazwa-123.netlify.app/admin/`).
2. Kliknij **Zaloguj przez GitHub** i zatwierdź dostęp.

### Jak dodać kolejną osobę do panelu
Ta osoba zakłada darmowe konto GitHub. Ty w repozytorium klikasz
**Settings → Collaborators → Add people** i podajesz jej login. Po akceptacji zaproszenia
może logować się do `/admin`. Dostęp odbierasz w tym samym miejscu.

---

## Część 3. Zmiana treści w panelu

1. Wejdź na **fortika.pl/admin** i zaloguj się.
2. Po lewej wybierz:
   - **Strona główna**: sekcje strony w kolejności od góry (baner, usługi, dla kogo, …, kontakt),
   - **Ustawienia**: telefon, e-mail, adres, godziny pracy, Facebook, dane rejestrowe, opis dla Google,
   - **Podstrony**: polityka prywatności.
3. Kliknij sekcję i zmień tekst. Pod każdym polem jest podpowiedź, co ono zmienia.
4. Na górze kliknij **Opublikuj**, a potem **Opublikuj teraz**.
5. Poczekaj **1–2 minuty** i odśwież stronę (**Ctrl+F5**). Zmiana będzie widoczna.
   Postęp widać w Netlify, w zakładce **Deploys**.

### Przykład: wpisanie numeru telefonu
**Ustawienia → Dane firmy i kontakt → Telefon** → wpisz np. `42 123 45 67` → **Opublikuj teraz**.
Numer pojawi się w nagłówku, banerze, sekcji kontakt i stopce. Kliknięcie go na telefonie od razu dzwoni.

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
„Pokazuj sekcję opinii na stronie”.

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
