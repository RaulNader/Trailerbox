import { useEffect, useState } from "react";
import { MIN_QUERY_LENGTH } from "../config";
import type { OmdbSearchItem, OmdbSearchResponse, TitleType } from "../types";
import { errorMessage, fetchOmdb, isAbortError, uniqueById } from "../utils";

// Fetches one page of search results and appends it to the previous pages.
// Remount the caller (via `key`) to start a fresh search.
export function useMovies(query: string, type: TitleType, page = 1) {
  const [movies, setMovies] = useState<OmdbSearchItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const trimmed = query.trim();
  const isActive = trimmed.length >= MIN_QUERY_LENGTH;

  useEffect(
    function () {
      if (!isActive) return;

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const data = await fetchOmdb<OmdbSearchResponse>(
            { s: trimmed, type, page },
            controller.signal
          );
          setMovies((movies) =>
            page === 1 ? data.Search : uniqueById([...movies, ...data.Search])
          );
          setTotalResults(Number(data.totalResults) || data.Search.length);
        } catch (err) {
          if (isAbortError(err)) return;
          if (page === 1) setMovies([]);
          setError(errorMessage(err));
        } finally {
          if (!controller.signal.aborted) setIsLoading(false);
        }
      }

      fetchMovies();
      return () => controller.abort();
    },
    [trimmed, isActive, type, page]
  );

  // Too short to search: report nothing instead of the last results
  if (!isActive) return { movies: [], totalResults: 0, isLoading: false, error: "" };
  return { movies, totalResults, isLoading, error };
}
