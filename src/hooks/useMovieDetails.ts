import { useEffect, useState } from "react";
import type { OmdbDetails } from "../types";
import { decodeEntities, errorMessage, fetchOmdb, isAbortError } from "../utils";

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
          const decoded = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key,
              typeof value === "string" ? decodeEntities(value) : value,
            ])
          );
          setMovie(decoded as OmdbDetails);
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
