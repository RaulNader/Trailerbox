import { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import { fromSearch } from "./MovieCard";
import { GridSkeleton, MovieGrid } from "./MovieGrid";
import { ErrorMessage } from "./Status";

function SectionTitle({ children, aside }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="text-xl font-bold sm:text-2xl">{children}</h2>
      {aside && <span className="text-sm text-neutral-400">{aside}</span>}
    </div>
  );
}

// One curated section of the home page, e.g. "The Dark Knight Saga"
export function BrowseSection({ title, query, type }) {
  const { movies, isLoading, error } = useMovies(query, type);

  if (error) return null;

  return (
    <section>
      <SectionTitle>{title}</SectionTitle>
      {isLoading ? (
        <GridSkeleton />
      ) : (
        <MovieGrid movies={movies.map(fromSearch)} />
      )}
    </section>
  );
}

// Remount with a new `key` for every query/type so paging starts over
export function SearchResults({ query, type, typeLabel }) {
  const [page, setPage] = useState(1);
  const { movies, totalResults, isLoading, error } = useMovies(query, type, page);

  const hasMore = movies.length < totalResults;

  return (
    <section>
      <SectionTitle aside={totalResults > 0 && `${totalResults} titles`}>
        {typeLabel} matching “{query.trim()}”
      </SectionTitle>

      {error && page === 1 ? (
        <ErrorMessage message={error} />
      ) : (
        <MovieGrid movies={movies.map(fromSearch)} />
      )}

      {isLoading && page === 1 && <GridSkeleton />}

      {page > 1 && error && (
        <p className="mt-6 text-center text-sm text-brand">{error}</p>
      )}

      {hasMore && movies.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            className="btn-ghost min-w-40"
            disabled={isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            {isLoading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
