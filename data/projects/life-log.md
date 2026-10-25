---
title: "Life Log"
status: in-corso
kind: dati
summary: "Unificare i log personali locali (diario, salute, snapshot, self-quantification, finanze, export Google/Meta/...) in un'unica pagina privata a schede, collegati per data così che ognuno possa usare i dati degli altri."
tags: [dati, personale, locale]
repo: alessiomartini/life-log
started: 2026-10-21
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
- Finanze personali (unito qui il 2026-10-25: è la fase "Finanze" della roadmap, un servizio su `life.db`)
- Il [Morning Brief](morning-brief.md) come punto di inserimento quotidiano.

## Architettura (decisa il 2026-10-23)

- **Log unico**: `life.db` (SQLite), una riga per osservazione (data, fonte, tipo, valore, testo...),
  ricreato da zero da `ingest.py` a partire da tutte le fonti.
- **Le fonti restano la verità**: export originali intoccati in `Dati-personali` (fuori da git),
  file scritti a mano (diario, salute) nei loro repo privati, con storico e backup.
- **Servizi che leggono solo dal log**: per ora la timeline per giorno; poi pagina della salute,
  diario, analisi della Self-Quantification, finanze.
- Tutto resta locale e privato: niente Pages, niente API esterne per i testi intimi.
