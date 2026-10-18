// Vista calendario: aggrega le voci di `## Log` di tutti i progetti per giorno.
import type { ProjectView } from './projects';

export interface DayEntry {
  project: string;
  slug: string;
  /** null se il repo è privato e i dettagli sono nascosti */
  text: string | null;
}

export interface Cell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  inRange: boolean;
}

const DAY = 24 * 60 * 60 * 1000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

export function collectEntries(projects: ProjectView[]): Record<string, DayEntry[]> {
  const byDay: Record<string, DayEntry[]> = {};
  for (const p of projects) {
    for (const e of p.roadmap.log) {
      (byDay[e.date] ??= []).push({ project: p.title, slug: p.slug, text: p.detailsHidden ? null : e.text });
    }
  }
  return byDay;
}

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
      const count = byDay[date]?.length ?? 0;
      return { date, count, level: levelFor(count), inRange: date <= todayIso };
    }),
  );
}
