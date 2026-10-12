---
name: risultato-partita
description: Cosa fare quando si inserisce nel sito il risultato di una partita già giocata (punteggio, tabellino, classifica, articolo, galleria foto). Usala ogni volta che l'utente dà un risultato, un tabellino, un recap o delle foto di una partita della Virtus Velletri.
---

# Inserire una partita giocata

Il sito è Next.js con export statico. Tutto il contenuto sta in `content/`. Rispondi in italiano.
Non fare commit né deploy se l'utente non lo chiede (il deploy va prima su `/nuovo`, vedi `GUIDA-CMS-E-DEPLOY.md`).

## Cosa chiedere se manca (non inventare mai)

- punteggio finale e parziali dei quarti
- punti di ogni giocatore (numero, nome e cognome)
- allenatore, vice allenatore, dirigenti
- classifica aggiornata
- foto

L'utente di solito incolla il testo dal sito della federazione o manda screenshot dell'app (recap IA, tabellino, classifica). I minuti e i tiri liberi di quegli screenshot **non vanno pubblicati**: l'utente li ha esclusi.

## 1. Dati della partita: `content/matches/<squadra>.md`

Trova l'evento giusto (stesso titolo e data) e aggiungi i campi. Non cambiare titolo o data: lo slug della pagina (`/partite/<slug>/`) nasce da `titolo + data`.

```yaml
  - title: "Virtus Velletri vs Casilino 23"
    date: "2026-10-11"
    time: "19:00"
    location: "..."
    category: "DR1"
    score: "67-43"                       # sempre CASA-OSPITE, come nel titolo
    quarters: "13-15, 19-7, 18-12, 17-9" # un Qn per quarto, sempre CASA-OSPITE
    coach: "Luca Mei"
    assistantCoach: "Claudio Pesoli"
    officials: ["Stefano Cerini", "Tania Di Clemente"]
    players:
      - { number: 9, name: "Raffaele Sica", points: 2, starter: true }
      - { number: 3, name: "Andrea Borro", points: 12 }
```

- Ordine di casa/ospite: se la Virtus gioca fuori casa il suo punteggio è il secondo. Punteggio e parziali devono seguire lo stesso ordine del titolo. Un errore qui ha già capovolto un parziale (15-13 scritto 13-15): ricontrolla.
- `name`: nome e cognome. Giocatori in ordine di numero di maglia. Anche chi ha 0 punti va elencato.
- `starter: true` per chi parte in quintetto. Negli screenshot sono i giocatori col pallino verde: è un'ipotesi da far confermare all'utente la prima volta. Se nessuno ha `starter`, la tabella non divide in Quintetto e Panchina.
- Somma i punti dei giocatori: deve fare il punteggio della Virtus (la pagina calcola il totale da sola).
- Con `players` compilato la pagina partita nasconde data, ora e campo di gioco e mostra il tabellino (tabella dei parziali + giocatori col numero piccolo accanto al nome).
- Il calendario di squadra (`/calendario/<squadra>/`) mostra da solo la card "giocata": striscia verde/rossa, vittoria/sconfitta e punteggio grande. Funziona se `score` è nel formato `n-n` e il titolo è `A vs B`.

## 2. Classifica: `content/standings/<squadra>.md`

Aggiorna ogni riga di `table` (`rank`, `team`, `points`, `played`, `won`, `lost`) con la classifica della federazione, nell'ordine in classifica. Differenza canestri e serie non hanno colonne. Nel widget la Virtus ha il logo accanto al nome.

## 3. Articolo: `content/news/AAAA-MM-GG-slug.md`

```yaml
---
title: "DR1, esordio vincente al Polivalente: Casilino 23 battuta 67-43"
date: "AAAA-MM-GG"
description: "una frase con il risultato"
image: "/images/news/<nome>.jpg"
category: "dr1"
featured: true
showImage: true
hideImageDownload: true
buttons:
  - { label: "Calendario e risultati", link: "/calendario/dr1" }
  - { label: "Galleria della partita", link: "/gallery/2026-27/dr1-vs-casilino" }
---
```

- Struttura del testo: apertura breve, `## La partita` (un paragrafo per quarto, con i protagonisti), `## Il tabellino` (risultato, parziali, giocatori con nome e cognome su una riga, allenatore, vice, dirigenti), prossimo impegno dal calendario, "Forza Virtus!".
- Scrivi in modo scorrevole e specifico, non copiare il recap IA. L'utente ha già bocciato un testo troppo meccanico. Usa solo fatti che hai (parziali, protagonisti, serie).
- Il sito non renderizza le tabelle markdown (niente GFM): usa elenchi o righe.
- Copertina: scegli la foto migliore (nitida, maglia Virtus leggibile, niente teste in primo piano). Ritagliala se serve, larghezza 1080 px, e salvala in `public/images/news/`.
- `hideImageDownload` toglie "Scarica l'immagine". I `buttons` sono pulsanti blu con scritta gialla.

## 4. Galleria foto

Cartella: `content/gallery/<stagione>/<album>/foto-01.jpg …`, per esempio `content/gallery/2026-27/dr1-vs-casilino/`. Lo slug dell'album dà il titolo ("dr1-vs-casilino" → "DR1 vs Casilino").

- La **prima foto in ordine di nome è la copertina** nell'elenco `/gallery/`. Mettici la migliore (di solito la foto di gruppo o la più bella).
- Genera miniature e manifest: `node scripts/make-gallery.mjs`. Il comando `npm run dev` non lo fa da solo, `npm run build` sì.
- La pagina dell'album è `/gallery/<stagione>/<album>/`.

## 5. Controlli prima di dire "fatto"

Il server di sviluppo gira con `npm run dev` su http://localhost:3000. Non lanciare l'intero `prebuild`: `fetch-instagram` modifica file tracciati.

1. `npx tsc --noEmit`
2. Apri via curl o nel browser: `/partite/<slug>/`, `/calendario/<squadra>/`, `/news/<slug>/`, `/gallery/`, `/gallery/<stagione>/<album>/`, la pagina squadra con la classifica.
3. Verifica che i numeri tornino: punteggio, somma punti, parziali, ordine casa/ospite.
4. Dì all'utente cosa hai verificato e cosa no (l'aspetto nel browser non lo vedi da solo).

## Note per il lavoro

- Su questa macchina `/tmp` non esiste e gli heredoc lunghi in bash si rompono: scrivi gli script Python in un file e lancialo.
- I campi del tabellino e delle news si modificano anche dal pannello CMS (`cms/config.yml`). Se aggiungi un campo ai dati, aggiungilo anche lì.
