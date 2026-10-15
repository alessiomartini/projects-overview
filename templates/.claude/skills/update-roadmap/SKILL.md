---
name: update-roadmap
description: Aggiorna ROADMAP.md con i progressi della sessione (checkbox completate, nuovi todo, voce di diario). Usala a fine lavoro o quando l'utente chiede di aggiornare roadmap/progressi.
---

# Aggiorna la roadmap

`ROADMAP.md` nella root del repo alimenta il tracker dei progetti
(https://alessiomartini.github.io/projects-overview/): le checkbox danno la percentuale di avanzamento,
la sezione `## Log` il diario.

1. Guarda cosa è stato fatto: la conversazione corrente, `git diff` e `git log` dall'ultima voce del Log.
2. Apri `ROADMAP.md` (se non c'è, crealo partendo dalle fasi `## ...` emerse dal progetto, più `## Log`).
3. Spunta (`- [x]`) i punti completati. Aggiungi i nuovi compiti come `- [ ]` sotto la fase giusta.
4. In cima a `## Log` aggiungi `- AAAA-MM-GG: <riassunto in una frase>` con la data di oggi
   (se la riga di oggi esiste già, estendila).
5. Non cancellare o riordinare voci esistenti. Mostra all'utente il diff e committalo insieme al lavoro.
