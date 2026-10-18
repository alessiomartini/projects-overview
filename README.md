# Projects Overview

Panoramica di tutti i miei progetti — idee, in corso, in pausa, finiti — con avanzamento che si aggiorna da solo.

🌐 **https://alessiomartini.github.io/projects-overview/**

- **Avanzamento automatico**: per i progetti collegati a un repo GitHub, il sito legge il suo `ROADMAP.md`
  (checkbox → percentuale, sezione `## Log` → diario) e l'attività dei commit. Claude Code aggiorna quel file a fine sessione.
- **Scrivi dal sito** (anche dal telefono): inbox per le idee al volo, note sui progetti, cambio di stato.
- **Priorità**: ordina i progetti con drag & drop per decidere su cosa lavorare prima.
- **GitHub come database**: ogni modifica fatta dal sito è un commit in questo repo. Niente server, niente costi.

## Primo avvio (una volta sola)

1. **Attiva GitHub Pages**: *Settings → Pages → Source: GitHub Actions*. Il sito si pubblica a ogni push su `main`,
   ogni 3 ore (per raccogliere i progressi dai repo) e su richiesta da *Actions → Deploy sito → Run workflow*.
2. **Token per leggere i repo privati** (facoltativo se sono tutti pubblici):
   crea un [fine-grained token](https://github.com/settings/personal-access-tokens/new) con accesso
   ai repo dei progetti e permesso *Contents: Read-only* (e *Metadata: Read-only*), poi salvalo
   come secret `REPOS_TOKEN` in *Settings → Secrets and variables → Actions*.
3. **Modalità modifica sul sito**: crea un secondo fine-grained token con accesso **solo** a
   `projects-overview` e permesso *Contents: Read and write*. Aprilo nella pagina ⚙︎ *Impostazioni* del sito
   e incollalo. Resta salvato solo su quel dispositivo; ripeti sul telefono.
   Sul telefono usa “Aggiungi a schermata Home”: si apre direttamente sull'Inbox.
4. Sostituisci i progetti d'esempio in `data/projects/` con i tuoi.

## Dove stanno i dati

```
data/
  projects/<slug>.md         un file per progetto
  order.json                 ordine di priorità (scritto dal drag & drop)
  inbox/<data>.md            idee veloci
  notes/<slug>/<data>.md     note sui progetti
```

### Un progetto

```md
---
title: "Nome progetto"
status: in-corso          # idea | in-corso | in-pausa | finito | abbandonato
kind: web                 # web | ricerca | self-study | android | school (colore della card)
section: niente           # facoltativo: forza la sezione della home (attivi | niente | archiviati)
summary: "Una riga di descrizione"
tags: [web, hardware]
repo: alessiomartini/nome-repo   # facoltativo: collega il repo per l'avanzamento automatico
link: https://...                # facoltativo: sito o demo
started: 2026-10-01              # facoltativo
finished: 2026-12-01             # facoltativo
showDetails: false               # repo privato: true per mostrare comunque todo e diario nel sito pubblico
---

Descrizione libera in Markdown.

<!-- Senza `repo`, l'avanzamento si calcola dalle checklist scritte qui: -->
## Fase 1
- [x] fatto
- [ ] da fare
```

Se il frontmatter è sbagliato (es. uno `status` inesistente) la build fallisce indicando file e campo.

Puoi modificare i file direttamente su GitHub (anche dall'app) oppure dal sito: “Modifica file ↗” nella pagina di un progetto
porta all'editor di GitHub; lo stato si cambia anche dal riquadro *Stato*.

## Collegare il repo di un progetto

1. Aggiungi `repo: proprietario/nome` nel file del progetto.
2. Copia [`templates/ROADMAP.md`](templates/ROADMAP.md) nella root di quel repo e compilalo. È l'**unico** file
   per todo, idee, decisioni e diario del progetto (niente `FUTURE-ARCHITECTURE.md` o `IDEE.md` separati):
   - `## <fase>`: le checkbox danno la percentuale;
   - `## Idee`: checkbox mostrate a parte, non contano nella percentuale;
   - `## Decisioni e cose provate`: prosa (scartato/rimandato, provato e annullato, limiti noti), ignorata dal conteggio;
   - `## Log`: il diario (`- AAAA-MM-GG: testo`).
   Le idee per progetti nuovi diventano un file in `data/projects/` con `status: idea`; quelle sciolte vanno nell'Inbox.
3. Perché **Claude Code** lo tenga aggiornato mentre lavori, incolla
   [`templates/CLAUDE.md.snippet`](templates/CLAUDE.md.snippet) nel `CLAUDE.md` del repo.
   Facoltativo: copia anche [`templates/.claude/skills/update-roadmap/`](templates/.claude/skills/update-roadmap/SKILL.md)
   in `.claude/skills/` per avere il comando `/update-roadmap`.
4. Facoltativo, per aggiornamenti immediati invece che ogni 3 ore:
   copia [`templates/notify-tracker.yml`](templates/notify-tracker.yml) in `.github/workflows/` del repo progetto
   e aggiungi lì il secret `TRACKER_TOKEN`.

Per i **repo privati** il sito pubblico mostra solo percentuale, fasi e date (non i testi dei todo, né il diario,
né i messaggi di commit). In modalità modifica li vedi se il tuo token ha accesso in lettura a quel repo.

Badge automatici: **fermo** (progetto in corso senza commit da 30 giorni, configurabile in `src/config.ts`)
e **roadmap completa** (100% ma non ancora segnato come finito).

## Sviluppo in locale

```sh
npm install
npm run dev        # raccoglie i dati dai repo e avvia il sito su http://localhost:4321/projects-overview/
npm test           # test del parser della roadmap e della logica dei progetti
npm run check      # controllo dei tipi
npm run build      # build statica in dist/
```

`npm run fetch` legge i repo con `REPOS_TOKEN` (o `GITHUB_TOKEN`) se presente; con `OFFLINE=1` o se un repo non è
raggiungibile usa i dati di `fixtures/repos.json`.

Stack: [Astro](https://astro.build) (sito statico) + isole [Preact](https://preactjs.com) per le parti interattive.
