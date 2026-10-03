import { Link, useOutlet, useParams } from "react-router";
import { CatalogGrid, GenreChips } from "../components/Catalog";
import { EmptyState } from "../components/Status";
import { GENRES, TITLE_TYPES } from "../config";
import type { TitleType } from "../types";

// /movies/popular and /movies/genre/:genre (same for /series): one full catalog
export default function CatalogPage({ type }: { type: TitleType }) {
  const { genre } = useParams();
  const tab = TITLE_TYPES[type];
  const isKnown = !genre || GENRES[type].includes(genre);
  const heading = `${genre ?? "Popular"} ${tab.label}`;
  const modal = useOutlet();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pt-32 sm:px-8 md:pt-28">
      {!modal && <title>{`${heading} | usePopcorn`}</title>}

      <header className="space-y-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{heading}</h1>
        <GenreChips type={type} />
      </header>

      {isKnown ? (
        <CatalogGrid key={genre ?? "popular"} type={type} genre={genre} />
      ) : (
        <EmptyState icon="🗂️" title="No such category">
          Pick one of the genres above, or go back to{" "}
          <Link to={tab.to} className="text-white underline">
            {tab.label}
          </Link>
          .
        </EmptyState>
      )}

      {/* Details modal (/:id) */}
      {modal}
    </div>
  );
}
