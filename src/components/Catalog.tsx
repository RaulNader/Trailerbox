import { useState } from "react";
import { Link, NavLink } from "react-router";
import { GENRES, ROW_LENGTH, TITLE_TYPES, catalogPath } from "../config";
import { useCatalog } from "../hooks/useCatalog";
import { useInView } from "../hooks/useInView";
import { useWatched } from "../contexts/watched";
import type { TitleType } from "../types";
import { MovieCard } from "./MovieCard";
import { fromCatalog } from "../mappers";
import { GridSkeleton, MovieGrid } from "./MovieGrid";
import { ErrorMessage } from "./Status";

// Negative margins + padding leave room for the card hover zoom,
// which an overflow-x container would otherwise clip
const rowClass =
  "scrollbar-none -mx-2 -my-3 flex snap-x gap-4 overflow-x-auto px-2 py-3";
const rowItemClass = "w-32 shrink-0 snap-start sm:w-40 xl:w-44";

// One horizontal row on the Movies/Series page, e.g. "Comedy", like Stremio's Board.
// Loads only when scrolled near, so the page doesn't fire 20+ requests at once.
interface CatalogProps {
  type: TitleType;
  genre?: string; // undefined = the unfiltered "Popular" catalog
}

export function CatalogRow({ type, genre }: CatalogProps) {
  const name = genre ?? "Popular";
  const headingId = `row-${type}-${name}`;
  const typeLabel = TITLE_TYPES[type].label;
  const [ref, inView] = useInView();
  const { items, isLoading, error } = useCatalog(type, genre, 1, inView);
  const { ratings } = useWatched();

  if (error || (!isLoading && items.length === 0)) return null;

  return (
    <section ref={ref} aria-labelledby={headingId} className="min-h-56">
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id={headingId} className="text-xl font-bold sm:text-2xl">
          {name}
        </h2>
        <Link
          to={catalogPath(type, genre)}
          className="text-sm font-semibold text-neutral-400 transition hover:text-white"
        >
          See all
          <span className="sr-only">
            {" "}
            {name} {typeLabel.toLowerCase()}
          </span>{" "}
          ›
        </Link>
      </header>

      {isLoading ? (
        <ul className={rowClass} aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <li
              key={i}
              className={`${rowItemClass} aspect-[2/3] animate-pulse rounded-md bg-surface-700`}
            />
          ))}
        </ul>
      ) : (
        <ul className={rowClass}>
          {items.slice(0, ROW_LENGTH).map(fromCatalog).map((movie) => (
            <li key={movie.id} className={rowItemClass}>
              <MovieCard movie={movie} userRating={ratings[movie.id]} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Chips to jump between the catalogs of one type
export function GenreChips({ type }: { type: TitleType }) {
  const chipClass = ({ isActive }: { isActive: boolean }) =>
    `shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
      isActive
        ? "border-white bg-white text-black"
        : "border-white/15 text-neutral-300 hover:border-white/40 hover:text-white"
    }`;

  return (
    <nav aria-label="Genres" className="scrollbar-none -mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        {[undefined, ...GENRES[type]].map((genre) => (
          <li key={genre ?? "popular"}>
            <NavLink to={catalogPath(type, genre)} className={chipClass}>
              {genre ?? "Popular"}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// The full catalog behind a "See all" link, paged with "Load more".
// Remount with a new `key` per genre so paging starts over.
export function CatalogGrid({ type, genre }: CatalogProps) {
  const [page, setPage] = useState(1);
  const { items, hasMore, isLoading, error } = useCatalog(type, genre, page);

  return (
    <section>
      {error && page === 1 ? (
        <ErrorMessage message={error} />
      ) : (
        <MovieGrid movies={items.map(fromCatalog)} />
      )}

      {isLoading && page === 1 && <GridSkeleton />}

      {page > 1 && error && (
        <p className="mt-6 text-center text-sm text-brand">{error}</p>
      )}

      {hasMore && items.length > 0 && (
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
