import { useEffect, useState } from 'preact/hooks';
import { getToken } from '../lib/github';

/** Token GitHub salvato sul dispositivo; null finché non è letto (o se assente). */
export function useToken(): string | null {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setToken(getToken());
    update();
    window.addEventListener('po-token-change', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('po-token-change', update);
      window.removeEventListener('storage', update);
    };
  }, []);
  return token;
}
