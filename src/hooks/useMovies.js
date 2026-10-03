import { useEffect, useState } from "react";
import { MIN_QUERY_LENGTH } from "../config";
import { fetchOmdb, uniqueById } from "../utils";

// Fetches one page of search results and appends it to the previous pages.
// Remount the caller (via `key`) to start a fresh search.
export function useMovies(query, type, page = 1) {
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const trimmed = query.trim();
      if (trimmed.length < MIN_QUERY_LENGTH) {
        setMovies([]);
        setTotalResults(0);
        setError("");
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const data = await fetchOmdb(
            { s: trimmed, type, page },
            controller.signal
          );
          setMovies((movies) =>
            page === 1 ? data.Search : uniqueById([...movies, ...data.Search])
          );
          setTotalResults(Number(data.totalResults) || data.Search.length);
        } catch (err) {
          if (err.name === "AbortError") return;
          if (page === 1) setMovies([]);
          setError(err.message);
        } finally {
          if (!controller.signal.aborted) setIsLoading(false);
        }
      }

      fetchMovies();
      return () => controller.abort();
    },
    [query, type, page]
  );

  return { movies, totalResults, isLoading, error };
}
