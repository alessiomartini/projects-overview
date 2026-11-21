# Roadmap

<!-- Single file for todo, ideas, decisions and log, read by Projects Overview (https://alessiomartini.github.io/projects-overview/). Protocol: templates/ROADMAP.md in projects-overview. -->

## Base
- [x] Static site with Astro and GitHub Pages
- [x] Projects as Markdown files in `data/projects/`
- [x] Automatic progress from the `ROADMAP.md` of linked repos
- [x] Inbox for ideas and project notes, saved via the GitHub API
- [x] Priority reordering with drag and drop

## Next steps
- [x] Replace the example projects with the real ones
- [x] Link the project repos and add `ROADMAP.md` + instructions for Claude to each (all repos have `ROADMAP.md`; the protocol is global, the snippet in `CLAUDE.md` is optional)
- [x] Calendar view of activity

- [x] Home redesigned: colours by kind, progress ring, in-progress/to-do lists, 3 sections, light/dark theme
- [ ] Decide by hand which projects are finished
- [x] Calendar: filter by project/kind and count commits too (not only Log entries)
- [x] Translate the site UI (Italian today) to English or bilingual

- [ ] Language rule (2026-11-21): every project in English or bilingual EN/IT. Italian-only today, to fix:
  - [x] projects-overview: README.md, CLAUDE.md, ROADMAP.md, templates and automation prompts (translated 2026-11-21)
  - [x] eating-amsterdam: README.md (says "notes stay in Italian"), ROADMAP.md
  - [ ] job-news: README.md, ROADMAP.md (or close the repo: merged into job-research-website on 2026-10-25; it has no card in `data/projects/`, so nothing to remove here)
    - 🤖 2026-11-21: the repo is archived (read-only), so it can't be translated without unarchiving it; Alessio's choice
  - [ ] Mostly-Italian ROADMAP.md: geopolitics-atlas, mountain-huts-map, realtime-earth, ear-training, markets-first-principles, amsterdam-events, music-library, music-library-offline, alessiomartini.github.io, lecture-notes x3, wikipedia-attention-etf-volatility, notebooks x2, anki-decks, conceptual-map-physics-math (mixed), the 13 archive/bsc/msc repos (boilerplate)
    - 🤖 2026-11-21: translated in all of them except realtime-earth, and geopolitics-atlas and lecture-notes-mit-18642-math-finance (open docs-cleanup PRs #42 and #9)
    - 🤖 2026-11-21 (later): geopolitics-atlas and lecture-notes-mit-18642-math-finance checked, already fully English; realtime-earth still Italian
    - 🤖 2026-11-21 (evening): realtime-earth and job-research-website (not in the list, also Italian) and grocery-list translated
  - [x] Template `templates/ROADMAP.md` (HTML comment and headings) in English; the parser (`src/lib/roadmap.ts`, `scripts/build-home.py`) accepts both the English and Italian `##` names, with unit tests
  - [ ] Historical artifacts (theses, reports, Italian code comments): do not translate, add an Italian summary to the English README instead
  - [ ] Decide whether private personal repos and the Italian card tips in anki-decks are exempt

## Ideas
- [ ] Calendar: year selector / scrolling beyond the last 12 months

## Decisions and things tried
Calendar (`/calendario`): counts only the `## Log` entries of the ROADMAP.md files (the same data already read for progress), not commits. For private repos with hidden details the day is counted but the text shows "(dettagli privati)". The grid is computed at build time, so it updates on every site rebuild.

Calendar with commits (2026-10-19): `scripts/fetch-repos.mjs` collects the commits of the last year on the default branch (up to 1000, paginated) aggregated by UTC day into `commitDays`; if the call fails the repo stays valid without commits. Privacy (the site repo is public): for private repos, with unknown privacy or tagged `personale`, only daily counts are stored and shown, never messages, files or authors (for private repos the messages are not even written to `repos.json`); for public non-`personale` repos the first line of the message is shown. The filters (project, kind) are client-side; days with commits only are tinted green. Commits are counted on the default branch only.

Special section names (2026-11-21): the parser accepts `## Ideas`/`## Idee` and `## Decisions and things tried`/`## Decisions`/`## Decisioni e cose provate` (checkboxes in the decisions section are ignored), plus `## Log`.

## Log
- 2026-11-21: 🤖 Docs cleanup: translated README, CLAUDE.md, ROADMAP, templates and automation prompts to English (improved the prompts: duplicate check, stop rules, clearer lock rule); parser now accepts the English special sections `## Ideas` and `## Decisions and things tried`, with tests. Audit of instructions, README and ROADMAP of all repos; new rule: projects in English or bilingual EN/IT, list of repos to fix. 🤖 Site UI translated to English (routes and data values unchanged). 🤖 Evening sprint: ROADMAPs of 25 repos and the eating-amsterdam README translated to English; site UI in English.
- 2026-11-14: site notes sorted; grocery-list is no longer paused (used often); idea for a sauna map in `data/inbox/`
- 2026-11-07: 🤖 ticked "Replace the example projects": `data/projects/` now holds only real cards, no examples.
- 2026-11-06: added the Feedback button (`public/js/notes-widget.js`, POST to the site-notes Worker with a local queue) to all pages; needs the site-notes deploy. Canonical note widget v2 (site-notes/widget) replaces the old feedback. Note widget aligned to the final version (key#field migration, dedupe), ?v=3.
- 2026-10-19: 🤖 Calendar: commits of all linked repos now counted too (counts only for private/personal repos), with project and kind filters.
- 2026-10-18: single protocol: `## Ideas` outside the percentage and shown separately, template and CLAUDE.md snippet updated; 🤖 `/calendario` calendar view (12-month heatmap from Log entries, per-day detail)
- 2026-10-15: first version of the site; home redesigned (colour-coded kinds, progress ring, per-project lists, 3 sections, theme toggle); to-do lists shown in full
