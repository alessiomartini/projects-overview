import { useRef } from 'preact/hooks';
import IdeaForm from './IdeaForm';
import { useToken } from './useToken';

/** Pulsante flottante "+ Idea" disponibile su tutte le pagine in modalità modifica. */
export default function QuickIdea() {
  const token = useToken();
  const dialog = useRef<HTMLDialogElement>(null);
  if (!token) return null;

  return (
    <>
      <button class="primary fab" type="button" onClick={() => dialog.current?.showModal()}>
        + Idea
      </button>
      <dialog ref={dialog} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div class="row" style={{ marginBottom: '10px' }}>
          <h2 style={{ margin: 0 }}>Nuova idea</h2>
          <span class="spacer" />
          <button class="link" type="button" onClick={() => dialog.current?.close()} aria-label="Chiudi">
            ✕
          </button>
        </div>
        <IdeaForm autoFocus />
        <p class="muted small" style={{ marginBottom: 0 }}>
          Finisce nella <a href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/inbox/`}>Inbox</a>.
        </p>
      </dialog>
    </>
  );
}
