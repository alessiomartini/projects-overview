import { useState } from 'preact/hooks';
import { errorMessage, readFile, writeFile } from '../lib/github';
import { useToken } from './useToken';

interface Props {
  slug: string;
  status: string;
  statusLabels: Record<string, string>;
}

/** Cambia lo stato di un progetto riscrivendo la riga `status:` del suo file. */
export default function StatusEditor({ slug, status, statusLabels }: Props) {
  const token = useToken();
  const [value, setValue] = useState(status);
  const [saved, setSaved] = useState(status);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  if (!token) return null;

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const path = `data/projects/${slug}.md`;
      const file = await readFile(path);
      const today = new Date().toISOString().slice(0, 10);
      let content = file.content.replace(/^status:.*$/m, `status: ${value}`);
      // Segna le date di inizio/fine se mancano.
      const fmEnd = content.indexOf('\n---', 3);
      const fm = content.slice(0, fmEnd);
      if (value === 'in-corso' && !/^started:/m.test(fm)) content = content.slice(0, fmEnd) + `\nstarted: ${today}` + content.slice(fmEnd);
      if (value === 'finito' && !/^finished:/m.test(fm)) content = content.slice(0, fmEnd) + `\nfinished: ${today}` + content.slice(fmEnd);
      await writeFile(path, content, `${slug}: stato → ${value}`, file.sha);
      setSaved(value);
      setMsg({ kind: 'ok', text: 'Salvato ✓ Visibile nel sito dopo il deploy (~2 min).' });
    } catch (e) {
      setMsg({ kind: 'error', text: errorMessage(e) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div class="status-editor">
      <div class="row">
        <select value={value} onChange={(e) => setValue((e.target as HTMLSelectElement).value)} style={{ width: 'auto' }} aria-label="Stato del progetto">
          {Object.entries(statusLabels).map(([k, v]) => (
            <option value={k} key={k}>
              {v}
            </option>
          ))}
        </select>
        <button type="button" class="primary" onClick={save} disabled={busy || value === saved}>
          {busy ? 'Salvo…' : 'Cambia stato'}
        </button>
      </div>
      {msg && <p class={`msg ${msg.kind}`}>{msg.text}</p>}
    </div>
  );
}
