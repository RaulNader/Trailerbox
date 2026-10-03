import { useOutlet, useSearchParams } from "react-router";
import { Hero } from "../components/Hero";
import { SearchResults } from "../components/Browse";
import { CatalogRow } from "../components/Catalog";
import { FEATURED_ID, GENRES, MIN_QUERY_LENGTH, TITLE_TYPES } from "../config";
import type { TitleType } from "../types";

// /movies and /series: one catalog row per genre, or search results when ?q= is set
export default function BrowsePage({ type }: { type: TitleType }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const isSearching = query.trim().length >= MIN_QUERY_LENGTH;

  const typeLabel = TITLE_TYPES[type].label;
  const modal = useOutlet();

  return (
    <>
      {/* The open title modal sets its own <title> */}
      {!modal && (
        <title>
          {isSearching
            ? `“${query.trim()}” in ${typeLabel} | usePopcorn`
            : `${typeLabel} by genre | usePopcorn`}
        </title>
      )}

      {isSearching ? (
        <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-8 md:pt-28">
          <SearchResults
            key={`${type}-${query}`}
            query={query}
            type={type}
            typeLabel={typeLabel}
          />
        </div>
      ) : (
        <>
          <h1 className="sr-only">{typeLabel} by genre</h1>
          <Hero key={type} featuredId={FEATURED_ID[type]} />
          <div className="relative mx-auto -mt-10 max-w-7xl space-y-10 px-4 sm:px-8">
            {/* undefined = the unfiltered "Popular" catalog */}
            {[undefined, ...GENRES[type]].map((genre) => (
              <CatalogRow key={`${type}-${genre}`} type={type} genre={genre} />
            ))}
          </div>
        </>
      )}

      {/* Details modal (/:id) */}
      {modal}
    </>
  );
}
