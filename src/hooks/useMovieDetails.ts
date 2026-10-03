import { useEffect, useState } from "react";
import type { OmdbDetails } from "../types";
import { errorMessage, fetchOmdb, isAbortError } from "../utils";

export function useMovieDetails(id: string) {
  const [movie, setMovie] = useState<OmdbDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const data = await fetchOmdb<OmdbDetails>({ i: id }, controller.signal);
          setMovie(data);
        } catch (err) {
          if (!isAbortError(err)) setError(errorMessage(err));
        } finally {
          if (!controller.signal.aborted) setIsLoading(false);
        }
      }

      getMovieDetails();
      return () => controller.abort();
    },
    [id]
  );

  return { movie, isLoading, error };
}
