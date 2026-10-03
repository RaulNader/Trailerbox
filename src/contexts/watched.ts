import { createContext, useContext } from "react";
import type { WatchedMovie } from "../types";

export interface WatchedContextValue {
  watched: WatchedMovie[];
  ratings: Record<string, number>;
  addWatched: (movie: WatchedMovie) => void;
  removeWatched: (id: string) => void;
}

export const WatchedContext = createContext<WatchedContextValue | null>(null);

export function useWatched() {
  const context = useContext(WatchedContext);
  if (!context) throw new Error("useWatched must be used inside <WatchedProvider>");
  return context;
}
