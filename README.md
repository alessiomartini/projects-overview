# Projects Overview

Overview of all my projects (ideas, in progress, paused, finished) with progress that updates itself. The site UI is in English (route names and frontmatter values such as `in-corso` stay Italian).

🌐 **https://alessiomartini.github.io/projects-overview/**

- **Automatic progress**: for projects linked to a GitHub repo, the site reads its `ROADMAP.md`
  (checkboxes give the percentage, the `## Log` section gives the diary) and the commit activity. Claude Code updates that file at the end of a session.
- **Write from the site** (also from a phone): inbox for quick ideas, project notes, status changes.
- **Priority**: order projects by drag and drop to decide what to work on first.
- **GitHub as database**: every change made from the site is a commit in this repo. No server, no cost.

## First setup (once)

1. **Enable GitHub Pages**: *Settings → Pages → Source: GitHub Actions*. The site is published on every push to `main`,
   every 3 hours (to collect progress from the repos) and on demand from *Actions → Deploy sito → Run workflow*.
2. **Token to read private repos** (optional if all are public):
   create a [fine-grained token](https://github.com/settings/personal-access-tokens/new) with access
   to the project repos and *Contents: Read-only* (and *Metadata: Read-only*) permission, then save it
   as the `REPOS_TOKEN` secret in *Settings → Secrets and variables → Actions*.
3. **Edit mode on the site**: create a second fine-grained token with access **only** to
   `projects-overview` and *Contents: Read and write* permission. Open the site's ⚙︎ *Settings* (`/impostazioni/`) page
   and paste it. It stays stored on that device only; repeat on the phone.
   On the phone use "Add to Home screen": it opens directly on the Inbox.
4. Replace the example projects in `data/projects/` with your own.

## Where the data lives

```
data/
  projects/<slug>.md         one file per project
  order.json                 priority order (written by drag and drop)
  inbox/<date>.md            quick ideas
  notes/<slug>/<date>.md     project notes
```

### A project

```md
---
title: "Project name"
status: in-corso          # idea | in-corso | in-pausa | finito | abbandonato
kind: web                 # web | ricerca | self-study | android | school | automazione | dati | strumento (card colour)
section: niente           # optional: force the home section (attivi | niente | archiviati)
summary: "One-line description"
tags: [web, hardware]
repo: alessiomartini/repo-name   # optional: link the repo for automatic progress
link: https://...                # optional: site or demo
started: 2026-10-01              # optional
finished: 2026-12-01             # optional
showDetails: false               # private repo: true to show todos and log on the public site anyway
---

Free description in Markdown.

<!-- Without `repo`, progress is computed from the checklists written here: -->
## Phase 1
- [x] done
- [ ] to do
```

If the frontmatter is wrong (e.g. an unknown `status`) the build fails and names the file and field.

You can edit the files directly on GitHub (also from the app) or from the site: "Modifica file ↗" on a project page
opens the GitHub editor; the status can also be changed from the *Stato* box.

## Linking a project's repo

1. Add `repo: owner/name` to the project file.
2. Copy [`templates/ROADMAP.md`](templates/ROADMAP.md) to the root of that repo and fill it in. It is the **only** file
   for a project's todos, ideas, decisions and log (no separate `FUTURE-ARCHITECTURE.md` or `IDEAS.md`):
   - `## <phase>`: the checkboxes give the percentage;
   - `## Ideas`: checkboxes shown separately, not counted in the percentage;
   - `## Decisions and things tried`: prose (discarded/postponed, tried and reverted, known limits), ignored by the count;
   - `## Log`: the diary (`- YYYY-MM-DD: text`).

   The parser also accepts the Italian names `## Idee` and `## Decisioni e cose provate`.
   Ideas for new projects become a file in `data/projects/` with `status: idea`; loose ones go to the Inbox.
3. So that **Claude Code** keeps it updated while you work, paste
   [`templates/CLAUDE.md.snippet`](templates/CLAUDE.md.snippet) into the repo's `CLAUDE.md`.
   Optional: also copy [`templates/.claude/skills/update-roadmap/`](templates/.claude/skills/update-roadmap/SKILL.md)
   to `.claude/skills/` to get the `/update-roadmap` command.
4. Optional, for immediate updates instead of every 3 hours:
   copy [`templates/notify-tracker.yml`](templates/notify-tracker.yml) to `.github/workflows/` of the project repo
   and add the `TRACKER_TOKEN` secret there.

For **private repos** the public site shows only percentage, phases and dates (not todo texts, the log,
or commit messages). In edit mode you see them if your token has read access to that repo.

Automatic badges: **fermo** (stalled: in-progress project with no commits for 30 days, configurable in `src/config.ts`)
and **roadmap completa** (100% but not yet marked as finished).

## Local development

```sh
npm install
npm run dev        # fetches data from the repos and starts the site at http://localhost:4321/projects-overview/
npm test           # tests for the roadmap parser and project logic
npm run check      # type check
npm run build      # static build into dist/
```

`npm run fetch` reads the repos with `REPOS_TOKEN` (or `GITHUB_TOKEN`) if set; with `OFFLINE=1` or if a repo is
unreachable it uses the data in `fixtures/repos.json`.

Stack: [Astro](https://astro.build) (static site) + [Preact](https://preactjs.com) islands for the interactive parts.

The `automation/` folder holds the prompts of the scheduled autonomous assistant (see `automation/README.md`).
