# Analisi sito Virtus Velletri e piano di migrazione

Data analisi: 6 ottobre 2026. Progetto: `c:\lavoro\privato\sito` (repo `MRCProsperi/sito`).
Sito attuale: `www.virtusvelletri.it` (WordPress su hosting Aruba).

---

## 1. Riepilogo

Il nuovo sito è un progetto Next.js. Tutti i contenuti (pagine, news, classifiche, partite) sono file Markdown e JSON dentro il repository, quindi **non serve un database**.

Lo stato oggi:

- Il codice compila e genera una versione statica (cartella `out/`, 189 pagine).
- Controlli tecnici (`tsc`, lint) senza errori. Restano 19 avvisi non bloccanti.
- **Niente è stato pubblicato e niente è stato salvato con commit.** Tutte le modifiche sono solo sul computer.
- Il sito vecchio non è stato toccato.

Per pubblicare mancano alcune decisioni e alcuni accessi (sezione 6).

---

## 2. Cosa è stato sistemato

### Sicurezza e affidabilità
| Problema trovato | Cosa è stato fatto |
|---|---|
| Il modulo PDF scriveva file con dati di minori in `public/temp`, cartella raggiungibile dal web | Il PDF ora si compila **nel browser** (`src/lib/fillPdf.ts`): i dati non lasciano il dispositivo |
| Il modulo PDF dipendeva da Python sul server, che su un hosting normale non c'è | Riscritto con `pdf-lib`, nessun Python |
| Nessun controllo sui dati del modulo | Campi ripuliti e limitati a 120 caratteri, caratteri non supportati rimossi |
| Instagram mostrava post finti con immagini inesistenti | Senza token si vede solo il link al profilo, niente dati finti |
| Token Instagram nell'indirizzo della richiesta | Ora è nell'intestazione `Authorization` |
| Slug non controllati nella lettura dei file | Ammessi solo caratteri sicuri (`SAFE_SLUG`), un indirizzo tipo `../..` dà 404 |

### Qualità del codice
- Tipi `any` sostituiti con tipi veri. Errori lint azzerati.
- Parametri delle pagine adeguati a Next.js 16.
- Slug delle partite corretti per le lettere accentate.
- Ordine delle news robusto se manca una data.
- Rimossi file inutilizzati: `homepage1`, `SponsorSlider`, `SocialFeed`, `GalleryGrid`, `coordinates_v2.txt`, `scripts/fill_pdf.py`, e le dipendenze `uuid` e `dotenv`.

### SEO
- Titolo e descrizione per ogni pagina, con modello "Titolo | Virtus Velletri".
- Indirizzo canonico per ogni pagina, anteprime social (Open Graph, Twitter).
- Dati strutturati per Google: `SportsClub` su tutto il sito e `NewsArticle` sulle news.
- `sitemap.xml` e `robots.txt` generati automaticamente.
- Redirect permanenti dai vecchi indirizzi WordPress (file `public/.htaccess`).
- Verificato sull'HTML generato: home, `/dr1` e una news hanno title, canonical e JSON-LD corretti.

### Pubblicazione su Aruba
- Il sito si compila come statico (`next.config.ts`: `output: "export"`).
- Script `npm run deploy` (`scripts/deploy.mjs`) per caricare `out/` via FTP. Legge le credenziali da `.env.local`, mai dal repository. Con `--dry` mostra i file senza caricare nulla.

---

## 3. Problemi ancora aperti

### Risolti il 6 ottobre 2026 (secondo giro)
- **`/giovanili`** era una bozza con testi segnaposto ("Titolo Notizia 1", "Sponsor 1-6", news finte con link rotti): rimossa, ora mostra la pagina vera `content/pages/giovanili.md`. L'animazione dei partner ora vive in `globals.css`.
- **Titoli doppi** ("... | Virtus Velletri | Virtus Velletri"): corretti.
- **Pagina Privacy** creata (`content/pages/privacy.md`) e linkata nel footer. **Va fatta rileggere al titolare/consulente**: l'ho scritta io da modello standard. Mancano indirizzo della sede legale e dati del titolare.
- **Galleria**: senza foto era una pagina di link morti. Tolta da menu, footer e sitemap (pagina `noindex`); il riquadro in home porta a Instagram.
- **Sponsor**: se la lista è vuota non compaiono più riquadri "Sponsor 1..6".
- **`/admin`** (CMS non funzionante) rimosso dal sito.
- Controllo automatico di tutti i link e le immagini interne del sito compilato: nessun link rotto.

### Da correggere
1. **Test mancanti**: non ho provato nel browser il modulo PDF né l'aspetto delle pagine (non ho un browser). Va guardato a occhio sul sito di prova.
2. **Testi da verificare**: il footer indica solo "Palestra Polivalente" come sede; l'avviso "stagione 2025/2026" nei moduli va aggiornato a ogni stagione.

### Stagione 2026/27: stato dei dati (aggiornato)
- **Fatto**: roster 2026/27 di Pulcini, Scoiattoli (Small e Big), Aquilotti (Small e Big), Esordienti, Under 13/14/15/17 e Progetto Basket ("Scuola BK"), con numeri di maglia dove l'abbinamento era certo. Minibasket: solo nome di battesimo e anno; giovanili: nome e cognome (come prima). Titoli, moduli e pagina iscrizioni portati a 2026/27 (costante `SEASON` in `src/lib/site.ts`).
- **Ancora da aggiornare (servono i dati 2026/27)**: roster di DR1, DR3 e Amatori; **calendari e classifiche** (sono ancora quelli 2025/26: la pagina Calendario porta ancora la dicitura 2025/2026); staff tecnico dei gruppi; **PDF dei moduli** (`public/pdf/modulo-iscrizione-*-25-26.pdf` sono i moduli della stagione scorsa); quote e scadenze 2026/27 sulla pagina iscrizioni.
- I numeri di maglia mancanti sono dovuti a fratelli con lo stesso cognome o a righe poco leggibili nella tabella: vanno controllati a mano.

### Da decidere
6. **CMS online**: rimosso. Le modifiche ai contenuti le faccio io da qui.
7. **Vecchie news WordPress**: i 5 articoli vecchi non esistono nel nuovo sito, i loro indirizzi puntano tutti a `/news`.

### Rischi
8. **Il deploy non cancella**: aggiunge e sovrascrive file ma non rimuove quelli vecchi. Se carichi nella stessa cartella di WordPress, i file si mischiano (per esempio `index.php` e `index.html`) e il sito può rompersi. Prima del caricamento va deciso **dove**.
9. **Sovrascrittura di `.htaccess`**: WordPress ne ha uno suo. Il nuovo lo sostituirebbe: va bene solo quando WordPress viene spento.
10. **Instagram su sito statico**: i post si aggiornano solo a ogni nuova compilazione. Il token scade ogni 60 giorni.

---

## 4. Situazione Aruba (dai DNS pubblici)

| Elemento | Valore | Cosa significa |
|---|---|---|
| Dominio | `virtusvelletri.it` | Gestito con i nameserver Aruba (`dns3.arubadns.net`, `dns4.arubadns.cz`) |
| Indirizzo sito | `89.46.109.16` (sia `@` che `www`) | È un server di hosting Aruba: qui gira WordPress |
| Posta | MX `mx.virtusvelletri.it`, SPF `include:_spf.aruba.it` | **Le email del dominio esistono e sono su Aruba** |
| Database | non verificabile da qui | Probabilmente MySQL di WordPress. **Non serve al nuovo sito** |

### Dati letti dal pannello Aruba (6 ottobre 2026)

| Elemento | Valore | Note |
|---|---|---|
| Piano | **Hosting Linux Basic** | Apache: il sito statico è compatibile |
| Spazio usato | 2,13 GB (spazio illimitato) | Fa parte di WordPress e delle sue foto |
| FTP | `ftp.virtusvelletri.it`, porta 21 | Porta 21 = FTP (se supportato, preferire FTPS) |
| Utente FTP | quello dell'account Aruba | **La password FTP è la stessa dell'account Aruba** |
| PHP | 5.3.29 | Versione molto vecchia (2014): WordPress su PHP così vecchio è un rischio. Per il nuovo sito statico è ininfluente |
| Dominio | attivo, **scade il 01/07/2027** | Mettere un promemoria di rinnovo |
| Verifica in 2 passaggi | **non attiva** | Da attivare |
| Ultimo accesso al pannello | 23/03/2023 | Le credenziali vanno verificate e conservate |
| Posta | Servizio "Caselle di posta" dello stesso account, gestito dalla casella `postmaster@virtusvelletri.it` | La password di default di postmaster è la stessa dell'account Aruba. Il titolare dice di non usare la posta del dominio (il sito usa indirizzi Gmail) |

Conseguenze:
- La password FTP coincide con quella dell'account: se non è possibile creare un utente FTP separato nel pannello, la password va tenuta **solo** in `.env.local` e cambiata a migrazione finita.
- La posta del dominio non è usata, ma il servizio fa parte dello stesso account: non va disdetto né toccato (record MX/SPF) finché non è deciso. Prima di eventuali rinunce, accedere alla webmail con `postmaster` per vedere quali caselle esistono: il pannello non le elenca.
- La sezione "Database" va guardata solo per fare un backup di WordPress prima di spegnerlo.

### DNS (pannello Aruba, 6 ottobre 2026)

- 49 record in tutto; il record `A` di `@` punta a `89.46.109.16` (l'hosting). Name server di Aruba, DNSSEC disattivo.
- **Restando su Aruba non serve cambiare nessun record DNS**: il dominio punta già all'hosting, basta sostituire i file nella cartella principale. Attenzione: la voce "Redirect e sottodomini" del pannello serve solo a inoltrare verso un altro indirizzo, **non** a creare un sottodominio con una cartella propria: un sottodominio di prova non si può fare da lì.
- Prima di qualsiasi modifica, usare **Esporta** (formato BIND o TXT) per avere una copia dei record. **Non usare "Importa"** (sostituisce tutti i record) né "Ripristina" senza motivo.

**Regola di sicurezza**: nel pannello DNS si cambiano solo i record del sito. **Non toccare MX, SPF e il record `mx`**, altrimenti la posta smette di funzionare. E non disdire l'hosting se contiene le caselle email.

---

## 5. Come si pubblica

### Opzione scelta: restare su Aruba, sito statico
Funziona solo con **Hosting Linux** (Apache). Da verificare nel pannello Aruba.

Flusso di lavoro:
1. Io modifico i contenuti qui e faccio commit.
2. `npm run build` crea la cartella `out/`.
3. `npm run deploy` la carica via FTP su Aruba.

Limiti: niente CMS online, le foto vanno ridimensionate prima del caricamento, Instagram si aggiorna solo con una nuova compilazione.

### Alternativa: Vercel (gratis)
Pubblicazione automatica a ogni push, anteprime prima di andare online, CMS possibile. Il dominio resta su Aruba e cambiano solo due record DNS. Per tornare a questa opzione basta ripristinare `next.config.ts` e le route `/api`: è reversibile.

---

## 6. Cosa serve da te

### Accessi (non incollarli in chat)
- **Account Aruba**: `admin.aruba.it`. Lo apri tu. Io non posso accedere a pannelli web e ti sconsiglio di darmi la password.
- **Utente FTP dedicato**: crealo nel pannello (Hosting → FTP), limitato a una cartella. Poi scrivi i dati in `.env.local`:
  ```
  FTP_HOST=...
  FTP_USER=...
  FTP_PASSWORD=...
  FTP_REMOTE_DIR=/nuovo
  ```
- **WordPress**: `www.virtusvelletri.it/wp-admin` per esportare articoli e foto.

### Informazioni
1. Il nome del **piano hosting** (Linux o Windows) e se compare un database MySQL.
2. Dove sono ospitate le **caselle email**.
3. Un elenco o uno screenshot dei **record DNS** (con i valori nascosti se vuoi).
4. Quali **contenuti WordPress** portare nel nuovo sito (articoli, foto, pagine).
5. Il **token Instagram**, se vuoi i post nel sito.
6. I **testi della privacy** o i dati del titolare per scriverli.

---

## 7. Piano in ordine

| Fase | Cosa | Chi |
|---|---|---|
| 1 | Backup di WordPress: esporta contenuti (Strumenti → Esporta) e scarica `wp-content/uploads` | Tu |
| 2 | Correggere animazione `/giovanili`, titoli doppi, aggiungere privacy | Io |
| 3 | Importare news e foto scelte dal vecchio sito | Io, con i tuoi file |
| 4 | Test in locale del sito compilato e del modulo PDF | Io |
| 5 | Commit e push su GitHub | Io, dopo il tuo ok |
| 6 | Creare utente FTP e compilare `.env.local` | Tu |
| 7 | Caricare in una **sottocartella di prova** (`/nuovo`) e controllare insieme | Io + tu |
| 8 | Spostare il sito nella radice, spegnere WordPress, tenere un backup | Io + tu |
| 9 | Inviare la nuova `sitemap.xml` a Google Search Console | Tu |

Il sito vecchio resta online finché non arriva la fase 8.

---

## 8. Checklist prima del passaggio

- [ ] Backup WordPress scaricato
- [ ] Pagina privacy online
- [ ] Animazione `/giovanili` corretta
- [ ] Modulo PDF provato da browser reale (basket e minibasket)
- [ ] Redirect vecchi indirizzi provati
- [ ] Posta funzionante dopo il passaggio (invio e ricezione di prova)
- [ ] Foto ridimensionate (le immagini non vengono ottimizzate in automatico)
- [ ] Sitemap inviata a Google Search Console
- [ ] Token Instagram configurato, oppure link al profilo come alternativa

---

## 9. File principali

| File | Scopo |
|---|---|
| `content/` | Tutti i contenuti: pagine, news, classifiche, partite, menu, sponsor |
| `src/lib/content.ts` | Lettura dei contenuti |
| `src/lib/fillPdf.ts` | Compilazione del PDF nel browser |
| `src/lib/instagram.ts` | Post Instagram (letti alla compilazione) |
| `public/.htaccess` | HTTPS, www, redirect dei vecchi indirizzi |
| `scripts/deploy.mjs` | Caricamento FTP |
| `next.config.ts` | Esportazione statica |
