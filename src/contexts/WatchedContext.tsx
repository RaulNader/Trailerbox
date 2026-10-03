import { useCallback, useMemo, type ReactNode } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { WATCHED_STORAGE_KEY } from "../config";
import type { WatchedMovie } from "../types";
import { WatchedContext } from "./watched";


export function WatchedProvider({ children }: { children: ReactNode }) {
  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>([], WATCHED_STORAGE_KEY);

  // imdbID -> user rating, so every card can show its badge
  const ratings = useMemo(
    () => Object.fromEntries(watched.map((m) => [m.imdbID, m.userRating])),
    [watched]
  );

  const addWatched = useCallback(
    (movie: WatchedMovie) =>
      setWatched((watched) => [
        ...watched.filter((m) => m.imdbID !== movie.imdbID),
        movie,
      ]),
    [setWatched]
  );

  const removeWatched = useCallback(
    (id: string) => setWatched((watched) => watched.filter((m) => m.imdbID !== id)),
    [setWatched]
  );

  const value = useMemo(
    () => ({ watched, ratings, addWatched, removeWatched }),
    [watched, ratings, addWatched, removeWatched]
  );

  return <WatchedContext value={value}>{children}</WatchedContext>;
}
