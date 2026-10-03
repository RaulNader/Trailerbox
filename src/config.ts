import type { TabId, TitleType } from "./types";

export const API_URL = "https://www.omdbapi.com/";
export const API_KEY = import.meta.env.VITE_OMDB_KEY ?? "";

if (!API_KEY && import.meta.env.MODE !== "test")
  console.error("Missing VITE_OMDB_KEY. Copy .env.example to .env and add your OMDb key.");

export const MIN_QUERY_LENGTH = 3;
export const SEARCH_DEBOUNCE_MS = 400;
export const WATCHED_STORAGE_KEY = "watched";

export const TITLE_TYPES: Record<TitleType, { label: string; to: string }> = {
  movie: { label: "Movies", to: "/movies" },
  series: { label: "Series", to: "/series" },
};

export const TABS: { id: TabId; label: string; to: string }[] = [
  { id: "movie", ...TITLE_TYPES.movie },
  { id: "series", ...TITLE_TYPES.series },
  { id: "list", label: "My List", to: "/my-list" },
];

export const FEATURED_ID: Record<TitleType, string> = {
  movie: "tt0816692", // Interstellar
  series: "tt0903747", // Breaking Bad
};

// OMDb can't list titles by genre, so the catalogs come from Cinemeta,
// Stremio's official catalog addon (free, no key, CORS enabled)
export const CINEMETA_URL = "https://v3-cinemeta.strem.io";
export const CATALOG_PAGE_SIZE = 50;
export const ROW_LENGTH = 20;

// The genres Cinemeta's "Popular" catalog supports, from its manifest.json
const SHARED_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
];

export const GENRES: Record<TitleType, string[]> = {
  movie: SHARED_GENRES,
  series: [...SHARED_GENRES, "Reality-TV", "Talk-Show", "Game-Show"],
};

// /movies/popular for the unfiltered catalog, /movies/genre/Action for one genre
export function catalogPath(type: TitleType, genre?: string) {
  const base = TITLE_TYPES[type].to;
  return genre ? `${base}/genre/${encodeURIComponent(genre)}` : `${base}/popular`;
}
