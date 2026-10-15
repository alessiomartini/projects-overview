const DAY = 24 * 60 * 60 * 1000;

export function formatDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function relativeDate(value: string | Date, now = new Date()): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  const days = Math.floor((now.getTime() - d.getTime()) / DAY);
  if (days <= 0) return 'oggi';
  if (days === 1) return 'ieri';
  if (days < 30) return `${days} giorni fa`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? '1 mese fa' : `${months} mesi fa`;
  const years = Math.floor(days / 365);
  return years <= 1 ? '1 anno fa' : `${years} anni fa`;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Markdown inline minimale (codice, grassetto, corsivo, link) per i testi dei todo e del diario. */
export function inlineMarkdown(text: string): string {
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((part) => {
      if (/^`[^`]+`$/.test(part)) return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      return escapeHtml(part)
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[^*\w])\*([^*\s][^*]*)\*(?!\w)/g, '$1<em>$2</em>');
    })
    .join('');
}
