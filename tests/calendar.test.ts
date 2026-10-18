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
