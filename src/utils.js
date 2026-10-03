import { API_KEY, API_URL } from "./config";

export const average = (arr) =>
  arr.length ? arr.reduce((acc, cur) => acc + cur, 0) / arr.length : 0;

// Responses rarely change, so cache them for the session to save API quota
const cache = new Map();

export async function fetchOmdb(params, signal) {
  const search = new URLSearchParams({ apikey: API_KEY, ...params });
  const url = `${API_URL}?${search}`;
  if (cache.has(url)) return cache.get(url);

  const res = await fetch(url, { signal });

  if (!res.ok) throw new Error("Something went wrong while fetching movies");

  const data = await res.json();
  if (data.Response === "False") throw new Error(data.Error || "Movie not found");

  cache.set(url, data);
  return data;
}

// OMDb uses "N/A" for missing values
export const hasValue = (value) => value && value !== "N/A";

// Removes duplicate results (OMDb sometimes repeats titles across pages)
export const uniqueById = (items) => [
  ...new Map(items.map((item) => [item.imdbID, item])).values(),
];
