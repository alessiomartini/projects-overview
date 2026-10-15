// Frontmatter minimale per i file scritti dal sito (inbox e note):
// solo coppie `chiave: valore` piatte, stringhe in formato JSON (valido anche come YAML).

export type FlatValue = string | boolean | number;

export function stringifyFrontmatter(data: Record<string, FlatValue | undefined>, body: string): string {
  const lines = Object.entries(data)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? JSON.stringify(v) : String(v)}`);
  return `---\n${lines.join('\n')}\n---\n${body.trim()}\n`;
}

export function parseFrontmatter(text: string): { data: Record<string, FlatValue>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) return { data: {}, body: text.trim() };
  const data: Record<string, FlatValue> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([\w-]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const raw = kv[2].trim();
    let value: FlatValue = raw;
    if (raw === 'true' || raw === 'false') value = raw === 'true';
    else if (/^-?\d+(\.\d+)?$/.test(raw)) value = Number(raw);
    else if (raw.startsWith('"')) {
      try {
        value = JSON.parse(raw);
      } catch {
        value = raw.slice(1, -1);
      }
    } else if (raw.startsWith("'") && raw.endsWith("'")) value = raw.slice(1, -1).replace(/''/g, "'");
    data[kv[1]] = value;
  }
  return { data, body: match[2].trim() };
}

/** Nome file ordinabile e sicuro basato sull'ora corrente. */
export function timestampName(date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-');
}
