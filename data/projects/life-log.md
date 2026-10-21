---
title: "Life Log"
status: idea
kind: data
summary: "Unificare i log personali locali (diario, salute, snapshot, self-quantification, finanze, export Google/Meta/...) in un'unica pagina privata a schede, collegati per data così che ognuno possa usare i dati degli altri."
tags: [dati, personale, locale]
---

## Idea

I progetti personali locali sono tutti log della stessa vita: unirli in una sola pagina HTML
locale con una scheda per progetto, dove le schede si leggono a vicenda (escluse le storie
raccontate dalle altre persone, che restano a parte).

Progetti coinvolti:

- Diario (`PENSIERI`, repo privato `diario-pensieri`)
- [Health Log](personal-healthcare.md) (`personal-healthcare`, repo privato)
- Snapshot psicologici (`snapshots-psicologia-personale`, solo locale)
- [Self-Quantification](self-quantification.md) (layer quantitativo degli snapshot)
- **Log generale** = gli export dei miei dati in `E:\Alessio\Dati-personali` (Google Takeout:
  Gmail, Keep, Drive, YouTube, Nest...; Meta: Facebook, Messenger, Instagram; Spotify; banche;
  LinkedIn). Diventa la scheda/timeline "tutto", da cui pescano anche le altre schede.
- [Finanze personali](finanze-personali.md) (idea)
- Il [Morning Brief](morning-brief.md) come punto di inserimento quotidiano.

## Proposta (da decidere)

- **Chiave comune = la data.** Ogni progetto tiene il suo formato; il collegamento è
  `data -> eventi di quel giorno da tutte le fonti`. Esempio: il giorno del mal di gola, la scheda
  Salute mostra la voce del diario e il sonno di quella notte.
- **Primo passo pigro: un "hub", non una fusione.** Una pagina/`build.py` che legge le cartelle
  dei progetti esistenti (tutti hanno già `build.py` + dati locali) e genera schede + una vista
  "Giorno"/timeline. Nessuna migrazione, reversibile. Fondere i repo solo se l'hub non basta.
- Gli export restano intoccati in `Dati-personali` (fuori da git): l'hub li legge estraendoli in
  una cartella temporanea e salva solo indici filtrati (senza credenziali), mai i file originali.
- Tutto resta locale e privato: niente Pages, niente API esterne per i testi intimi.
