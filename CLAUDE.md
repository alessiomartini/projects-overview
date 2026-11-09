# Istruzioni per Claude

Projects Overview: sito **pubblico** (Astro + Preact, statico, GitHub Pages) che traccia tutti i progetti di Alessio:
avanzamento letto dal `ROADMAP.md` di ogni repo, inbox di idee, note, priorità, calendario. Setup e formato in `README.md`.

## Dati
- `data/projects/<slug>.md`: una scheda per progetto (frontmatter: title, status, kind, summary, tags, repo...). Progetto nuovo = `status: idea`.
- `data/inbox/<data>.md`: idee sciolte (frontmatter `date`, una riga). `data/notes/<slug>/`: note sui progetti. `data/order.json`: priorità (scritto dal drag & drop).
- `templates/`: `ROADMAP.md`, `CLAUDE.md.snippet` e `notify-tracker.yml` da copiare nei repo dei progetti.
- Un frontmatter sbagliato (es. `status` inesistente) fa fallire la build indicando file e campo.

## Comandi
`npm run dev` (fetch dei repo + sito su http://localhost:4321/projects-overview/), `npm test`, `npm run check`, `npm run build`.
Con `OFFLINE=1` o repo non raggiungibile si usano i dati di `fixtures/repos.json`.

## Privacy
Il repo e il sito sono pubblici: qui vanno solo idee in parole neutre, niente nomi di persone, sentimenti, salute o contesto personale.
Se un'idea non si separa dal privato, non inserirla e segnalala ad Alessio.

## Da tenere allineato
Quando un progetto nasce, si unisce o si sposta, aggiorna insieme: la scheda in `data/projects/`, `E:\Alessio\Projects_Git\home.html`
e la mappa `~/.claude/rules/alessio-projects-map.md`.
