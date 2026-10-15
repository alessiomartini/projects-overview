---
title: "The Real-Time Earth"
status: in-pausa
summary: "Catalogo modulare di flussi di dati globali in tempo reale, mostrati senza modifiche."
tags: [web, dati]
repo: alessiomartini/realtime-earth
link: https://realtime-earth.alemarti-2001.workers.dev
started: 2026-08-10
---

## Roadmap
- [x] Scaffold: Vite + TS, Worker, deploy in CI
- [x] Contratto dei moduli, registry, lifecycle manager
- [x] Primi quattro feed live
- [ ] Lane B: proxy nel Worker, handler `scheduled`, KV
- [ ] Lane C: relay AIS con Durable Object e modulo mappa
- [ ] Moduli restanti, sezione per sezione
- [ ] README completo con tabella delle fonti (licenza, latenza)

Bloccati: Stooq (serve API key via email), NASA FIRMS (manca la chiave), Binance (geo-bloccato).
