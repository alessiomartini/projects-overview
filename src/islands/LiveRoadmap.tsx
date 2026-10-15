import { useEffect, useState } from 'preact/hooks';
import { errorMessage, readFile } from '../lib/github';
import { parseRoadmap, type Roadmap } from '../lib/roadmap';
import { useToken } from './useToken';

interface Props {
  repo: string;
}

/**
 * Per i repo privati il sito pubblico non mostra i dettagli della roadmap.
 * In modalità modifica, se il token può leggere il repo, li carica dal vivo.
 */
export default function LiveRoadmap({ repo }: Props) {
  const token = useToken();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    readFile('ROADMAP.md', repo)
      .then((f) => setRoadmap(parseRoadmap(f.content)))
      .catch((e) => setError(errorMessage(e)));
  }, [token]);

  if (!token) return <p class="muted small">Repo privato: i dettagli della roadmap sono visibili solo in modalità modifica.</p>;
  if (error) return <p class="muted small">Repo privato: per vedere i dettagli dai al token anche l'accesso in lettura a {repo}. ({error})</p>;
  if (!roadmap) return <p class="muted small">Carico la roadmap privata…</p>;

  return (
    <div class="live-roadmap">
      {roadmap.phases.map((phase) => (
        <section key={phase.title}>
          <h3>
            {phase.title || 'Da fare'}{' '}
            <span class="muted small">
              {phase.done}/{phase.total}
            </span>
          </h3>
          <ul>
            {phase.items.map((item, i) => (
              <li key={i} style={{ marginLeft: `${item.depth * 1.2}em`, color: item.done ? 'var(--muted)' : undefined }}>
                {item.done ? '☑' : '☐'} {item.text}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {roadmap.log.length > 0 && (
        <>
          <h3>Diario</h3>
          <ul>
            {roadmap.log.slice(0, 15).map((entry) => (
              <li key={entry.date + entry.text}>
                <strong>{entry.date}</strong> — {entry.text}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
