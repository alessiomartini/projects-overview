# Instructions for Claude

Projects Overview: a public static site (Astro + Preact, GitHub Pages) tracking Alessio's projects. Setup and data formats are in `README.md`; read it first.

## Commands
`npm test`, `npm run check`, `npm run build` (use `OFFLINE=1` without network: repo data then comes from `fixtures/repos.json`), `npm run dev` (serves http://localhost:4321/projects-overview/).
Run test, check and build after changing `src/lib/` or the parser. A wrong frontmatter (e.g. unknown `status`) fails the build and names file and field.

## Data conventions
- A new project is a card in `data/projects/<slug>.md` with `status: idea`.
- `data/inbox/<date>.md` holds loose ideas (frontmatter `date`, one line). `data/order.json` is written by the site's drag and drop; don't hand-edit it.
- `templates/` is copied into project repos. The roadmap parser accepts English and Italian special sections (`## Ideas`/`## Idee`, `## Decisions and things tried`/`## Decisioni e cose provate`, `## Log`); keep `src/lib/roadmap.ts` and `scripts/build-home.py` in sync.
- Language: docs, roadmap and commits in English. The site UI is in English (routes such as `calendario/` and data values such as `in-corso` stay Italian).

## Privacy
The repo and the site are public. Put only ideas in neutral words here: no names of people, feelings, health or personal context. If an idea cannot be separated from the private part, leave it out and tell Alessio.

## Keep in sync
When a project is created, merged or moved, update together the card in `data/projects/`, the local home page `E:\Alessio\Projects_Git\home.html` and the map `~/.claude/rules/alessio-projects-map.md`. These two files exist only on Alessio's machine; in a cloud session skip them and say so.
