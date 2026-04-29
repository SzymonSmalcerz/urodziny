# Akta Sprawy №30 — Escape Room na 30. urodziny Kasi

Mała detektywistyczna gra na 4 grupy. Każda grupa ma osobną podstronę i mini-zadanie. Cyfry łączą się w kod do FIZYCZNEJ kłódki.

## Kod kłódki

`6 - 8 - 8 - 5` (kolejność: zielony · czerwony · niebieski · alfa = R G B + alfa)

| Grupa | URL | Zadanie | Cyfra |
|---|---|---|---|
| Zielona (informatyczna) | `/green` | otwórz DevTools, znajdź ukryty span z base64 `Y2FsbE1lKCk=`, zdekoduj → wpisz `callMe()` w konsoli | **6** (z hintem `%10` dla niebieskich) |
| Czerwona (muzyczna) | `/red` | zgadnij tytuły wszystkich bajek po fragmencie muzyki | **8** |
| Niebieska (łamigłówkowa) | `/blue` | zważ kółko fizycznie, wpisz wagę w gramach (1450–1550) | **8** |
| Kolorowa (alfa) | `/alfa` | zsumuj wagi czerwonego + niebieskiego przedmiotu (3850–4000) | **5** |

## Uruchomienie lokalne

```bash
npm install
npm start
```

Otwórz [http://localhost:3000](http://localhost:3000).

Tryb dev (auto-reload):
```bash
npm run dev
```

## Pliki muzyczne

Wrzuć `*.mp3` do `public/audio/`. Nazwa pliku = poprawna odpowiedź (bez rozszerzenia). Polskie znaki w nazwach są obsługiwane (normalizacja diakrytyków po stronie porównania).

Aktualnie w folderze: 11 bajek (Franklin, Sąsiedzi, ben10, bolekilolek, fineasziferb, gumisie, kubuśpuchatek, muminki, reksio, smerfy, tabaluga).

Po każdym restarcie serwera kolejność piosenek jest losowana.

## Deploy na Render.com

1. Wypchnij repozytorium na GitHub/GitLab.
2. Render.com → **New** → **Web Service** → wybierz repo.
3. Konfiguracja:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Render sam wystawi `PORT` w env — server.js już to obsługuje.
5. Dodaj custom domain w panelu Render (opcjonalnie).

## Deploy na Digital Ocean (lub własny VPS po SSH)

```bash
# na serwerze
git clone <repo>
cd kasia_urodziny
npm install --omit=dev

# odpalenie z PM2 (rekomendowane)
npm install -g pm2
PORT=8080 pm2 start server.js --name kasia
pm2 save
pm2 startup
```

Następnie nginx reverse proxy z `proxy_pass http://127.0.0.1:8080;` plus certyfikat z certbota.

## Struktura

```
kasia_urodziny/
├── server.js              # Express + auto-skan audio
├── package.json
├── public/
│   ├── audio/             # mp3-ki
│   ├── css/               # global + per-page
│   ├── js/                # green / red / alfa
│   └── img/               # (puste, do ewentualnych SVG)
└── views/                 # 5 stron + 404
```

## Strategia gry (dla autora)

- Grupy siedzą razem, ale każda widzi tylko swoją podstronę.
- **Zielona** dostaje `%10` — to podpowiedź dla **niebieskiej**, że ich cyfra to `waga_kółka mod 10` (1480 g → 8).
- Niebieska rozplątuje fizyczne kółko, waży, wpisuje wagę online → dostaje cyfrę 8 (wbudowany margines błędu wagi 1450–1550).
- **Kolorowa** sumuje fizyczne wagi przedmiotów (czerwony + niebieski) — suma w przedziale 3850–4000.
- Łączny kod **6885** otwiera fizyczną kłódkę.

Powodzenia! 🕵️
