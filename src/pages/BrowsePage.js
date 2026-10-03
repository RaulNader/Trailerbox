import { Outlet, useSearchParams } from "react-router";
import { Hero } from "../components/Hero";
import { BrowseSection, SearchResults } from "../components/Browse";
import { BROWSE, MIN_QUERY_LENGTH, TABS } from "../config";

// /movies and /series: curated home sections, or search results when ?q= is set
export default function BrowsePage({ type }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const isSearching = query.trim().length >= MIN_QUERY_LENGTH;

  const browse = BROWSE[type];
  const typeLabel = TABS.find((t) => t.id === type)?.label;

  return (
    <>
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
          <Hero key={type} featuredId={browse.featuredId} />
          <div className="relative mx-auto -mt-10 max-w-7xl space-y-12 px-4 sm:px-8">
            {browse.sections.map((section) => (
              <BrowseSection
                key={`${type}-${section.query}`}
                title={section.title}
                query={section.query}
                type={type}
              />
            ))}
          </div>
        </>
      )}

      {/* Details modal (/:id) */}
      <Outlet />
    </>
  );
}
