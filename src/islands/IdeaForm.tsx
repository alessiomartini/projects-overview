import { useState } from 'preact/hooks';
import { errorMessage, writeFile } from '../lib/github';
import { stringifyFrontmatter, timestampName } from '../lib/frontmatter';

export interface SavedIdea {
  path: string;
  sha: string;
  date: string;
  text: string;
}

interface Props {
  autoFocus?: boolean;
  onSaved?: (idea: SavedIdea) => void;
}

export default function IdeaForm({ autoFocus, onSaved }: Props) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function save(e: Event) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setSaving(true);
    setMsg(null);
    try {
      const now = new Date();
      const path = `data/inbox/${timestampName(now)}.md`;
      const date = now.toISOString();
      const firstLine = value.split('\n')[0].slice(0, 60);
      const sha = await writeFile(path, stringifyFrontmatter({ date }, value), `Inbox: ${firstLine}`);
      setText('');
      setMsg({ kind: 'ok', text: 'Idea salvata ✓' });
      onSaved?.({ path, sha, date, text: value });
      window.dispatchEvent(new CustomEvent('po-idea-added', { detail: { path, sha, date, text: value } }));
    } catch (err) {
      setMsg({ kind: 'error', text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save}>
      <textarea
        value={text}
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save(e);
        }}
        placeholder="Un'idea nuova, qualcosa da cambiare, un progetto da iniziare…"
        aria-label="Testo dell'idea"
        autoFocus={autoFocus}
        rows={4}
      />
      <div class="row" style={{ marginTop: '8px' }}>
        <button class="primary" type="submit" disabled={saving || !text.trim()}>
          {saving ? 'Salvo…' : 'Salva idea'}
        </button>
        {msg && <span class={`msg ${msg.kind}`} style={{ margin: 0 }}>{msg.text}</span>}
      </div>
    </form>
  );
}
