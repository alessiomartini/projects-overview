import { parseRoadmap, openItems, type Roadmap } from './roadmap';

export const STATUSES = ['in-corso', 'idea', 'in-pausa', 'finito', 'abbandonato'] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  'in-corso': 'In corso',
  idea: 'Idea',
  'in-pausa': 'In pausa',
  finito: 'Finito',
  abbandonato: 'Abbandonato',
};

export const KINDS = ['web', 'ricerca', 'self-study', 'android', 'school'] as const;
export type Kind = (typeof KINDS)[number];

export const KIND_LABEL: Record<Kind, string> = {
  web: 'Sito web',
  ricerca: 'Ricerca',
  'self-study': 'Self-study',
  android: 'App Android',
  school: 'School',
};

/** Sezioni della home */
export const SECTIONS = ['attivi', 'niente', 'archiviati'] as const;
export type Section = (typeof SECTIONS)[number];

export const SECTION_LABEL: Record<Section, string> = {
  attivi: 'In corso / da fare',
  niente: 'Niente da fare',
  archiviati: 'Archiviati / chiusi',
};

/** Dati di un repo raccolti da scripts/fetch-repos.mjs */
export interface RepoData {
  ok: boolean;
  error?: string;
  private?: boolean;
  url?: string;
  roadmap?: string | null;
  lastCommit?: { date: string; message: string; url: string } | null;
  commits7?: number;
  commits30?: number;
  /** commit per giorno (UTC, ultimo anno); `msgs` solo per i repo pubblici */
  commitDays?: Record<string, { n: number; msgs?: string[] }>;
  latestRelease?: { tag: string; date: string; url: string } | null;
}

export interface ProjectInput {
  slug: string;
  title: string;
  status: Status;
  kind?: Kind;
  /** forza la sezione della home (scelta manuale) */
  section?: Section;
  summary?: string;
  tags: string[];
  repo?: string;
  link?: string;
  started?: Date;
  finished?: Date;
  showDetails?: boolean;
  body: string;
}

export type Badge = 'fermo' | 'completo';

export interface ProjectView extends ProjectInput {
  roadmap: Roadmap;
  /** da dove arriva la roadmap */
  roadmapSource: 'repo' | 'body' | 'none';
  progress: { done: number; total: number; pct: number } | null;
  nextTodos: string[];
  /** voci aperte nelle fasi intitolate "In corso" */
  doing: string[];
  /** altre voci aperte */
  todo: string[];
  section: Section;
  repoData?: RepoData;
  /** true se il repo è privato e i dettagli (testi dei todo, log, commit) vanno nascosti nel sito pubblico */
  detailsHidden: boolean;
  lastActivity?: string;
  badges: Badge[];
  openNotes: number;
  rank: number;
}

const DAY = 24 * 60 * 60 * 1000;

export function buildProjectView(
  input: ProjectInput,
  repoData: RepoData | undefined,
  openNotes: number,
  now: Date,
  staleAfterDays: number,
): ProjectView {
  let roadmap: Roadmap;
  let roadmapSource: ProjectView['roadmapSource'];
  if (repoData?.ok && repoData.roadmap) {
    roadmap = parseRoadmap(repoData.roadmap);
    roadmapSource = 'repo';
  } else {
    roadmap = parseRoadmap(input.body);
    roadmapSource = roadmap.total > 0 || roadmap.log.length > 0 ? 'body' : 'none';
  }

  const progress =
    input.status === 'idea'
      ? { done: 0, total: roadmap.total, pct: 0 }
      : roadmap.total > 0
      ? { done: roadmap.done, total: roadmap.total, pct: Math.round((roadmap.done / roadmap.total) * 100) }
      : null;

  const dates = [repoData?.lastCommit?.date, roadmap.log[0]?.date].filter(Boolean) as string[];
  const lastActivity = dates.sort((a, b) => Date.parse(b) - Date.parse(a))[0];

  const badges: Badge[] = [];
  const active = input.status === 'in-corso';
  if (active && repoData?.lastCommit && now.getTime() - Date.parse(repoData.lastCommit.date) > staleAfterDays * DAY) {
    badges.push('fermo');
  }
  if (progress?.pct === 100 && input.status !== 'finito' && input.status !== 'abbandonato') {
    badges.push('completo');
  }

  const detailsHidden = roadmapSource === 'repo' && !!repoData?.private && !input.showDetails;

  const doing: string[] = [];
  const todo: string[] = [];
  if (!detailsHidden) {
    for (const phase of roadmap.phases) {
      const target = /in corso|doing|wip/i.test(phase.title) ? doing : todo;
      for (const item of phase.items) if (!item.done && item.depth === 0) target.push(item.text);
    }
  }
  const openCount = roadmap.total - roadmap.done;
  const section: Section = input.section ??
    (input.status === 'finito' || input.status === 'abbandonato'
      ? 'archiviati'
      : input.status === 'idea' || openCount > 0
        ? 'attivi'
        : 'niente');

  return {
    ...input,
    doing,
    todo,
    section,
    roadmap,
    roadmapSource,
    progress,
    nextTodos: detailsHidden ? [] : openItems(roadmap, 3),
    repoData,
    detailsHidden,
    lastActivity,
    badges,
    openNotes,
    rank: 0,
  };
}

/**
 * Ordina per priorità: prima gli slug nell'ordine di order.json, poi gli altri per titolo.
 * Assegna a ogni progetto attivo (non finito/abbandonato) un rank 1..n.
 */
export function sortByPriority<T extends { slug: string; title: string; status: Status; rank: number }>(
  projects: T[],
  order: string[],
): T[] {
  const index = new Map(order.map((slug, i) => [slug, i]));
  const sorted = [...projects].sort((a, b) => {
    const ia = index.get(a.slug) ?? Infinity;
    const ib = index.get(b.slug) ?? Infinity;
    if (ia !== ib) return ia - ib;
    return a.title.localeCompare(b.title, 'it');
  });
  let rank = 0;
  for (const p of sorted) {
    p.rank = p.status === 'finito' || p.status === 'abbandonato' ? 0 : ++rank;
  }
  return sorted;
}

export function groupByStatus<T extends { status: Status }>(projects: T[]): Record<Status, T[]> {
  const groups = Object.fromEntries(STATUSES.map((s) => [s, [] as T[]])) as Record<Status, T[]>;
  for (const p of projects) groups[p.status].push(p);
  return groups;
}

export function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'progetto'
  );
}
