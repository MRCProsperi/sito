# Note di lavoro – sito Virtus Velletri (aggiornate al 07/10/2026)

## Pubblicazione
- `npm run build` poi `npm run deploy` (il prebuild lancia `scripts/fetch-instagram.mjs`).

## Instagram (feed in home)
- `.env.local` (non versionato): `INSTAGRAM_USER_ID=17841403755055635`, `INSTAGRAM_ACCESS_TOKEN=` **ancora da incollare** (token della Pagina Facebook).
- Alternativa: `node scripts/instagram-long-token.mjs` con INSTAGRAM_SHORT_TOKEN e INSTAGRAM_APP_SECRET in .env.local.
- Dopo il build deve comparire `[instagram] N post aggiornati`.

## Iscrizioni 2026-27
- Form online tolto: le pagine `/iscrizioni/modulo-basket` e `/iscrizioni/modulo-minibasket` mostrano info + pulsante PDF (`src/components/RegistrationInfo.tsx`).
- PDF in `public/pdf/`: `modulo-iscrizione-{basket,minibasket,amatori}-26-27.pdf`. Link anche in `/iscrizioni` e nella pagina Amatori.
- Voucher: riquadro "Voucher Sport Regione Lazio in attesa di rifinanziamento."
- Da riguardare: `src/components/RegistrationForm.tsx` e `src/lib/fillPdf.ts` (non usati; fillPdf punta ancora ai PDF 25-26 cancellati).

## Pagine
- Nascoste (spostate in `content/_nascoste/`): contributi.md, centro-estivo.md. Per riattivarle rimetterle in `content/pages/`.
- Staff, Collaborazioni: lasciate come sono. Organigramma: ok. Da verificare: età in Settore giovanile ("da 12 anni"), `/staff` (Podeschi è giocatore DR1).
- Scoiattoli: `scoiattoli-big-blu`, `scoiattoli-big-giallo` (Taglioni + Chiominto), `scoiattoli-small` (Pesoli + Remiddi). Vecchi indirizzi senza redirect.

## Staff per gruppo
Pulcini Cerini+Remiddi · Aquilotti Small Taglioni+F. Locati · Aquilotti Big Pesoli+Chiominto · Esordienti Pesoli+F. Locati · U13 Pesoli (Coach)+Mancini · U14 Ricca+Cerini · U15/16 Mancini+Pesoli · U17 Ricca · DR1 (10 giocatori, ultimo: #20 Nardi) Mei, Pesoli, S. Cerini, T. Di Clemente · Amatori Pesoli · Progetto Basket F. Locati.
Senza foto: Chiominto, F. Locati (coach), Remiddi, S. Cerini, Di Clemente.

## Contenuti
- News: 4 articoli (calendario DR1, girone U17, ritorno Mancini, nuova veste grafica).
- Calendari DR1 e U17 verificati sui PDF FIGC; classifica U17 vuota.
- SEO: fatti CODE-1, 2, 4, 5; CODE-3 lasciato volutamente.
