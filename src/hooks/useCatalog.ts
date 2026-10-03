import { useEffect, useState } from "react";
import { CATALOG_PAGE_SIZE } from "../config";
import type { CinemetaMeta, TitleType } from "../types";
import { errorMessage, fetchCatalog, isAbortError, uniqueById } from "../utils";

type CatalogItem = CinemetaMeta & { imdbID: string };

// Fetches one page of a Cinemeta catalog and appends it to the previous pages.
// Remount the caller (via `key`) to start over. Nothing loads until `enabled`.
export function useCatalog(type: TitleType, genre?: string, page = 1, enabled = true) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  // Starts true so a not-yet-enabled row renders its skeleton (and stays observable)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(
    function () {
      if (!enabled) return;

      const controller = new AbortController();

      async function load() {
        try {
          setIsLoading(true);
          setError("");
          const metas = await fetchCatalog(
            { type, genre, skip: (page - 1) * CATALOG_PAGE_SIZE },
            controller.signal
          );
          // Cinemeta metas carry imdb_id; uniqueById keys on imdbID
          const withIds = metas.map((m) => ({ ...m, imdbID: m.imdb_id ?? m.id }));
          setItems((items) =>
            page === 1 ? uniqueById(withIds) : uniqueById([...items, ...withIds])
          );
          setHasMore(metas.length > 0);
        } catch (err) {
          if (isAbortError(err)) return;
          setError(errorMessage(err));
        } finally {
          if (!controller.signal.aborted) setIsLoading(false);
        }
      }

      load();
      return () => controller.abort();
    },
    [type, genre, page, enabled]
  );

  return { items, hasMore, isLoading, error };
}
