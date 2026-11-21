# Autonomous assistant

Cloud Claude Code sessions that move Alessio's projects forward on their own, reading priorities and each repo's `ROADMAP.md` from this repo. The prompts below are the stored text of the scheduled tasks; edit them here and paste the new text into the task on claude.ai/code.

| Scheduled task | Cron (Europe/Rome) | Prompt |
|---|---|---|
| Night worker | `50 0,5 * * *` (00:50 and 05:50, two separate 5-hour windows) | [`worker-prompt.md`](worker-prompt.md) |
| Pre-reset sprint | `50 12-23 * * 6` (Saturday, hourly; weekly reset is Sunday 00:00) | [`sprint-prompt.md`](sprint-prompt.md) (like the worker but with no task limit: it keeps going until the weekly usage runs out) |
| Weekly report | `40 23 * * 6` (Gmail connector) | [`report-prompt.md`](report-prompt.md) |

Each run starts a new session. The session (Opus) plans the tasks and has Sonnet subagents carry them out, which uses much less.

Run log: `data/automation/log.md`. Questions from the assistant: `data/inbox/` (they start with 🤖).
To stop everything, disable the scheduled tasks on claude.ai/code.

## Cloud environment setting

In the cloud environment used by these tasks, list only `projects-overview` as a source repo. If all projects are listed, the session loads about 40 `CLAUDE.md` files into every turn, which wastes usage. The assistant adds the repo it needs with `add_repo` at run time. This is a setting on claude.ai (Alessio changes it there), not a file in this repo.
