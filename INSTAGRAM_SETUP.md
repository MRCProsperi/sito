# Collegare Instagram al sito

Il sito mostra gli ultimi 6 post di `@virtusvelletri_bk` nella home. Funziona così:

1. A ogni `npm run build` lo script `scripts/fetch-instagram.mjs` legge gli ultimi post con l'API ufficiale di Instagram.
2. Scarica le foto dentro `public/instagram/` (le immagini di Instagram scadono dopo pochi giorni, per questo si copiano) e scrive l'elenco in `content/config/instagram.json`.
3. Ogni build rinnova anche il token, che dura 60 giorni: finché si pubblica il sito almeno una volta ogni 2 mesi non scade.
4. Se manca il token o qualcosa va storto, il build non si ferma: restano i post precedenti, oppure solo il pulsante verso il profilo.

I visitatori non contattano mai Instagram dal sito: vedono solo foto già copiate, quindi nessun cookie di terzi.

## Cosa serve (una volta sola)

1. **Account Instagram professionale** (Business o Creator): Instagram → Impostazioni → Tipo di account e strumenti → Passa a un account professionale. È gratuito e non cambia il profilo.
2. **Account sviluppatore Meta**: vai su https://developers.facebook.com, accedi e completa la registrazione.
3. **Crea un'app**: My Apps → Create App → caso d'uso "Altro" → tipo **Business** → nome (ad esempio "Virtus Velletri Sito").
4. **Aggiungi il prodotto Instagram**: nel pannello dell'app scegli "Instagram" → "API setup with Instagram login".
5. **Aggiungi il tuo account**: nella stessa pagina, "Add account" (o "Aggiungi account Instagram") e accedi con il profilo della società. In modalità sviluppo non serve la revisione dell'app.
6. **Genera il token**: accanto all'account premi "Generate token" e copia la stringa lunga.
   Servono i permessi di lettura (`instagram_business_basic`).

I nomi delle voci possono cambiare: Meta rinnova spesso il pannello. Se non trovi una voce, cerca "Instagram API with Instagram Login".

## Dove mettere il token

Nel file `.env.local` nella cartella del progetto (è escluso da git, non va mai incollato in chat o nel codice):

```
INSTAGRAM_ACCESS_TOKEN=il_token_copiato
```

Poi basta pubblicare come al solito (`npm run build`, poi `npm run deploy`).

## Se non si aggiorna

- Il token è scaduto (più di 60 giorni senza build): rigeneralo dal pannello Meta e sostituiscilo in `.env.local`.
- Il profilo non è più professionale o l'account è stato scollegato dall'app.
- Nel log del build compare `[instagram] aggiornamento non riuscito (...)` con il motivo.
