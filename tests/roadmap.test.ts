import { describe, expect, it } from 'vitest';
import { openItems, parseRoadmap } from '../src/lib/roadmap';

describe('parseRoadmap', () => {
  it('conta le checkbox per fase ed esclude il Log', () => {
    const r = parseRoadmap(`# Roadmap

## Fase 1
- [x] Setup
- [X] Config
- [ ] Login
  - [ ] Password dimenticata

## Fase 2
* [ ] Deploy

## Log
- 2026-10-14: fatto il setup
- [x] questa non conta
`);
    expect(r.phases.map((p) => [p.title, p.done, p.total])).toEqual([
      ['Fase 1', 2, 4],
      ['Fase 2', 0, 1],
    ]);
    expect(r.done).toBe(2);
    expect(r.total).toBe(5);
    expect(r.phases[0].items[3]).toMatchObject({ text: 'Password dimenticata', depth: 1 });
    expect(r.log).toEqual([{ date: '2026-10-14', text: 'fatto il setup; [x] questa non conta' }]);
  });

  it('checklist senza titoli finiscono in una fase senza nome', () => {
    const r = parseRoadmap('- [x] uno\n- [ ] due');
    expect(r.phases).toHaveLength(1);
    expect(r.phases[0].title).toBe('');
    expect(r.total).toBe(2);
  });

  it('ignora le checkbox nei blocchi di codice', () => {
    const r = parseRoadmap('```md\n- [ ] esempio\n```\n- [ ] vera');
    expect(r.total).toBe(1);
  });

  it('legge il log con date in grassetto e sottotitoli datati, ordinato dal più recente', () => {
    const r = parseRoadmap(`## Diario
- **2026-09-01** — primo prototipo
### 2026-10-02
- sistemato il login
- aggiunti i test
## Altro
- [ ] dopo il log
`);
    expect(r.log).toEqual([
      { date: '2026-10-02', text: 'sistemato il login; aggiunti i test' },
      { date: '2026-09-01', text: 'primo prototipo' },
    ]);
    expect(r.phases.map((p) => p.title)).toEqual(['Altro']);
  });

  it('openItems restituisce i prossimi todo aperti in ordine', () => {
    const r = parseRoadmap('## A\n- [x] a1\n- [ ] a2\n## B\n- [ ] b1\n- [ ] b2');
    expect(openItems(r, 2)).toEqual(['a2', 'b1']);
  });

  it('mette le Idee a parte, fuori dalla percentuale; le sezioni in prosa non contano', () => {
    const r = parseRoadmap(`## Fase 1
- [x] fatto
- [ ] da fare

## Idee
- [ ] idea uno
### Sito
- [ ] idea due

## Decisioni e cose provate
Provato X, tornato indietro.

## Log
- 2026-10-18: protocollo unico
`);
    expect(r.phases.map((p) => p.title)).toEqual(['Fase 1']);
    expect(r.total).toBe(2);
    expect(r.ideas.map((i) => i.text)).toEqual(['idea uno', 'idea due']);
    expect(openItems(r)).toEqual(['da fare']);
    expect(r.log).toHaveLength(1);
  });
});
