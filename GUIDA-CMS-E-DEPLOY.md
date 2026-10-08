# Guida: aggiornamento automatico, pannello di amministrazione e galleria

Tre cose sono pronte nel progetto ma si attivano con qualche passaggio tuo, perché servono i tuoi account.
Le password e i token vanno scritti **solo** nelle pagine indicate (impostazioni di GitHub, `.env.local`), mai in chat o nei file del progetto.

## 1. Deploy automatico (GitHub → Aruba)

Ogni volta che una modifica arriva su `main`, GitHub costruisce il sito e lo carica su Aruba. File: `.github/workflows/deploy.yml`.

1. Su GitHub apri il repository → **Settings → Secrets and variables → Actions → New repository secret** e crea:
   - `FTP_HOST` = `ftp.virtusvelletri.it`
   - `FTP_USER` = l'utente FTP di Aruba (lo stesso di `.env.local`)
   - `FTP_PASSWORD` = la password (la stessa di `.env.local`)
   - `FTP_REMOTE_DIR` = `/www.virtusvelletri.it`
   - `INSTAGRAM_ACCESS_TOKEN` e `INSTAGRAM_USER_ID` = come in `.env.local` (servono per i post Instagram in home)
2. **Aruba e l'IP:** nel pannello c'è "Limita accesso FTP". GitHub usa indirizzi che cambiano, quindi con la limitazione attiva il deploy viene rifiutato. Per farlo funzionare la limitazione va tolta. In cambio: usa una password lunga e attiva la **verifica in 2 passaggi** di Aruba.
3. Prova: su GitHub → **Actions → Deploy su Aruba → Run workflow**. Se va a buon fine, da ora ogni push pubblica il sito.

Il deploy manuale `npm run build` + `npm run deploy` resta disponibile.

## 2. Pannello di amministrazione (`/admin`)

Un pannello con login per aggiornare **news, partite e risultati, classifiche, pagine delle squadre e album fotografici** senza toccare i file. Ogni salvataggio crea una modifica su GitHub e, con il punto 1, il sito si aggiorna da solo in un paio di minuti.

File: `cms/config.yml` (cosa si può modificare) e `cms/index.html`. Non è pubblicato finché non lo attivi.

Per attivarlo serve un piccolo servizio di login (si chiama "OAuth proxy"): GitHub non permette di farlo da un sito statico.

1. Crea una **OAuth App** su GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**. Homepage: `https://www.virtusvelletri.it`. L'indirizzo di callback te lo dà il servizio del punto 2.
2. Pubblica un OAuth proxy gratuito, per esempio su Cloudflare Workers (cerca "decap-proxy" o "Decap CMS OAuth Cloudflare Worker": è un progetto pensato apposta). Inserisci Client ID e Client Secret della OAuth App nelle impostazioni del servizio.
3. In `cms/config.yml` sostituisci `base_url` con l'indirizzo del tuo servizio.
4. Crea il file vuoto `cms/ENABLED` e pubblica. Il pannello compare su `https://www.virtusvelletri.it/admin/`.
5. Accedono solo gli account GitHub con **permesso di scrittura** sul repository: aggiungi chi deve aggiornare il sito da **Settings → Collaborators**.

Nota: il pannello è stato scritto e controllato nella sintassi, ma non ho potuto provare il login (richiede i tuoi account). Il primo accesso va verificato.

### Date e orari delle partite
- Data: `AAAA-MM-GG` (es. `2026-10-11`). Ora: `HH:MM` (es. `19:00`).
- Dopo la partita compila **Risultato** (es. `78-65`): compare nel calendario e nella pagina della partita.
- Il file `.ics` per il calendario del telefono e il PDF del calendario si rigenerano da soli a ogni pubblicazione.

## 3. Galleria foto

Le foto originali **non vengono pubblicate**: a ogni build il sito crea da solo una miniatura e una versione grande, quindi non serve ridimensionarle.

**Dal pannello:** voce **Foto - album** → nuovo album → titolo, stagione, scegli le foto (anche più insieme).

**A mano (senza pannello):** metti le foto in una cartella così: `content/gallery/2026-27/nome-album/foto-01.jpg`. Il nome della cartella diventa il titolo dell'album ("dr1-vs-casilino" → "Dr1 vs casilino").

La pagina `/gallery` resta fuori da Google finché non c'è almeno un album. Per mostrarla nel menu aggiungi una voce `Galleria` → `/gallery` in `content/config/menu.json`.

## 4. Calendari per il telefono e prossima partita

- `/calendario` e le pagine di calendario di ogni squadra hanno i pulsanti **Iscriviti** (si aggiorna da solo) e **Scarica .ics**. I file sono in `/calendari/`.
- In home c'è il riquadro **Prossima partita** con conto alla rovescia e pulsante per le indicazioni stradali (Google Maps).
- Se cambi una partita, aggiorna i dati e ripubblica: PDF, `.ics` e riquadro si aggiornano insieme.

## 5. File di WordPress

`public/.htaccess` ora risponde 404 a `wp-admin`, `wp-login.php`, `xmlrpc.php` e simili. I file vecchi sono ancora sul server (copia completa in `vecchio/`): cancellali dal File Manager di Aruba quando vuoi.
