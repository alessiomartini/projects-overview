---
title: "World Economies Map"
status: idea
kind: web
summary: "Mappa del mondo per capire le economie dei paesi: passando il mouse su un paese, composizione del gettito e della spesa pubblica; cliccando, una pagina con più informazioni sulla sua economia. Solo dati ufficiali, con fonti citate."
tags: [web, mappa, economia, dati]
---

Fa parte di [Capire il mondo](capire-il-mondo.md).

## Idea

- **Mappa**: al passaggio del mouse una finestra con la composizione di
  - **gettito** (imposte sul reddito, sui beni e servizi/IVA, contributi sociali, patrimonio,
    commercio estero, entrate non fiscali), in % del totale e del PIL;
  - **spesa pubblica** per funzione (sanità, istruzione, protezione sociale, difesa, interessi
    sul debito...), in % del totale e del PIL.
- **Pagina del paese** al clic: PIL e PIL pro capite, crescita, inflazione, disoccupazione,
  debito e deficit, bilancia commerciale e principali partner/prodotti, serie storiche.
- Su telefono: tocco = finestra, secondo tocco o pulsante = pagina.

## Dati: solo fonti ufficiali, sempre citate

Ogni numero porta fonte, anno e link al dataset; se un dato manca si scrive "non disponibile",
mai stime o riempimenti. Fonti candidate (da verificare per copertura e licenza):

- Gettito: OECD Global Revenue Statistics (classificazione OECD delle imposte);
  IMF Government Finance Statistics (GFS).
- Spesa per funzione: classificazione COFOG, da IMF GFS; Eurostat (`gov_10a_exp`) per l'UE;
  OECD per i paesi membri.
- Macro: IMF World Economic Outlook, World Bank World Development Indicators.
- Commercio: UN Comtrade / WTO.

Limite noto da gestire: la spesa per funzione (COFOG) manca per molti paesi in via di sviluppo,
quindi la mappa deve mostrare chiaramente dove il dato non c'è e di che anno è quello mostrato.

## Collegamenti

- [Markets from First Principles](markets-first-principles.md): spiegazioni dei concetti
  (debito, deficit, IVA...) da linkare dalle pagine dei paesi.
- [Geopolitics Atlas](geopolitics-atlas.md): contesto dei paesi in conflitto.
- Stack di default: sito statico su GitHub Pages, dati scaricati da uno script e salvati in JSON
  con fonte e data di download, pulsante Feedback (`site-notes`).
