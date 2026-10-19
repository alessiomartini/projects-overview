// Vista calendario: aggrega le voci di `## Log` di tutti i progetti per giorno.
import type { ProjectView } from './projects';

export type EntryType = 'log' | 'commit';

export interface DayEntry {
  project: string;
  slug: string;
  /** null se il repo è privato (o personale) e i dettagli sono nascosti */
  text: string | null;
  /** default 'log' */
  type?: EntryType;
  /** quante attività rappresenta la voce (default 1; >1 per i commit aggregati di repo privati) */
  count?: number;
}

export interface Cell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  inRange: boolean;
}

const DAY = 24 * 60 * 60 * 1000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** I messaggi dei commit si mostrano solo per repo pubblici non taggati `personale`; altrimenti solo il conteggio. */
export function commitsHidden(p: Pick<ProjectView, 'tags' | 'repoData'>): boolean {
  return p.repoData?.private !== false || p.tags.includes('personale');
}

export function collectEntries(projects: ProjectView[]): Record<string, DayEntry[]> {
  const byDay: Record<string, DayEntry[]> = {};
  for (const p of projects) {
    for (const e of p.roadmap.log) {
      (byDay[e.date] ??= []).push({ project: p.title, slug: p.slug, text: p.detailsHidden ? null : e.text, type: 'log' });
    }
    const days = p.repoData?.ok ? p.repoData.commitDays : undefined;
    if (!days) continue;
    const hidden = commitsHidden(p);
    for (const [date, d] of Object.entries(days)) {
      if (!d.n) continue;
      if (hidden || !d.msgs?.length) {
        (byDay[date] ??= []).push({ project: p.title, slug: p.slug, text: null, type: 'commit', count: d.n });
      } else {
        for (const m of d.msgs) (byDay[date] ??= []).push({ project: p.title, slug: p.slug, text: m, type: 'commit', count: 1 });
      }
    }
  }
  return byDay;
}

export const entryCount = (e: DayEntry) => e.count ?? 1;
export const dayCount = (entries: DayEntry[] | undefined) => (entries ?? []).reduce((n, e) => n + entryCount(e), 0);

export function levelFor(count: number): Cell['level'] {
  return count <= 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;
}

/** Griglia di settimane (colonne, da lunedì a domenica) che termina nella settimana di `today`. */
export function buildGrid(byDay: Record<string, DayEntry[]>, today: Date, weeks = 53): Cell[][] {
  const t = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const dow = (t.getUTCDay() + 6) % 7; // lunedì = 0
  const start = new Date(t.getTime() - (dow + (weeks - 1) * 7) * DAY);
  const todayIso = iso(t);
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = iso(new Date(start.getTime() + (w * 7 + d) * DAY));
      const count = dayCount(byDay[date]);
      return { date, count, level: levelFor(count), inRange: date <= todayIso };
    }),
  );
}
