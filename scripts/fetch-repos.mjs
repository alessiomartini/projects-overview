// Raccoglie dai repo GitHub collegati ai progetti: ROADMAP.md, commit recenti, ultima release.
// Scrive src/generated/repos.json, letto dal sito in fase di build.
//
// Token: REPOS_TOKEN (o GITHUB_TOKEN) se presente, necessario per i repo privati.
// Se un repo non è raggiungibile si usa il dato in fixtures/repos.json (se c'è), così la build non fallisce.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const PROJECTS_DIR = join(ROOT, 'data/projects');
const OUT = join(ROOT, 'src/generated/repos.json');
const FIXTURES = join(ROOT, 'fixtures/repos.json');
const API = 'https://api.github.com';
const token = process.env.REPOS_TOKEN || process.env.GITHUB_TOKEN || '';
const offline = process.env.OFFLINE === '1';

const DAY = 24 * 60 * 60 * 1000;

async function gh(path, accept = 'application/vnd.github+json') {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Accept: accept,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'projects-overview',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} su ${path}`);
  return accept.endsWith('raw') ? res.text() : res.json();
}

async function fetchRepo(repo) {
  const info = await gh(`/repos/${repo}`);
  if (!info) throw new Error('repo non trovato (o token senza accesso)');
  const branch = info.default_branch;

  const since30 = new Date(Date.now() - 30 * DAY).toISOString();
  const [roadmap, recent, latest, release] = await Promise.all([
    gh(`/repos/${repo}/contents/ROADMAP.md?ref=${branch}`, 'application/vnd.github.raw'),
    gh(`/repos/${repo}/commits?sha=${branch}&since=${since30}&per_page=100`),
    gh(`/repos/${repo}/commits?sha=${branch}&per_page=1`),
    gh(`/repos/${repo}/releases/latest`),
  ]);

  const recentCommits = recent ?? [];
  const last = latest?.[0];
  const since7 = Date.now() - 7 * DAY;
  return {
    ok: true,
    private: info.private,
    url: info.html_url,
    roadmap: roadmap ?? null,
    lastCommit: last
      ? { date: last.commit.committer?.date ?? last.commit.author?.date, message: last.commit.message.split('\n')[0], url: last.html_url }
      : null,
    commits7: recentCommits.filter((c) => Date.parse(c.commit.committer?.date ?? c.commit.author?.date) >= since7).length,
    commits30: recentCommits.length,
    latestRelease: release ? { tag: release.tag_name, date: release.published_at, url: release.html_url } : null,
  };
}

async function linkedRepos() {
  const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith('.md'));
  const repos = new Set();
  for (const file of files) {
    const text = await readFile(join(PROJECTS_DIR, file), 'utf8');
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? '';
    const repo = /^repo:\s*["']?([\w.-]+\/[\w.-]+)["']?\s*$/m.exec(fm)?.[1];
    if (repo) repos.add(repo);
  }
  return [...repos];
}

const fixtures = JSON.parse(await readFile(FIXTURES, 'utf8').catch(() => '{}'));
const repos = await linkedRepos();
const result = {};

if (!token && !offline) console.log('ℹ Nessun REPOS_TOKEN: leggo solo i repo pubblici.');

await Promise.all(
  repos.map(async (repo) => {
    try {
      if (offline) throw new Error('modalità offline');
      result[repo] = await fetchRepo(repo);
      console.log(`✓ ${repo}${result[repo].roadmap ? '' : ' (nessun ROADMAP.md)'}`);
    } catch (e) {
      if (fixtures[repo]) {
        result[repo] = fixtures[repo];
        console.log(`↺ ${repo}: ${e.message} → uso fixtures/repos.json`);
      } else {
        result[repo] = { ok: false, error: e.message };
        console.warn(`✗ ${repo}: ${e.message}`);
      }
    }
  }),
);

await mkdir(join(ROOT, 'src/generated'), { recursive: true });
await writeFile(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), repos: result }, null, 2) + '\n');
console.log(`Scritto ${OUT} (${repos.length} repo).`);
