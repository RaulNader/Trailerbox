import { movies } from "~/data/movies";
import type { Movie } from "~/types/movie";

// Swap these for real API calls (e.g. TMDB) later — routes won't need to change.
export async function getMovies(query = ""): Promise<Movie[]> {
  const q = query.trim().toLowerCase();
  const list = q
    ? movies.filter((m) => m.title.toLowerCase().includes(q))
    : movies;
  return [...list].sort((a, b) => b.rating - a.rating);
}

export async function getMovie(id: string): Promise<Movie | undefined> {
  return movies.find((m) => m.id === id);
}
