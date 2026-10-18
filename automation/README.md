# Assistente automatico

Sessioni Claude Code nel cloud che portano avanti i progetti da sole, leggendo priorità e `ROADMAP.md` da questo repo.

| Attività pianificata | Cron (Europe/Rome) | Prompt |
|---|---|---|
| Worker notturno | `50 0,5 * * *` (00:50 e 05:50, due finestre da 5 h distinte) | [`worker-prompt.md`](worker-prompt.md) |
| Sprint pre-reset | `50 12-23 * * 6` (sabato, ogni ora; reset settimanale domenica 00:00) | [`worker-prompt.md`](worker-prompt.md) |
| Report settimanale | `40 23 * * 6` (connettore Gmail) | [`report-prompt.md`](report-prompt.md) |

Ognuna crea una sessione nuova a ogni esecuzione. La sessione (Opus) pianifica i task e li fa eseguire a subagenti Sonnet, che consumano molto meno.

Le sessioni non possono cancellare branch: per non accumulare branch `auto/*` già uniti, attiva *Settings → General → Automatically delete head branches* nei repo dei progetti `in-corso`.

Log delle esecuzioni: `data/automation/log.md`. Domande dell'assistente: `data/inbox/` (iniziano con 🤖).
Per fermare tutto: disattiva le attività pianificate su claude.ai/code.
