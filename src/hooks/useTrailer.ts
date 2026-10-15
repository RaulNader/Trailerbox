import { useEffect, useState } from "react";
import { CINEMETA_URL } from "../config";
import { isAbortError } from "../utils";

// Cinemeta's meta endpoint lists YouTube trailers: /meta/movie/tt0816692.json
interface CinemetaTrailerMeta {
  meta?: { trailers?: { source: string; type: string }[] };
}

// Returns the YouTube id of the title's first trailer, or null if it has none.
// A trailer is optional, so failures are silent and the modal shows without one.
export function useTrailer(id: string, type?: string) {
  const [result, setResult] = useState<{ id: string; youtubeId: string | null }>();

  useEffect(
    function () {
      // Cinemeta only knows movies and series (not episodes)
      if (type !== "movie" && type !== "series") return;

      const controller = new AbortController();

      async function load() {
        try {
          const res = await fetch(`${CINEMETA_URL}/meta/${type}/${id}.json`, {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error(`Trailer request failed: ${res.status}`);
          const data: CinemetaTrailerMeta = await res.json();
          const trailer = data.meta?.trailers?.find((t) => t.type === "Trailer");
          setResult({ id, youtubeId: trailer?.source ?? null });
        } catch (err) {
          if (!isAbortError(err)) setResult({ id, youtubeId: null });
        }
      }

      load();
      return () => controller.abort();
    },
    [id, type]
  );

  // Ignore a result left over from a previous title
  return result?.id === id ? result.youtubeId : null;
}
