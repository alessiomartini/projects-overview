---
title: "Self-Quantification"
status: idea
kind: dati
summary: "Tracking longitudinale n-of-1: capire quali metodi di studio e allenamento funzionano su di me (sonno, caffeina, orario, temperatura, luogo) e costruire un dataset personale a lungo termine."
tags: [dati, n-of-1, studio, allenamento, personale]
---

## Idea

Layer quantitativo (serie temporali) degli snapshot personali qualitativi: stesso progetto,
due layer. Documento di design completo **solo in locale**, non in questo repo pubblico:
`E:\Alessio\Projects_Git\snapshots-psicologia-personale\self-quantification.md` (21 ott 2026).

- **Tratti vs stati**: i tratti (personalità, cognitivo, rischio, cronotipo) si misurano una
  volta sola, in fretta; il valore sta negli stati, su cui si può intervenire.
- **Fase 1, logging stupido** (mesi 1-2): < 2 min/giorno di campi manuali agganciati al
  [Morning Brief](morning-brief.md) + dati automatici (tracker, Anki, Strava). Passa alla fase 2
  solo con >= 80% di giorni compilati per 6 settimane.
- **Fase 2, n-of-1**: condizioni randomizzate, PVT quotidiana, 3-5 ipotesi preregistrate,
  modello misto AR(1) o bayesiano gerarchico. Primo esperimento: temperatura ambientale.
- **Dati**: formato long (`timestamp | variable | value | unit | source | context_json`),
  SQLite/Parquet, UTC. Dati veri mai in git/cloud (vedi archivio dati personali).
- **Rischio principale**: il sistema di misura diventa il progetto; quindi fase 1 minimale.

## Prossimi passi

- [ ] Schema del database + ingest dal Morning Brief
- [ ] 6 settimane di fase 1, nessuna analisi
- [ ] Batteria baseline in una sessione unica
- [ ] Preregistrazione delle ipotesi primarie
