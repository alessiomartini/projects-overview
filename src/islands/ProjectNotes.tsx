import { useEffect, useState } from 'preact/hooks';
import { deleteFile, errorMessage, readDir, writeFile } from '../lib/github';
import { parseFrontmatter, stringifyFrontmatter, timestampName } from '../lib/frontmatter';
import { useToken } from './useToken';

type NoteType = 'nota' | 'modifica' | 'idea';

interface Note {
  path: string;
  sha?: string;
  date: string;
  type: NoteType;
  resolved: boolean;
  text: string;
}

interface Props {
  slug: string;
  initial: Note[];
}

const TYPE_LABEL: Record<NoteType, string> = { nota: 'Nota', modifica: 'Da cambiare', idea: 'Idea' };

const fmt = (iso: string) => new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

const serialize = (slug: string, n: Note) =>
  stringifyFrontmatter({ project: slug, date: n.date, type: n.type, resolved: n.resolved }, n.text);

export default function ProjectNotes({ slug, initial }: Props) {
  const token = useToken();
  const [notes, setNotes] = useState<Note[]>(initial);
  const [live, setLive] = useState(false);
  const [text, setText] = useState('');
  const [type, setType] = useState<NoteType>('nota');
  const [showResolved, setShowResolved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const dir = `data/notes/${slug}`;

  useEffect(() => {
    if (!token) return;
    readDir(dir)
      .then((files) => {
        setNotes(
          files
            .map((f) => {
              const { data, body } = parseFrontmatter(f.content);
              return {
                path: f.path,
                sha: f.sha,
                date: String(data.date ?? ''),
                type: (data.type as NoteType) ?? 'nota',
                resolved: data.resolved === true,
                text: body,
              };
            })
            .sort((a, b) => b.date.localeCompare(a.date)),
        );
        setLive(true);
      })
      .catch((e) => setMsg({ kind: 'error', text: errorMessage(e) }));
  }, [token]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setMsg(null);
    try {
      await action();
    } catch (e) {
      setMsg({ kind: 'error', text: errorMessage(e) });
    } finally {
      setBusy(false);
    }
  }

  const add = (e: Event) => {
    e.preventDefault();
    if (!text.trim()) return;
    run(async () => {
      const now = new Date();
      const note: Note = { path: `${dir}/${timestampName(now)}.md`, date: now.toISOString(), type, resolved: false, text: text.trim() };
      note.sha = await writeFile(note.path, serialize(slug, note), `Nota su ${slug}: ${note.text.split('\n')[0].slice(0, 50)}`);
      setNotes((list) => [note, ...list]);
      setText('');
    });
  };

  const toggle = (note: Note) =>
    run(async () => {
      const updated = { ...note, resolved: !note.resolved };
      updated.sha = await writeFile(note.path, serialize(slug, updated), `Nota su ${slug}: ${updated.resolved ? 'risolta' : 'riaperta'}`, note.sha);
      setNotes((list) => list.map((n) => (n.path === note.path ? updated : n)));
    });

  const remove = (note: Note) => {
    if (!note.sha || !window.confirm('Eliminare questa nota?')) return;
    run(async () => {
      await deleteFile(note.path, note.sha!, `Nota su ${slug} eliminata`);
      setNotes((list) => list.filter((n) => n.path !== note.path));
    });
  };

  const open = notes.filter((n) => !n.resolved);
  const resolved = notes.filter((n) => n.resolved);
  const visible = showResolved ? notes : open;
  const canEdit = !!token && live;

  return (
    <div class="notes">
      {token && (
        <form onSubmit={add} style={{ marginBottom: '14px' }}>
          <textarea
            value={text}
            rows={3}
            placeholder="Aggiungi una nota, un'idea o qualcosa da cambiare…"
            aria-label="Testo della nota"
            onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          />
          <div class="row" style={{ marginTop: '8px' }}>
            <select value={type} onChange={(e) => setType((e.target as HTMLSelectElement).value as NoteType)} style={{ width: 'auto' }} aria-label="Tipo">
              {Object.entries(TYPE_LABEL).map(([k, v]) => (
                <option value={k} key={k}>
                  {v}
                </option>
              ))}
            </select>
            <button class="primary" type="submit" disabled={busy || !text.trim() || !live}>
              Aggiungi
            </button>
          </div>
        </form>
      )}
      {msg && <p class={`msg ${msg.kind}`}>{msg.text}</p>}
      {visible.length === 0 && <p class="muted small">{open.length === 0 && notes.length > 0 ? 'Tutte le note sono risolte.' : 'Nessuna nota.'}</p>}
      <ul class="note-list">
        {visible.map((n) => (
          <li key={n.path} class={n.resolved ? 'resolved' : ''}>
            <div class="row small">
              <span class={`badge note-${n.type}`}>{TYPE_LABEL[n.type]}</span>
              <span class="muted">{n.date && fmt(n.date)}</span>
              <span class="spacer" />
              {canEdit && (
                <>
                  <button type="button" class="link" disabled={busy} onClick={() => toggle(n)}>
                    {n.resolved ? 'Riapri' : '✓ Risolta'}
                  </button>
                  <button type="button" class="link" disabled={busy} onClick={() => remove(n)} aria-label="Elimina nota">
                    ✕
                  </button>
                </>
              )}
            </div>
            <p>{n.text}</p>
          </li>
        ))}
      </ul>
      {resolved.length > 0 && (
        <button type="button" class="link small" onClick={() => setShowResolved(!showResolved)}>
          {showResolved ? 'Nascondi risolte' : `Mostra risolte (${resolved.length})`}
        </button>
      )}
    </div>
  );
}
