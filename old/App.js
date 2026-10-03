import { useCallback, useEffect, useMemo, useState } from "react";
import { NavBar } from "./components/NavBar";
import { Hero } from "./components/Hero";
import { BrowseSection, SearchResults } from "./components/Browse";
import { MyList } from "./components/MyList";
import { MovieModal } from "./components/MovieModal";
import { useDebounce } from "./hooks/useDebounce";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import {
  BROWSE,
  MIN_QUERY_LENGTH,
  SEARCH_DEBOUNCE_MS,
  TABS,
  WATCHED_STORAGE_KEY,
} from "./config";

export default function App() {
  const [storedTab, setTab] = useLocalStorageState("movie", "tab");
  const tab = TABS.some((t) => t.id === storedTab) ? storedTab : "movie";
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], WATCHED_STORAGE_KEY);

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const isSearching = debouncedQuery.trim().length >= MIN_QUERY_LENGTH;

  // imdbID -> user rating, so every card can show its badge
  const ratings = useMemo(
    () => Object.fromEntries(watched.map((m) => [m.imdbID, m.userRating])),
    [watched],
  );

  const handleClose = useCallback(() => setSelectedId(null), []);

  function handleTabChange(id) {
    setTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [
      ...watched.filter((m) => m.imdbID !== movie.imdbID),
      movie,
    ]);
  }

  function handleRemoveWatched(id) {
    setWatched((watched) => watched.filter((m) => m.imdbID !== id));
  }

  // A new search closes the open movie
  useEffect(
    function () {
      handleClose();
    },
    [debouncedQuery, handleClose],
  );

  const browse = BROWSE[tab];
  const typeLabel = TABS.find((t) => t.id === tab)?.label;

  return (
    <>
      <NavBar
        tab={tab}
        onTabChange={handleTabChange}
        query={query}
        setQuery={setQuery}
        listCount={watched.length}
      />

      <main className="pb-20">
        {tab === "list" ? (
          <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-8 md:pt-28">
            <MyList
              watched={watched}
              filter={query}
              ratings={ratings}
              onSelect={setSelectedId}
              onRemove={handleRemoveWatched}
            />
          </div>
        ) : isSearching ? (
          <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-8 md:pt-28">
            <SearchResults
              key={`${tab}-${debouncedQuery}`}
              query={debouncedQuery}
              type={tab}
              typeLabel={typeLabel}
              ratings={ratings}
              onSelect={setSelectedId}
            />
          </div>
        ) : (
          <>
            <Hero
              key={tab}
              featuredId={browse.featuredId}
              onSelect={setSelectedId}
            />
            <div className="relative mx-auto -mt-10 max-w-7xl space-y-12 px-4 sm:px-8">
              {browse.sections.map((section) => (
                <BrowseSection
                  key={`${tab}-${section.query}`}
                  title={section.title}
                  query={section.query}
                  type={tab}
                  ratings={ratings}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-neutral-500">
        Data from the OMDb API · Press{" "}
        <kbd className="rounded bg-white/10 px-1.5">Enter</kbd> to search,{" "}
        <kbd className="rounded bg-white/10 px-1.5">Esc</kbd> to close
      </footer>

      {selectedId && (
        <MovieModal
          key={selectedId}
          selectedId={selectedId}
          watched={watched}
          onClose={handleClose}
          onAddWatched={handleAddWatched}
          onRemoveWatched={handleRemoveWatched}
        />
      )}
    </>
  );
}
