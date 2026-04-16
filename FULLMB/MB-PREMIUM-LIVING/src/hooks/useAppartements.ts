import { useState, useEffect } from 'react';
import { Appartement, fetchAppartements } from '../services/appartements';

export function useAppartements() {
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAppartements();
        if (isMounted) {
          setAppartements(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { appartements, loading, error };
}
