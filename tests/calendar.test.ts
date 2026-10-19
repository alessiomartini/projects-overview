import { describe, expect, it } from 'vitest';
import { buildGrid, levelFor } from '../src/lib/calendar';

describe('calendar', () => {
  it('livelli di intensità', () => {
    expect([0, 1, 2, 3, 4, 5, 9].map(levelFor)).toEqual([0, 1, 2, 3, 3, 4, 4]);
  });
  it('griglia: 53 settimane da lunedì, oggi nell\'ultima colonna', () => {
    const today = new Date('2026-10-18T10:00:00Z'); // domenica
    const g = buildGrid({ '2026-10-18': [{ project: 'x', slug: 'x', text: 't' }] }, today);
    expect(g).toHaveLength(53);
    expect(g[0][0].date).toBe('2025-10-13');
    expect(g[52][6]).toMatchObject({ date: '2026-10-18', count: 1, level: 1, inRange: true });
  });
  it('giorni futuri fuori intervallo', () => {
    const g = buildGrid({}, new Date('2026-10-14T00:00:00Z'));
    expect(g[52][6].inRange).toBe(false);
    expect(g[52][2].inRange).toBe(true);
  });
});

import { collectEntries, commitsHidden, dayCount } from '../src/lib/calendar';

const proj = (over: any) => ({
  title: 'P', slug: 'p', tags: [], detailsHidden: false, roadmap: { log: [{ date: '2026-10-15', text: 'voce' }] },
  repoData: { ok: true, private: false, commitDays: { '2026-10-15': { n: 2, msgs: ['a', 'b'] }, '2026-10-16': { n: 1, msgs: ['c'] } } },
  ...over,
}) as any;

describe('calendar: commit', () => {
  it('repo pubblico: un elemento per commit, con messaggio; sommati alle voci di log', () => {
    const by = collectEntries([proj({})]);
    expect(dayCount(by['2026-10-15'])).toBe(3);
    expect(by['2026-10-15'].filter((e) => e.type === 'commit').map((e) => e.text)).toEqual(['a', 'b']);
    expect(dayCount(by['2026-10-16'])).toBe(1);
  });
  it('privacy: repo privato o taggato personale -> solo conteggi, mai messaggi', () => {
    for (const over of [
      { repoData: { ok: true, private: true, commitDays: { '2026-10-15': { n: 3, msgs: ['segreto'] } } } },
      { tags: ['personale'] },
      { repoData: { ok: true, commitDays: { '2026-10-15': { n: 3, msgs: ['segreto'] } } } }, // privacy sconosciuta
    ]) {
      const p = proj(over);
      expect(commitsHidden(p)).toBe(true);
      const commits = collectEntries([p])['2026-10-15'].filter((e) => e.type === 'commit');
      expect(commits).toHaveLength(1);
      expect(commits[0]).toMatchObject({ text: null, count: expect.any(Number) });
      expect(JSON.stringify(commits)).not.toContain('segreto');
    }
  });
  it('repo non raggiungibile: nessun commit, nessun errore', () => {
    const by = collectEntries([proj({ repoData: { ok: false, error: 'x' } })]);
    expect(dayCount(by['2026-10-15'])).toBe(1);
  });
});
