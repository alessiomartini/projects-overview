#!/usr/bin/env python3
"""Genera E:\\Alessio\\Projects_Git\\home.html, la pagina locale (file:///) con tutti i progetti.

RIGENERARE (dopo aver aggiunto/spostato un progetto o cambiato una scheda/ROADMAP):
    python E:\\Alessio\\Projects_Git\\projects-overview\\scripts\\build-home.py
    (opzionale: un percorso come argomento = file di output diverso)
Solo libreria standard, niente rete e niente `gh`.

DA DOVE VENGONO I DATI
  - cartelle di Projects_Git (una = un progetto); GitHub dal `git remote origin` (URL letto da .git/config)
  - scheda `projects-overview/data/projects/<slug>.md` (titolo, summary, status, kind, tags), collegata alla
    cartella tramite il campo `repo:`; senza scheda: titolo dal nome cartella, descrizione dal README
  - percentuale: checkbox del ROADMAP.md fuori da "## Idee" e "## Log" (stessa regola di projects-overview)
  - sito live / pagine locali / PDF: tabelle LIVE, LOCAL, PDFS qui sotto (a mano)
DOVE STA OGNI PROGETTO: tabella SECTIONS qui sotto (a mano; gerarchia = alessio-projects-map.md).
  Un progetto non elencato finisce in "Da collocare" e lo script lo segnala: aggiungilo a SECTIONS.
La chiave in SECTIONS e' il nome della cartella, oppure lo slug della scheda se non c'e' cartella (idee).
La pagina e' aperta all'avvio dal collegamento "Progetti.lnk" (Chrome) in shell:startup.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]            # Projects_Git
CARDS = ROOT / 'projects-overview' / 'data' / 'projects'
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'home.html'
DB = 'file:///E:/Alessio/Dropbox/Tesi-e-CV/'
PAGES = 'https://alessiomartini.github.io/'

# (sezione, [(progetto, [figli...]), ...])
SECTIONS = [
    ('Sopra tutti', [('projects-overview', []), ('site-notes', [])]),
    ('Vita e dati personali', [
        ('life-log', ['PENSIERI', 'personal-healthcare', 'snapshots-psicologia-personale', 'self-quantification',
                      'morning-brief']),
        ('cassaforte-dati-personali', []), ('film-salvati', []), ('storie-raccontate', [])]),
    ('Lavoro', [('job-research-website', []), ('personal-cv-resume', []), ('alessiomartini.github.io', [])]),
    ('Finanza e quant', [('markets-first-principles', [
        'mit-18642-lecture-notes', 'lecture-notes-economics-of-money-and-banking-Perry-Mehrling',
        'notebooks-econophysics-benzaquen', 'wikipedia-attention-etf-volatility'])]),
    ('Capire il mondo', [('capire-il-mondo', ['geopolitics-atlas', 'world-economies-map', 'realtime-earth'])]),
    ('Musica', [('music-library', ['music-library-offline']), ('ear-training', [])]),
    ('Amsterdam', [('eating-amsterdam', []), ('amsterdam-events', [])]),
    ('Studio e corsi', [
        ('anki-decks', ['flash-cards-app']), ('study-pdfs', []), ('conceptual-map-physics-math', []),
        ('lecture-notes-dynamical-systems-data', []), ('notebooks-ml-and-deep-learning', []),
        ('ethical-hacking', []), ('diritti-cittadini-europei', [])]),
    ('Altri progetti', [('mountain-huts-map', [])]),
    ('Strumenti', [('google-tasks', []), ('grocery-list', []), ('google-photos-cleanup', [])]),
    ('Archivio (università e scuola)', [
        ('msc-thesis-non-invertible-symmetries', []), ('msc-liquid-fragmentation-report', []),
        ('msc-non-equilibrium-statistical-mechanics', []), ('msc-hydrodynamics-homework', []),
        ('bsc-thesis-scale-anomaly-in-qm', []), ('bsc-computational-physics-exercises', []),
        ('bsc-intro-to-c-programming', []), ('bsc-physics-lab-1-mechanics-and-waves', []),
        ('bsc-physics-lab-2-circuits-and-optics', []), ('archive-bsc-thesis-scale-anomaly', []),
        ('archive-csharp-first-exercises', []), ('archive-highschool-programming', []),
        ('archive-pic18-assembly-projects', [])]),
]
LIVE = {  # sito online (le schede con `url:` lo danno da sole)
    'alessiomartini.github.io': PAGES, 'projects-overview': PAGES + 'projects-overview/',
    'music-library': PAGES + 'music-library/', 'conceptual-map-physics-math': PAGES + 'conceptual-map-physics-math/',
    'geopolitics-atlas': PAGES + 'geopolitics-atlas/', 'film-salvati': PAGES + 'film-salvati/',
    'markets-first-principles': PAGES + 'markets-first-principles/', 'ear-training': PAGES + 'ear-training/',
    'eating-amsterdam': PAGES + 'eating-amsterdam/', 'amsterdam-events': PAGES + 'amsterdam-events/',
    'realtime-earth': 'https://realtime-earth.alemarti-2001.workers.dev/',
    'mountain-huts-map': 'https://mountain-huts-map.alemarti-2001.workers.dev/it/',
    'job-research-website': 'https://job-research-website.alemarti-2001.workers.dev/',
}
LOCAL = {  # pagine locali generate dai progetti (cartella -> [(etichetta, file)])
    'PENSIERI': [('Diario', 'index.html')], 'storie-raccontate': [('Storie', 'index.html')],
    'personal-healthcare': [('Health Log', 'index.html')],
    'life-log': [('Life Log', 'index.html'), ('Finanze', 'finanze.html'), ('Claude', 'claude.html')],
}
PDFS = {  # PDF copiati in Dropbox
    'mit-18642-lecture-notes': [('PDF', 'Lecture notes - MIT 18.642 Math Finance.pdf')],
    'lecture-notes-dynamical-systems-data': [('PDF', 'Lecture notes - Dynamical Systems and Data.pdf')],
    'lecture-notes-economics-of-money-and-banking-Perry-Mehrling':
        [('PDF', 'Lecture notes - Economics of Money and Banking (Mehrling).pdf')],
    'notebooks-econophysics-benzaquen': [('PDF', 'Econophysics - Modelling Financial Markets.pdf')],
    'msc-thesis-non-invertible-symmetries': [('Tesi', 'MSc thesis.pdf'), ('Slide', 'MSc thesis - presentation.pdf')],
    'personal-cv-resume': [('CV', 'CV/CV_general.pdf'), ('CV AM', 'CV/CV_am.pdf'), ('CV energy', 'CV/CV_energy.pdf'),
                           ('CV prop', 'CV/CV_prop.pdf')],
}
EXTRA = {  # progetti senza scheda ne' README adatto
    'archive-bsc-thesis-scale-anomaly': dict(title='Tesi triennale (archivio)', status='finito', type='ricerca',
        desc='Archivio della tesi triennale sulla scale anomaly in meccanica quantistica.'),
    'snapshots-psicologia-personale': dict(title='Snapshot psicologici', status='attivo', type='dati',
        desc='Fotografie periodiche di me stesso (solo locale, non e un repo git).'),
    'music-library-offline': dict(title='Music Library Offline', status='attivo', type='dati',
        desc='Registrazioni sorgente e pipeline Python di trascrizione audio per music-library.'),
}
STATUS = {'in-corso': 'attivo', 'in-pausa': 'pausa', 'idea': 'idea', 'finito': 'finito', 'abbandonato': 'finito'}
KIND = {'web': 'sito', 'android': 'app', 'dati': 'dati', 'strumento': 'strumento', 'ricerca': 'ricerca',
        'automazione': 'automazione', 'school': 'corso', 'self-study': 'studio'}


def frontmatter(p):
    t = p.read_text(encoding='utf-8')
    m = re.match(r'---\r?\n(.*?)\r?\n---', t, re.S)
    d = {}
    for line in (m.group(1).splitlines() if m else []):
        k, _, v = line.partition(':')
        d[k.strip()] = v.strip().strip('"')
    if d.get('tags', '').startswith('['):
        d['tags'] = [x.strip() for x in d['tags'].strip('[]').split(',') if x.strip()]
    return d


def remote(folder):
    cfg = folder / '.git' / 'config'
    if not cfg.is_file():
        return None
    m = re.search(r'\[remote "origin"\][^\[]*?url\s*=\s*(\S+)', cfg.read_text(encoding='utf-8', errors='ignore'))
    m = m and re.search(r'github\.com[:/]([^/]+/[^/\s]+?)(?:\.git)?$', m.group(1))
    return m.group(1) if m else None


def percent(folder):
    f = folder / 'ROADMAP.md'
    if not f.is_file():
        return None
    done = total = 0
    skip = 0  # livello del titolo Log/Idee attivo
    fence = False
    for line in f.read_text(encoding='utf-8', errors='ignore').splitlines():
        if re.match(r'\s*(```|~~~)', line):
            fence = not fence
            continue
        if fence:
            continue
        h = re.match(r'(#{1,6})\s+(.*?)\s*#*\s*$', line)
        if h:
            lvl = len(h.group(1))
            if skip and lvl > skip:
                continue
            skip = lvl if re.match(r'(log|diario|changelog|registro|progressi|idee|ideas)\b', h.group(2), re.I) else 0
            continue
        b = re.match(r'\s*[-*+]\s+\[([ xX])\]', line)
        if b and not skip:
            total += 1
            done += b.group(1) != ' '
    return round(100 * done / total) if total else None


def readme_line(folder):
    f = folder / 'README.md'
    if f.is_file():
        for line in f.read_text(encoding='utf-8', errors='ignore').splitlines():
            line = re.sub(r'[*_`>#]|\[([^\]]*)\]\([^)]*\)', r'\1', line).strip()
            if len(line) > 25 and not line.startswith(('!', '<', '|', '-')):
                return line[:200]
    return ''


def ptype(c, d):
    tags = d.get('tags', [])
    if 'latex' in tags and ('appunti' in tags or 'cv' in d.get('title', '').lower()):
        return 'note LaTeX'
    if 'cli' in tags:
        return 'CLI'
    if d.get('title', '').lower().startswith('notebooks') or c.startswith('notebooks'):
        return 'notebook'
    return KIND.get(d.get('kind'), 'altro')


def main():
    cards = {p.stem: frontmatter(p) for p in CARDS.glob('*.md')}
    by_repo = {d['repo'].split('/')[-1]: d for d in cards.values() if d.get('repo')}
    folders = {p.name: p for p in ROOT.iterdir() if p.is_dir() and not p.name.startswith('.')}
    projects = {}
    for name, folder in folders.items():
        rem = remote(folder)
        d = dict(by_repo.get((rem or '').split('/')[-1]) or {})
        if name == 'alessiomartini.github.io':
            d = cards['alessiomartini-github-io']
        x = EXTRA.get(name, {})
        projects[name] = dict(
            title=x.get('title') or d.get('title') or name, desc=d.get('summary') or x.get('desc') or readme_line(folder),
            status=x.get('status') or STATUS.get(d.get('status'), 'attivo'), type=x.get('type') or ptype(name, d),
            tags=d.get('tags', []), folder=folder, github=rem, pct=percent(folder),
            live=d.get('url') or LIVE.get(name))
    for slug, d in cards.items():  # idee senza cartella
        if not d.get('repo') and slug not in folders:
            projects[slug] = dict(title=d['title'], desc=d.get('summary', ''), status=STATUS.get(d.get('status'), 'idea'),
                                  type=ptype(slug, d), tags=d.get('tags', []), folder=None, github=None, pct=None,
                                  live=d.get('url'))

    placed, secs = set(), []
    def card(key, parent=None):
        p = projects[key]
        placed.add(key)
        links = []
        if p['folder']:
            links.append(['Cartella', 'file:///' + p['folder'].as_posix()])
            for lab, f in LOCAL.get(key, []):
                if (p['folder'] / f).is_file():
                    links.append([lab, 'file:///' + (p['folder'] / f).as_posix()])
        if p['live']:
            links.append(['Sito', p['live']])
        for lab, f in PDFS.get(key, []):
            links.append([lab, DB + f.replace(' ', '%20')])
        if p['github']:
            links.append(['GitHub', 'https://github.com/' + p['github']])
        if p['folder'] and (p['folder'] / 'ROADMAP.md').is_file():
            links.append(['ROADMAP', 'https://github.com/%s/blob/main/ROADMAP.md' % p['github'] if p['github']
                          else 'file:///' + (p['folder'] / 'ROADMAP.md').as_posix()])
        return dict(id=key, title=p['title'], desc=p['desc'], status=p['status'], type=p['type'], tags=p['tags'],
                    pct=p['pct'], links=links, parent=parent)
    for title, groups in SECTIONS:
        out = []
        for key, kids in groups:
            if key not in projects:
                print('ATTENZIONE: manca in', title, '->', key); continue
            out.append([card(key)] + [card(k, key) for k in kids if k in projects])
            for k in kids:
                if k not in projects:
                    print('ATTENZIONE: figlio mancante', k)
        secs.append(dict(title=title, groups=out))
    rest = [k for k in projects if k not in placed]
    if rest:
        print('DA COLLOCARE (aggiungili a SECTIONS):', rest)
        secs.append(dict(title='Da collocare', groups=[[card(k)] for k in rest]))
    data = json.dumps(secs, ensure_ascii=False).replace('</', '<\\/')
    OUT.write_text(TEMPLATE.replace('/*DATA*/[]', data), encoding='utf-8')
    n = sum(len(g) for s in secs for g in s['groups'])
    print('scritto', OUT, '-', n, 'progetti in', len(secs), 'sezioni')
    for s in secs:
        print('  %-34s %d' % (s['title'], sum(len(g) for g in s['groups'])))


TEMPLATE = r'''<!doctype html>
<!-- GENERATO da projects-overview/scripts/build-home.py: non modificare a mano, rigenera con
     python E:\Alessio\Projects_Git\projects-overview\scripts\build-home.py -->
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Progetti</title>
<style>
:root{--bg:#f6f7f9;--fg:#1d1d1f;--mut:#6b6b70;--card:#fff;--line:#e3e3e6;--acc:#1565C0}
@media (prefers-color-scheme:dark){:root{--bg:#141416;--fg:#ececf0;--mut:#9a9aa2;--card:#1e1e22;--line:#33333a;--acc:#64b5f6}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,sans-serif}
main{max-width:1200px;margin:0 auto;padding:16px 16px 40px}
.top{position:sticky;top:0;z-index:5;background:var(--bg);padding:8px 0 10px;border-bottom:1px solid var(--line)}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
h1{margin:0 12px 0 0;font-size:22px}
input{font:inherit;padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--fg);flex:1;min-width:200px}
button.f{font:inherit;font-size:13px;padding:3px 10px;border:1px solid var(--line);border-radius:99px;background:var(--card);color:var(--fg);cursor:pointer}
button.f.on{background:var(--acc);border-color:var(--acc);color:var(--bg)}
.lab{font-size:12px;color:var(--mut);margin-right:2px}
#n{font-size:13px;color:var(--mut)}
h2{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin:24px 0 8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:10px}
.kids{margin:8px 0 0 14px;padding-left:12px;border-left:3px solid var(--line)}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:5px}
.card.dim{opacity:.5}
.card b{font-size:15px}
.d{color:var(--mut);font-size:13px}
.m{display:flex;flex-wrap:wrap;gap:5px;align-items:center;font-size:11.5px}
.m span{border:1px solid var(--line);border-radius:99px;padding:0 7px;color:var(--mut)}
.m .s-attivo{color:#2E7D32;border-color:#2E7D32}.m .s-idea{color:#EF6C00;border-color:#EF6C00}
.m .s-pausa{color:#8E24AA;border-color:#8E24AA}.m .s-finito{color:#546E7A;border-color:#546E7A}
.bar{height:5px;border-radius:3px;background:var(--line);overflow:hidden}.bar i{display:block;height:100%;background:var(--acc)}
.l{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:13px;margin-top:auto}
@media (max-width:700px){.top{position:static}}
a{font-weight:700;text-decoration:none;color:inherit}a:hover{color:var(--acc)}
.hidden{display:none!important}
</style>
</head>
<body>
<main>
<div class="top">
  <div class="row"><h1>Progetti</h1>
    <input id="q" type="search" placeholder="Cerca per titolo, descrizione, tag… (Invio apre il primo)" autofocus>
    <span id="n"></span></div>
  <div class="row" style="margin-top:6px"><span class="lab">Stato</span><span id="fs" class="row"></span>
    <span class="lab" style="margin-left:10px">Tipo</span><span id="ft" class="row"></span></div>
</div>
<div id="out"></div>
</main>
<script>
const SECS = /*DATA*/[];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const all = SECS.flatMap((s) => s.groups.flat().map((c) => ({ ...c, sec: s.title })));
const cardHtml = (c) => `<div class="card" id="c-${esc(c.id)}">
  <b>${esc(c.title)}</b><div class="d">${esc(c.desc)}</div>
  <div class="m"><span class="s-${c.status}">${c.status}</span><span>${esc(c.type)}</span>${c.tags.filter((t) => t !== c.type).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
  ${c.pct == null ? '' : `<div class="bar" title="${c.pct}% della ROADMAP"><i style="width:${c.pct}%"></i></div>`}
  <div class="l">${c.pct == null ? '' : `<span class="d">${c.pct}%</span>`}${c.links.map(([l, u]) => `<a href="${esc(u)}">${esc(l)}</a>`).join('')}</div></div>`;
document.getElementById('out').innerHTML = SECS.map((s) => `<section><h2>${esc(s.title)}</h2>` + s.groups.map((g) =>
  `<div class="grp"><div class="grid">${cardHtml(g[0])}</div>` + (g.length > 1 ? `<div class="kids grid">${g.slice(1).map(cardHtml).join('')}</div>` : '') + '</div>').join('') + '</section>').join('');
const st = { s: new Set(), t: new Set() };
const chips = (id, key, vals) => {
  const box = document.getElementById(id);
  for (const v of vals) {
    const b = document.createElement('button'); b.className = 'f'; b.textContent = v;
    b.onclick = () => { st[key].has(v) ? st[key].delete(v) : st[key].add(v); b.classList.toggle('on'); run(); };
    box.append(b);
  }
};
chips('fs', 's', ['attivo', 'idea', 'pausa', 'finito']);
chips('ft', 't', [...new Set(all.map((c) => c.type))].sort());
const q = document.getElementById('q');
function run() {
  const t = q.value.trim().toLowerCase(), words = t.split(/\s+/).filter(Boolean);
  const hit = {};
  let n = 0;
  for (const c of all) {
    const hay = (c.title + ' ' + c.desc + ' ' + c.tags.join(' ') + ' ' + c.type + ' ' + c.status + ' ' + c.id).toLowerCase();
    hit[c.id] = words.every((w) => hay.includes(w)) && (!st.s.size || st.s.has(c.status)) && (!st.t.size || st.t.has(c.type));
    n += hit[c.id];
  }
  for (const s of SECS) for (const g of s.groups) {
    const anyKid = g.slice(1).some((c) => hit[c.id]);
    for (const [i, c] of g.entries()) {
      const el = document.getElementById('c-' + c.id);
      el.classList.toggle('hidden', !(hit[c.id] || (i === 0 && anyKid)));
      el.classList.toggle('dim', i === 0 && !hit[c.id]);
    }
  }
  for (const g of document.querySelectorAll('.grp')) g.classList.toggle('hidden', !g.querySelector('.card:not(.hidden)'));
  for (const s of document.querySelectorAll('section')) s.classList.toggle('hidden', !s.querySelector('.card:not(.hidden)'));
  document.getElementById('n').textContent = n + ' / ' + all.length;
}
q.addEventListener('input', run);
q.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { const a = document.querySelector('.card:not(.hidden) .l a'); if (a) location.href = a.href; }
});
run();
</script>
</body>
</html>
'''

if __name__ == '__main__':
    main()
