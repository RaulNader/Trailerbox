import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { WATCHED_STORAGE_KEY } from "../config";

const WatchedContext = createContext(null);

export function WatchedProvider({ children }) {
  const [watched, setWatched] = useLocalStorageState([], WATCHED_STORAGE_KEY);

  // imdbID -> user rating, so every card can show its badge
  const ratings = useMemo(
    () => Object.fromEntries(watched.map((m) => [m.imdbID, m.userRating])),
    [watched]
  );

  const addWatched = useCallback(
    (movie) =>
      setWatched((watched) => [
        ...watched.filter((m) => m.imdbID !== movie.imdbID),
        movie,
      ]),
    [setWatched]
  );

  const removeWatched = useCallback(
    (id) => setWatched((watched) => watched.filter((m) => m.imdbID !== id)),
    [setWatched]
  );

  const value = useMemo(
    () => ({ watched, ratings, addWatched, removeWatched }),
    [watched, ratings, addWatched, removeWatched]
  );

  return <WatchedContext value={value}>{children}</WatchedContext>;
}

export function useWatched() {
  const context = useContext(WatchedContext);
  if (!context) throw new Error("useWatched must be used inside <WatchedProvider>");
  return context;
}
