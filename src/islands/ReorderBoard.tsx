import { useEffect, useRef, useState } from 'preact/hooks';
import Sortable from 'sortablejs';
import { errorMessage, GitHubError, readFile, writeFile } from '../lib/github';
import { useToken } from './useToken';

interface Item {
  slug: string;
  title: string;
  status: string;
}

interface Props {
  /** progetti attivi (non finiti/abbandonati) nell'ordine attuale */
  items: Item[];
  statusLabels: Record<string, string>;
}

/** Riordino delle priorità con drag & drop; salva data/order.json. */
export default function ReorderBoard({ items, statusLabels }: Props) {
  const token = useToken();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(items);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const ul = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open || !ul.current) return;
    const sortable = Sortable.create(ul.current, {
      animation: 150,
      handle: '.handle',
      onEnd: (evt) => {
        // Ripristina il DOM e lascia che sia Preact ad aggiornare l'ordine.
        const { oldIndex, newIndex, item, from } = evt;
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
        from.removeChild(item);
        from.insertBefore(item, from.children[oldIndex] ?? null);
        setList((l) => {
          const next = [...l];
          const [moved] = next.splice(oldIndex, 1);
          next.splice(newIndex, 0, moved);
          return next;
        });
      },
    });
    return () => sortable.destroy();
  }, [open]);

  if (!token) return null;

  const move = (i: number, delta: number) =>
    setList((l) => {
      const j = i + delta;
      if (j < 0 || j >= l.length) return l;
      const next = [...l];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      let sha: string | undefined;
      let previous: string[] = [];
      try {
        const file = await readFile('data/order.json');
        sha = file.sha;
        previous = JSON.parse(file.content);
      } catch (e) {
        if (!(e instanceof GitHubError && e.status === 404)) throw e;
      }
      const slugs = list.map((i) => i.slug);
      // Mantiene in coda gli slug non mostrati qui (es. progetti finiti).
      const order = [...slugs, ...previous.filter((s) => !slugs.includes(s))];
      await writeFile('data/order.json', JSON.stringify(order, null, 2) + '\n', 'Aggiorna priorità dei progetti', sha);
      setMsg({ kind: 'ok', text: 'Priorità salvate ✓ Il sito si aggiorna tra un paio di minuti.' });
    } catch (e) {
      setMsg({ kind: 'error', text: errorMessage(e) });
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}>
        ↕ Riordina priorità
      </button>
    );
  }

  return (
    <div class="card reorder">
      <div class="row" style={{ marginBottom: '8px' }}>
        <h2 style={{ margin: 0 }}>Priorità</h2>
        <span class="spacer" />
        <button type="button" class="link" onClick={() => setOpen(false)} aria-label="Chiudi">
          ✕
        </button>
      </div>
      <p class="muted small" style={{ marginTop: 0 }}>
        Trascina (o usa le frecce) per decidere su cosa lavorare prima. In alto = più importante.
      </p>
      <ul ref={ul} class="reorder-list">
        {list.map((item, i) => (
          <li key={item.slug}>
            <span class="handle" title="Trascina" aria-hidden="true">
              ⠿
            </span>
            <span class="pos">{i + 1}</span>
            <span class="title">{item.title}</span>
            <span class="status" data-status={item.status}>
              {statusLabels[item.status]}
            </span>
            <button type="button" class="link" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Sposta su ${item.title}`}>
              ↑
            </button>
            <button type="button" class="link" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label={`Sposta giù ${item.title}`}>
              ↓
            </button>
          </li>
        ))}
      </ul>
      <div class="row" style={{ marginTop: '10px' }}>
        <button type="button" class="primary" onClick={save} disabled={busy}>
          {busy ? 'Salvo…' : 'Salva ordine'}
        </button>
        <button type="button" onClick={() => setList(items)} disabled={busy}>
          Annulla modifiche
        </button>
      </div>
      {msg && <p class={`msg ${msg.kind}`}>{msg.text}</p>}
    </div>
  );
}
