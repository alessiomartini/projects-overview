import { describe, expect, it } from 'vitest';
import { buildProjectView, slugify, sortByPriority, type ProjectInput, type RepoData } from '../src/lib/projects';
import { parseFrontmatter, stringifyFrontmatter } from '../src/lib/frontmatter';

const now = new Date('2026-10-15T12:00:00Z');
const base: ProjectInput = { slug: 'p', title: 'P', status: 'in-corso', tags: [], body: '' };
const repo = (over: Partial<RepoData> = {}): RepoData => ({
  ok: true,
  private: false,
  roadmap: '## A\n- [x] uno\n- [ ] due\n## Log\n- 2026-10-10: lavorato',
  lastCommit: { date: '2026-10-14T10:00:00Z', message: 'msg', url: '' },
  commits7: 3,
  commits30: 5,
  ...over,
});

describe('buildProjectView', () => {
  it('usa la roadmap del repo se presente', () => {
    const v = buildProjectView({ ...base, body: '- [x] corpo' }, repo(), 0, now, 30);
    expect(v.roadmapSource).toBe('repo');
    expect(v.progress).toEqual({ done: 1, total: 2, pct: 50 });
    expect(v.nextTodos).toEqual(['due']);
    expect(v.lastActivity).toBe('2026-10-14T10:00:00Z');
  });

  it('senza repo usa le checklist nel corpo del progetto', () => {
    const v = buildProjectView({ ...base, body: '- [x] a\n- [x] b' }, undefined, 0, now, 30);
    expect(v.roadmapSource).toBe('body');
    expect(v.progress?.pct).toBe(100);
    expect(v.badges).toContain('completo');
  });

  it('nessuna checklist → nessun progresso', () => {
    const v = buildProjectView({ ...base, body: 'solo testo' }, undefined, 0, now, 30);
    expect(v.progress).toBeNull();
    expect(v.roadmapSource).toBe('none');
  });

  it('segna come fermo un progetto in corso senza commit recenti', () => {
    const old = repo({ lastCommit: { date: '2026-08-01T00:00:00Z', message: '', url: '' } });
    expect(buildProjectView(base, old, 0, now, 30).badges).toContain('fermo');
    expect(buildProjectView({ ...base, status: 'in-pausa' }, old, 0, now, 30).badges).not.toContain('fermo');
  });

  it('nasconde i dettagli dei repo privati salvo showDetails', () => {
    const priv = repo({ private: true });
    const hidden = buildProjectView(base, priv, 0, now, 30);
    expect(hidden.detailsHidden).toBe(true);
    expect(hidden.nextTodos).toEqual([]);
    expect(hidden.progress?.pct).toBe(50);
    expect(buildProjectView({ ...base, showDetails: true }, priv, 0, now, 30).detailsHidden).toBe(false);
  });

  it('repo non raggiungibile → ricade sul corpo', () => {
    const v = buildProjectView({ ...base, body: '- [ ] x' }, { ok: false, error: '404' }, 0, now, 30);
    expect(v.roadmapSource).toBe('body');
  });
});

describe('sortByPriority', () => {
  it('ordina secondo order.json, poi per titolo, e assegna il rank solo agli attivi', () => {
    const items = [
      { slug: 'c', title: 'C', status: 'idea' as const, rank: 0 },
      { slug: 'f', title: 'F', status: 'finito' as const, rank: 0 },
      { slug: 'b', title: 'B', status: 'in-corso' as const, rank: 0 },
      { slug: 'a', title: 'A', status: 'in-pausa' as const, rank: 0 },
    ];
    const sorted = sortByPriority(items, ['b', 'f', 'missing']);
    expect(sorted.map((p) => [p.slug, p.rank])).toEqual([
      ['b', 1],
      ['f', 0],
      ['a', 2],
      ['c', 3],
    ]);
  });
});

describe('utility', () => {
  it('slugify', () => {
    expect(slugify('Città più bella!  2.0')).toBe('citta-piu-bella-2-0');
    expect(slugify('???')).toBe('progetto');
  });

  it('frontmatter andata e ritorno', () => {
    const text = stringifyFrontmatter({ project: 'p', date: '2026-10-15T10:00:00.000Z', type: 'nota', resolved: false }, 'Ciao "mondo"\nriga 2');
    expect(parseFrontmatter(text)).toEqual({
      data: { project: 'p', date: '2026-10-15T10:00:00.000Z', type: 'nota', resolved: false },
      body: 'Ciao "mondo"\nriga 2',
    });
  });
});

import { inlineMarkdown } from '../src/lib/format';
describe('inlineMarkdown', () => {
  it('formatta codice, grassetto e link facendo escape dell\'HTML', () => {
    expect(inlineMarkdown('usa `<b>` e **forte** [qui](https://x.it) <script>')).toBe(
      'usa <code>&lt;b&gt;</code> e <strong>forte</strong> <a href="https://x.it">qui</a> &lt;script&gt;',
    );
  });
});
