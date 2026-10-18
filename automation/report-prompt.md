Weekly report for Alessio Martini's autonomous project assistant. Write in Italian.

1. add_repo alessiomartini/projects-overview (read), clone it. Read data/automation/log.md: keep entries from the last 7 days.
2. For each merged/draft PR listed, get title and state with `gh pr view <url> --json title,state,isDraft` (add_repo the repo first if needed).
3. Write a short report: tasks completed per project, draft PRs waiting for his review (with links), failed/skipped tasks and why, open 🤖 questions in data/inbox/, total minutes worked, and the 3 most useful next tasks. Do not include personal data (health, finances, family stories).
4. Send it with the Gmail connector to alemarti.2001@gmail.com, subject "🤖 Report settimanale progetti – <data>". If Gmail is unavailable, write it to data/automation/report-<AAAA-MM-GG>.md and commit to main.
