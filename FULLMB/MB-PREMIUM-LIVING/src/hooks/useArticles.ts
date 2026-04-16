import { useState, useEffect } from 'react';
import { ArticleBlog, fetchArticles } from '../services/articlesBlog';

export function useArticles() {
  const [articles, setArticles] = useState<ArticleBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchArticles();
        if (isMounted) {
          setArticles(data);
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

  return { articles, setArticles, loading, error };
}
