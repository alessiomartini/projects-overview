---
name: update-roadmap
description: Update ROADMAP.md with this session's progress (ticked checkboxes, new todos, a log line). Use at the end of work or when the user asks to update the roadmap or progress.
---

# Update the roadmap

`ROADMAP.md` in the repo root feeds the project tracker
(https://alessiomartini.github.io/projects-overview/): checkboxes give the progress percentage,
`## Ideas` holds ideas (outside the percentage), `## Decisions and things tried` holds prose
(discarded/postponed, tried and reverted, known limits), `## Log` is the diary.
The Italian names `## Idee` and `## Decisioni e cose provate` are also accepted; keep whichever the file already uses.

1. See what was done: the current conversation, `git diff` and `git log` since the last Log entry.
2. Open `ROADMAP.md` (if missing, create it with the `## ...` phases that emerge from the project, plus `## Log`).
3. Tick (`- [x]`) completed items. Add new tasks as `- [ ]` under the right phase,
   undecided ideas under `## Ideas`, discarded or reverted things (with the reason) under `## Decisions and things tried`.
4. At the top of `## Log` add `- YYYY-MM-DD: <one-sentence summary>` with today's date
   (if today's line already exists, extend it).
5. Do not delete or reorder existing items. Show the user the diff and commit it together with the work.
