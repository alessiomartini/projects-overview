import { useState } from 'preact/hooks';
import { checkToken, setToken } from '../lib/github';
import { useToken } from './useToken';

export default function TokenSettings() {
  const token = useToken();
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function save(e: Event) {
    e.preventDefault();
    const t = value.trim();
    if (!t) return;
    setBusy(true);
    setMsg(null);
    const result = await checkToken(t);
    setBusy(false);
    if (result.ok) {
      setToken(t);
      setValue('');
    }
    setMsg({ kind: result.ok ? 'ok' : 'error', text: result.message });
  }

  async function verify() {
    if (!token) return;
    setBusy(true);
    const result = await checkToken(token);
    setBusy(false);
    setMsg({ kind: result.ok ? 'ok' : 'error', text: result.message });
  }

  if (token) {
    return (
      <div>
        <p>
          ✅ <strong>Modalità modifica attiva</strong> su questo dispositivo (token …{token.slice(-4)}).
        </p>
        <div class="row">
          <button type="button" onClick={verify} disabled={busy}>
            Verifica token
          </button>
          <button
            type="button"
            class="danger"
            onClick={() => {
              setToken(null);
              setMsg({ kind: 'ok', text: 'Token rimosso da questo dispositivo.' });
            }}
          >
            Esci (rimuovi token)
          </button>
        </div>
        {msg && <p class={`msg ${msg.kind}`}>{msg.text}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={save}>
      <label for="token" class="small muted">
        Token GitHub (fine-grained)
      </label>
      <div class="row" style={{ marginTop: '4px' }}>
        <input
          id="token"
          type="password"
          autoComplete="off"
          placeholder="github_pat_…"
          value={value}
          onInput={(e) => setValue((e.target as HTMLInputElement).value)}
          style={{ flex: 1, minWidth: '220px' }}
        />
        <button class="primary" type="submit" disabled={busy || !value.trim()}>
          {busy ? 'Verifico…' : 'Attiva modifica'}
        </button>
      </div>
      {msg && <p class={`msg ${msg.kind}`}>{msg.text}</p>}
    </form>
  );
}
