import { useEffect, useState } from 'preact/hooks';
import { deleteFile, errorMessage, readDir, writeFile } from '../lib/github';
import { parseFrontmatter } from '../lib/frontmatter';
import { slugify } from '../lib/projects';
import IdeaForm, { type SavedIdea } from './IdeaForm';
import { useToken } from './useToken';

interface Idea {
  path: string;
  sha?: string;
  date: string;
  text: string;
}

interface Props {
  initial: Idea[];
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('it-IT', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const sortIdeas = (ideas: Idea[]) => [...ideas].sort((a, b) => b.date.localeCompare(a.date));

function projectFile(title: string, text: string): string {
  const lines = text.split('\n');
  const summary = lines[0] === title ? lines.slice(1).join(' ').trim().slice(0, 140) : lines[0].slice(0, 140);
  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    'status: idea',
    ...(summary ? [`summary: ${JSON.stringify(summary)}`] : []),
    'tags: []',
    '---',
    '',
    text.trim(),
    '',
  ].join('\n');
}

export default function InboxList({ initial }: Props) {
  const token = useToken();
  const [ideas, setIdeas] = useState<Idea[]>(initial);
  const [live, setLive] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    readDir('data/inbox')
      .then((files) => {
        setIdeas(
          sortIdeas(
            files.map((f) => {
              const { data, body } = parseFrontmatter(f.content);
              return { path: f.path, sha: f.sha, date: String(data.date ?? ''), text: body };
            }),
          ),
        );
        setLive(true);
      })
      .catch((e) => setMsg({ kind: 'error', text: errorMessage(e) }));
  }, [token]);

  const added = (idea: SavedIdea) => setIdeas((list) => sortIdeas([idea, ...list.filter((i) => i.path !== idea.path)]));

  async function withIdea(idea: Idea, action: () => Promise<string>) {
    if (!idea.sha) return;
    setBusy(idea.path);
    setMsg(null);
    try {
      const text = await action();
      setIdeas((list) => list.filter((i) => i.path !== idea.path));
      setMsg({ kind: 'ok', text });
    } catch (e) {
      setMsg({ kind: 'error', text: errorMessage(e) });
    } finally {
      setBusy(null);
    }
  }

  const toProject = (idea: Idea) => {
    const title = window.prompt('Nome del nuovo progetto:', idea.text.split('\n')[0].slice(0, 60));
    if (!title?.trim()) return;
    const slug = slugify(title);
    withIdea(idea, async () => {
      await writeFile(`data/projects/${slug}.md`, projectFile(title.trim(), idea.text), `Nuovo progetto: ${title.trim()}`);
      await deleteFile(idea.path, idea.sha!, `Inbox → progetto ${slug}`);
      return `Creato il progetto "${title.trim()}" (stato: idea). Comparirà nel sito tra un paio di minuti, al termine del deploy.`;
    });
  };

  const remove = (idea: Idea) => {
    if (!window.confirm('Eliminare questa idea? (resta comunque nella cronologia git)')) return;
    withIdea(idea, async () => {
      await deleteFile(idea.path, idea.sha!, 'Inbox: idea eliminata');
      return 'Idea eliminata.';
    });
  };

  return (
    <div class="inbox">
      {token && (
        <section class="card" style={{ marginBottom: '18px' }}>
          <IdeaForm onSaved={added} />
        </section>
      )}
      {msg && <p class={`msg ${msg.kind}`}>{msg.text}</p>}
      {ideas.length === 0 ? (
        <p class="muted">Nessuna idea in attesa. 🎉</p>
      ) : (
        <ul class="ideas">
          {ideas.map((idea) => (
            <li class="card" key={idea.path}>
              <p class="idea-text">{idea.text}</p>
              <div class="row small">
                <span class="muted">{idea.date && fmt(idea.date)}</span>
                <span class="spacer" />
                {token && live && (
                  <>
                    <button type="button" disabled={busy === idea.path} onClick={() => toProject(idea)}>
                      → Progetto
                    </button>
                    <button type="button" class="danger" disabled={busy === idea.path} onClick={() => remove(idea)}>
                      Elimina
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
