# Roadmap

## Base
- [x] Sito statico con Astro e GitHub Pages
- [x] Progetti come file Markdown in `data/projects/`
- [x] Avanzamento automatico dal `ROADMAP.md` dei repo collegati
- [x] Inbox per le idee e note sui progetti, salvate via API GitHub
- [x] Riordino delle priorità con drag & drop

## Prossimi passi
- [x] Sostituire i progetti d'esempio con quelli veri
- [x] Collegare i repo dei progetti e aggiungere a ognuno `ROADMAP.md` + istruzioni per Claude (tutti i repo hanno `ROADMAP.md`; il protocollo è globale, lo snippet in `CLAUDE.md` è facoltativo)
- [x] Vista calendario dell'attività

- [x] Home rifatta: colori per tipo, anello di avanzamento, liste in corso/da fare, 3 sezioni, tema chiaro/scuro
- [ ] Decidere a mano quali progetti sono finiti
- [x] Calendario: filtro per progetto/tipo e contare anche i commit (non solo le voci di Log)

- [ ] Language rule (2026-11-21): every project in English or bilingual EN/IT. Italian-only today, to fix:
  - [ ] projects-overview: README.md, CLAUDE.md, ROADMAP.md
  - [ ] eating-amsterdam: README.md (says "notes stay in Italian"), ROADMAP.md
  - [ ] job-news: README.md, ROADMAP.md (or close the repo: merged into job-research-website on 2026-10-25)
  - [ ] Mostly-Italian ROADMAP.md: geopolitics-atlas, mountain-huts-map, realtime-earth, ear-training, markets-first-principles, amsterdam-events, music-library, music-library-offline, alessiomartini.github.io, lecture-notes x3, wikipedia-attention-etf-volatility, notebooks x2, anki-decks, conceptual-map-physics-math (mixed), the 13 archive/bsc/msc repos (boilerplate)
  - [ ] Template `templates/ROADMAP.md` (HTML comment and headings) in English/bilingual; check that the parser of the `##` headings accepts the English names before renaming
  - [ ] Historical artifacts (theses, reports, Italian code comments): do not translate, add an Italian summary to the English README instead
  - [ ] Decide whether private personal repos and the Italian card tips in anki-decks are exempt

## Idee
- [ ] Calendario: selettore dell'anno / scorrimento oltre gli ultimi 12 mesi

## Decisioni e cose provate
Calendario (`/calendario`): conta solo le voci `## Log`- 2026-11-21: 🤖 Audit di istruzioni, README e ROADMAP di tutti i repo; nuova regola: progetti in inglese o bilingui EN/IT, elenco dei repo da correggere.
 dei ROADMAP.md (stessi dati già letti per il progresso), non i commit. Per i repo privati con dettagli nascosti il giorno è contato ma il testo mostra "(dettagli privati)". La griglia è calcolata alla build, quindi si aggiorna a ogni rebuild del sito.

Calendario con commit (2026-10-19): `scripts/fetch-repos.mjs` raccoglie i commit dell'ultimo anno del branch di default (fino a 1000, paginati) aggregati per giorno UTC in `commitDays`; se la chiamata fallisce il repo resta valido senza commit. Privacy (il repo del sito è pubblico): per i repo privati, con privacy sconosciuta o taggati `personale` si salvano e mostrano solo i conteggi giornalieri, mai messaggi, file o autori (per i privati i messaggi non vengono nemmeno scritti in `repos.json`); per i repo pubblici non `personale` si mostra la prima riga del messaggio. I filtri (progetto, tipo) sono lato client; i giorni con soli commit hanno tinta verde. I commit si contano sul solo branch di default.

## Log
- 2026-11-14: note del sito smistate; grocery-list non è più in pausa (usata spesso); idea di una mappa delle saune in `data/inbox/`
- 2026-11-07: 🤖 spuntata «Sostituire i progetti d'esempio»: in `data/projects/` restano solo schede vere, nessuna d'esempio.
- 2026-11-06: aggiunto il pulsante Feedback (`public/js/notes-widget.js`, POST al Worker site-notes con coda locale) a tutte le pagine; serve il deploy di site-notes. widget note v2 canonico (site-notes/widget) al posto del vecchio feedback. widget note allineato alla versione finale (migrazione key#field, dedupe), ?v=3.
- 2026-10-19: 🤖 Calendario: contati anche i commit di tutti i repo collegati (solo conteggi per privati/personali), con filtri per progetto e tipo.- 2026-10-18: protocollo unico: `## Idee` fuori dalla percentuale e mostrate a parte, template e snippet CLAUDE.md aggiornati; 🤖 vista calendario `/calendario` (heatmap 12 mesi dalle voci di Log, dettaglio per giorno)
- 2026-10-15: prima versione del sito; home rifatta (tipi a colori, anello di progresso, liste per progetto, 3 sezioni, toggle tema); liste da fare mostrate per intero
