import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const CACHE_KEY = 'chmc_actualites_cache_v2';
const CACHE_TTL_MS = 30 * 60 * 1000;

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, items } = JSON.parse(raw);
    if (!Array.isArray(items) || Date.now() - at > CACHE_TTL_MS) return null;
    return items;
  } catch {
    return null;
  }
}

function writeCache(items) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items }));
  } catch {
    /* quota */
  }
}

async function fetchActualites() {
  const { data } = await api.get('/actualites.php', { timeout: 12000 });
  const items = data?.actualites || [];
  if (items.length) writeCache(items);
  return items;
}

/** Charge les actualités : affiche le cache tout de suite, puis met à jour en arrière-plan. */
export function useActualites() {
  const [actus, setActus] = useState(() => readCache() || []);
  const [loading, setLoading] = useState(() => !readCache());
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const items = await fetchActualites();
        if (!cancelled) {
          setActus(items);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(!readCache());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { actus, loading, error, hasCache: actus.length > 0 };
}
