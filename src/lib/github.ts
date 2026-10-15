// Client minimale per l'API GitHub usato dalle parti interattive del sito.
// Il token resta solo nel localStorage del tuo dispositivo.
import { DATA_BRANCH, DATA_REPO } from '../config';

const TOKEN_KEY = 'projects-overview:token';
const API = 'https://api.github.com';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage non disponibile */
  }
  document.documentElement.classList.toggle('edit-mode', !!token);
  window.dispatchEvent(new CustomEvent('po-token-change'));
}

export class GitHubError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}, token = getToken()): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      message = (await res.json()).message ?? message;
    } catch {
      /* risposta senza JSON */
    }
    throw new GitHubError(res.status, message);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function decodeBase64(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

const contentsPath = (path: string, repo = DATA_REPO) =>
  `/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;

export interface RepoFile {
  path: string;
  name: string;
  sha: string;
  content: string;
}

export async function listFiles(dir: string): Promise<{ name: string; path: string; sha: string }[]> {
  try {
    const items = await request<{ name: string; path: string; sha: string; type: string }[]>(
      `${contentsPath(dir)}?ref=${DATA_BRANCH}`,
    );
    return items.filter((i) => i.type === 'file' && i.name.endsWith('.md'));
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return [];
    throw e;
  }
}

export async function readFile(path: string, repo = DATA_REPO, ref = repo === DATA_REPO ? DATA_BRANCH : undefined): Promise<RepoFile> {
  const data = await request<{ path: string; name: string; sha: string; content: string }>(
    `${contentsPath(path, repo)}${ref ? `?ref=${ref}` : ''}`,
  );
  return { path: data.path, name: data.name, sha: data.sha, content: decodeBase64(data.content) };
}

/** Legge tutti i file .md di una cartella (in parallelo). */
export async function readDir(dir: string): Promise<RepoFile[]> {
  const files = await listFiles(dir);
  return Promise.all(files.map((f) => readFile(f.path)));
}

export async function writeFile(path: string, content: string, message: string, sha?: string): Promise<string> {
  const res = await request<{ content: { sha: string } }>(contentsPath(path), {
    method: 'PUT',
    body: JSON.stringify({ message, content: encodeBase64(content), branch: DATA_BRANCH, ...(sha ? { sha } : {}) }),
  });
  return res.content.sha;
}

export async function deleteFile(path: string, sha: string, message: string): Promise<void> {
  await request(contentsPath(path), {
    method: 'DELETE',
    body: JSON.stringify({ message, sha, branch: DATA_BRANCH }),
  });
}

/** Verifica che il token possa scrivere nel repo dei dati. */
export async function checkToken(token: string): Promise<{ ok: boolean; message: string }> {
  try {
    const repo = await request<{ full_name: string; permissions?: { push?: boolean } }>(`/repos/${DATA_REPO}`, {}, token);
    if (repo.permissions?.push) return { ok: true, message: `Token valido: puoi modificare ${repo.full_name}.` };
    return { ok: false, message: `Il token può leggere ${repo.full_name} ma non scriverci (serve "Contents: Read and write").` };
  } catch (e) {
    if (e instanceof GitHubError && (e.status === 401 || e.status === 403)) return { ok: false, message: 'Token non valido o scaduto.' };
    if (e instanceof GitHubError && e.status === 404) return { ok: false, message: `Il token non ha accesso a ${DATA_REPO}.` };
    return { ok: false, message: `Errore di rete: ${(e as Error).message}` };
  }
}

export function errorMessage(e: unknown): string {
  if (e instanceof GitHubError) {
    if (e.status === 401) return 'Token non valido o scaduto: aggiornalo in Impostazioni.';
    if (e.status === 403 || e.status === 404) return 'Il token non ha i permessi necessari.';
    if (e.status === 409) return 'Il file è stato modificato nel frattempo: ricarica la pagina e riprova.';
    if (e.status === 422) return 'Esiste già un file con questo nome (es. un progetto con lo stesso titolo).';
    return `GitHub: ${e.message}`;
  }
  return `Errore: ${(e as Error).message}`;
}
