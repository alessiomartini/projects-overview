---
title: "Morning Brief"
status: idea
kind: automation
summary: "Ogni mattina un breve riassunto della giornata: cose da fare, email ricevute, eventi in calendario, meteo con consigli su cosa indossare, piante da innaffiare, quando fare la spesa."
tags: [claude-skill, automazione, calendario, email, meteo]
---

## Idea

Un brief mattutino (notifica sul telefono o pagina) con:

- **Cose da fare** nella giornata.
- **Email ricevute**: riassunto di quelle importanti.
- **Eventi nel calendario** di oggi.
- **Meteo** della giornata tradotto in cosa mettersi: giacca, pantaloni lunghi, guanti,
  cappello, tuta antipioggia, felpa.
- **Promemoria di casa**: innaffiare le piante.
- **Spesa**: se serve e *quando* farla (es. tornando dall'allenamento), incrociando calendario
  e lista della spesa ([Pantry](grocery-list.md)).
- Altro da aggiungere col tempo.

## Decisione

- **Da implementare con la skill `morning` di Claude** (brief come artifact, ricorrente nei
  giorni feriali), non con un'app/sito da zero. Lavoro: configurare la skill con le fonti
  (email, calendario, meteo con consigli su cosa indossare, piante, spesa) e attivarla come
  task ricorrente.
