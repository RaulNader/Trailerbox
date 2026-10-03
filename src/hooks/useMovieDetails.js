import { useEffect, useState } from "react";
import { fetchOmdb } from "../utils";

export function useMovieDetails(id) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const data = await fetchOmdb({ i: id }, controller.signal);
          setMovie(data);
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
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
