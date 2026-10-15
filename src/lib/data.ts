// Caricamento dati lato build: unisce i file in data/ con quanto raccolto dai repo.
import { getCollection } from 'astro:content';
import { STALE_AFTER_DAYS } from '../config';
import { buildProjectView, sortByPriority, type ProjectView, type RepoData } from './projects';
import orderFile from '../../data/order.json';

const generated = import.meta.glob<{ generatedAt: string; repos: Record<string, RepoData> }>('../generated/repos.json', {
  eager: true,
  import: 'default',
});
const repoInfo = Object.values(generated)[0] ?? { generatedAt: '', repos: {} };

export const generatedAt = repoInfo.generatedAt;

export interface Note {
  id: string;
  project: string;
  date: Date;
  type: 'nota' | 'modifica' | 'idea';
  resolved: boolean;
  text: string;
  path: string;
}

export interface Idea {
  id: string;
  date: Date;
  text: string;
  path: string;
}

export async function getNotes(): Promise<Note[]> {
  const entries = await getCollection('notes');
  return entries
    .map((e) => ({ id: e.id, ...e.data, text: e.body?.trim() ?? '', path: e.filePath ?? '' }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getIdeas(): Promise<Idea[]> {
  const entries = await getCollection('inbox');
  return entries
    .map((e) => ({ id: e.id, date: e.data.date, text: e.body?.trim() ?? '', path: e.filePath ?? '' }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

let cache: Promise<ProjectView[]> | undefined;

export function getProjects(): Promise<ProjectView[]> {
  cache ??= (async () => {
    const [entries, notes] = await Promise.all([getCollection('projects'), getNotes()]);
    const now = new Date();
    const views = entries.map((e) =>
      buildProjectView(
        { slug: e.id, ...e.data, body: e.body ?? '' },
        e.data.repo ? repoInfo.repos[e.data.repo] : undefined,
        notes.filter((n) => n.project === e.id && !n.resolved).length,
        now,
        STALE_AFTER_DAYS,
      ),
    );
    return sortByPriority(views, orderFile as string[]);
  })();
  return cache;
}
