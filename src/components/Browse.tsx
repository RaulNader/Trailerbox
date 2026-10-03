import { useState, type ReactNode } from "react";
import { useMovies } from "../hooks/useMovies";
import type { TitleType } from "../types";
import { fromSearch } from "../mappers";
import { GridSkeleton, MovieGrid } from "./MovieGrid";
import { ErrorMessage } from "./Status";

function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h1 className="text-xl font-bold sm:text-2xl">{children}</h1>
      {aside && <span className="text-sm text-neutral-400">{aside}</span>}
    </div>
  );
}

// Remount with a new `key` for every query/type so paging starts over
interface SearchResultsProps {
  query: string;
  type: TitleType;
  typeLabel: string;
}

export function SearchResults({ query, type, typeLabel }: SearchResultsProps) {
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
