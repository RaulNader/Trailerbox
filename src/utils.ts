import { API_KEY, API_URL, CINEMETA_URL } from "./config";
import type { CinemetaMeta, TitleType } from "./types";

export const average = (arr: number[]) =>
  arr.length ? arr.reduce((acc, cur) => acc + cur, 0) / arr.length : 0;

// Responses rarely change, so cache them for the session to save API quota
const cache = new Map<string, unknown>();

export async function fetchOmdb<T>(
  params: Record<string, string | number>,
  signal?: AbortSignal
): Promise<T> {
  const search = new URLSearchParams({ apikey: API_KEY });
  for (const [key, value] of Object.entries(params)) search.set(key, String(value));
  const url = `${API_URL}?${search}`;
  if (cache.has(url)) return cache.get(url) as T;

  const res = await fetch(url, { signal });

  if (!res.ok) throw new Error("Something went wrong while fetching movies");

  const data = await res.json();
  if (data.Response === "False") throw new Error(data.Error || "Movie not found");

  cache.set(url, data);
  return data as T;
}

// One page of Cinemeta's "Popular" catalog, optionally filtered by genre.
// Stremio addons take extras as a path segment: /catalog/movie/top/genre=Action&skip=50.json
export async function fetchCatalog(
  { type, genre, skip = 0 }: { type: TitleType; genre?: string; skip?: number },
  signal?: AbortSignal
): Promise<CinemetaMeta[]> {
  const extras = new URLSearchParams();
  if (genre) extras.set("genre", genre);
  if (skip) extras.set("skip", String(skip));
  const extra = extras.toString();
  const url = `${CINEMETA_URL}/catalog/${type}/top${extra ? `/${extra}` : ""}.json`;
  if (cache.has(url)) return cache.get(url) as CinemetaMeta[];

  const res = await fetch(url, { signal });

  if (!res.ok) throw new Error("Something went wrong while loading the catalog");

  const data: { metas?: CinemetaMeta[] } = await res.json();
  const metas = data.metas ?? [];

  cache.set(url, metas);
  return metas;
}

export const isAbortError = (err: unknown) =>
  err instanceof Error && err.name === "AbortError";

export const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : String(err);

// OMDb uses "N/A" for missing values
export const hasValue = (value: string | undefined): value is string =>
  !!value && value !== "N/A";

// Removes duplicate results (OMDb sometimes repeats titles across pages)
export const uniqueById = <T extends { imdbID: string }>(items: T[]) => [
  ...new Map(items.map((item) => [item.imdbID, item])).values(),
];
