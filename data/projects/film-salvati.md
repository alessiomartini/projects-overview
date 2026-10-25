---
title: "Film salvati"
status: idea
kind: web
summary: "Sito su misura con i film dei post salvati su Instagram: rating, premi, attori, trailer e dove vederli (Netflix, Prime Video, RaiPlay...)."
tags: [sito, film, instagram, dati-personali]
---

## Idea

Partire dalla cartella dei **post salvati su Instagram** (export dei dati) e costruire un sito
personale con un catalogo dei film che ho salvato:

- **Rating** (IMDb, Rotten Tomatoes, Metacritic, Letterboxd).
- **Premi vinti** (Oscar, Cannes, Venezia, ...).
- **Attori** e regista.
- **Link al trailer**.
- **Dove vederlo** in Italia/Olanda: Netflix, Prime Video, RaiPlay, Disney+, ...
- Su misura per me: filtri per piattaforma che ho, genere, durata, "visto / da vedere".

## Note iniziali

- Fonte: export Instagram (`saved_posts.json`), in `E:\Alessio\Dati-personali` (mai in git).
  Dai post (caption, account) estrarre il titolo del film, anche con Claude per i casi ambigui.
- Dati: TMDB API (gratuita: cast, trailer YouTube, e disponibilità streaming per paese via
  JustWatch), OMDb per i rating IMDb/RT/Metacritic; premi da Wikidata.
- Stack di default: sito statico su GitHub Pages con un JSON generato da uno script, + Feedback
  (`site-notes`).
