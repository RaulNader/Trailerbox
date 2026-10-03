import type { CardMovie, CinemetaMeta, OmdbSearchItem, WatchedMovie } from "./types";

// Each source names its fields differently; cards only render CardMovie

// Search results use OMDb's capitalised keys
export const fromSearch = (m: OmdbSearchItem): CardMovie => ({
  id: m.imdbID,
  title: m.Title,
  year: m.Year,
  poster: m.Poster,
  type: m.Type,
});

// Cinemeta catalog entries use Stremio's meta keys
export const fromCatalog = (m: CinemetaMeta): CardMovie => ({
  id: m.imdb_id ?? m.id,
  title: m.name,
  year: m.releaseInfo ?? m.year,
  poster: m.poster,
  type: m.type,
});

// Saved list entries use our own lowercase keys
export const fromWatched = (m: WatchedMovie): CardMovie => ({
  id: m.imdbID,
  title: m.title,
  year: m.year,
  poster: m.poster,
  type: m.type,
});
