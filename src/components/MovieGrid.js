import { MovieCard } from "./MovieCard";
import { useWatched } from "../contexts/WatchedContext";

const gridClass =
  "grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

export function MovieGrid({ movies, onRemove }) {
  const { ratings } = useWatched();

  return (
    <ul className={gridClass}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard
            movie={movie}
            userRating={ratings[movie.id]}
            onRemove={onRemove}
          />
        </li>
      ))}
    </ul>
  );
}

export function GridSkeleton({ count = 10 }) {
  return (
    <ul className={gridClass} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="aspect-[2/3] animate-pulse rounded-md bg-surface-700"
        />
      ))}
    </ul>
  );
}
