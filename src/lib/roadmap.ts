export interface RoadmapItem {
  text: string;
  done: boolean;
  depth: number;
}

export interface Phase {
  title: string;
  items: RoadmapItem[];
  done: number;
  total: number;
}

export interface LogEntry {
  date: string;
  text: string;
}

export interface Roadmap {
  phases: Phase[];
  /** Voci della sezione "## Idee": mostrate a parte, non contano nell'avanzamento. */
  ideas: RoadmapItem[];
  log: LogEntry[];
  done: number;
  total: number;
}

const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const CHECKBOX = /^(\s*)[-*+]\s+\[([ xX])\]\s+(.*)$/;
const LOG_TITLE = /^(log|diario|changelog|registro|progressi)\b/i;
const IDEAS_TITLE = /^(idee|ideas)\b/i;
const DATE = /(\d{4}-\d{2}-\d{2})/;
const LOG_BULLET = /^\s*[-*+]\s+(?:\*\*|__)?(\d{4}-\d{2}-\d{2})(?:\*\*|__)?\s*[:\-–—]?\s*(.*)$/;
const PLAIN_BULLET = /^\s*[-*+]\s+(.*)$/;

/**
 * Legge un ROADMAP.md (o il corpo di un progetto) e ne estrae:
 * - le fasi (una per titolo) con le checklist `- [ ]` / `- [x]`
 * - il diario, dalla sezione "## Log" (righe `- AAAA-MM-GG: testo` o sottotitoli con data)
 * - le idee, dalla sezione "## Idee" (fuori dalla percentuale)
 */
export function parseRoadmap(markdown: string): Roadmap {
  const phases: Phase[] = [];
  const log: LogEntry[] = [];
  const ideas: Phase = { title: 'Idee', items: [], done: 0, total: 0 };
  let current: Phase = { title: '', items: [], done: 0, total: 0 };
  phases.push(current);

  let inFence = false;
  let logLevel = 0; // livello del titolo "Log" attivo, 0 = fuori dal log
  let datedEntry: LogEntry | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const heading = HEADING.exec(line);
    if (heading) {
      const level = heading[1].length;
      const title = heading[2].trim();
      if (logLevel && level > logLevel) {
        const date = DATE.exec(title);
        if (date) {
          const rest = title.replace(DATE, '').replace(/^[\s:\-–—]+/, '').trim();
          datedEntry = { date: date[1], text: rest };
          log.push(datedEntry);
          continue;
        }
      }
      datedEntry = null;
      logLevel = 0;
      if (LOG_TITLE.test(title)) {
        logLevel = level;
        continue;
      }
      if (level === 1) continue; // titolo del documento
      if (IDEAS_TITLE.test(title)) {
        current = ideas;
        continue;
      }
      current = { title, items: [], done: 0, total: 0 };
      phases.push(current);
      continue;
    }

    if (logLevel) {
      const bullet = LOG_BULLET.exec(line);
      if (bullet) {
        datedEntry = { date: bullet[1], text: bullet[2].trim() };
        log.push(datedEntry);
        continue;
      }
      const text = (PLAIN_BULLET.exec(line)?.[1] ?? line).trim();
      if (datedEntry && text) {
        datedEntry.text = datedEntry.text ? `${datedEntry.text}; ${text}` : text;
      }
      continue;
    }

    const box = CHECKBOX.exec(line);
    if (box) {
      const done = box[2].toLowerCase() === 'x';
      current.items.push({ text: box[3].trim(), done, depth: Math.floor(box[1].replace(/\t/g, '  ').length / 2) });
      current.total++;
      if (done) current.done++;
    }
  }

  const withItems = phases.filter((p) => p.items.length > 0);
  log.sort((a, b) => b.date.localeCompare(a.date));
  return {
    phases: withItems,
    ideas: ideas.items,
    log,
    done: withItems.reduce((n, p) => n + p.done, 0),
    total: withItems.reduce((n, p) => n + p.total, 0),
  };
}

export function openItems(roadmap: Roadmap, limit = Infinity): string[] {
  const out: string[] = [];
  for (const phase of roadmap.phases) {
    for (const item of phase.items) {
      if (!item.done) out.push(item.text);
      if (out.length >= limit) return out;
    }
  }
  return out;
}
