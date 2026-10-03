import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { SEARCH_DEBOUNCE_MS, TABS } from "../config";
import { useKey } from "../hooks/useKey";
import { useWatched } from "../contexts/watched";

export function NavBar() {
  const { watched } = useWatched();
  const [isScrolled, setIsScrolled] = useState(false);

  // Transparent over the hero, solid once the page scrolls
  useEffect(function () {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        isScrolled
          ? "bg-surface-900/95 shadow-lg shadow-black/40 backdrop-blur"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-8 md:gap-x-8 md:py-4">
        <Link
          to="/movies"
          className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-brand sm:text-2xl"
        >
          <span aria-hidden>🍿</span>
          <span className="max-[380px]:sr-only">usePopcorn</span>
        </Link>

        <ul className="order-last flex w-full gap-6 text-sm font-medium md:order-none md:w-auto">
          {TABS.map((t) => (
            <li key={t.id}>
              <NavLink
                to={t.to}
                className={({ isActive }) =>
                  `relative py-1 transition ${
                    isActive
                      ? "font-bold text-white after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded after:bg-brand"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`
                }
              >
                {t.label}
                {t.id === "list" && watched.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {watched.length}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <Search />
      </nav>
    </header>
  );
}

const sectionOf = (pathname: string) => {
  const base = `/${pathname.split("/")[1]}`;
  return TABS.some((t) => t.to === base) ? base : "/movies";
};

// The search box writes to ?q= on the current section, so results are
// linkable and the Back button undoes a search
function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  const [input, setInput] = useState(urlQuery);
  const inputEl = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const locationRef = useRef(location);
  useEffect(function () {
    locationRef.current = location;
  });

  // Follow the URL when it changes elsewhere (tab click, Back button).
  // Adjusting state during render avoids an extra effect-driven re-render.
  const urlKey = `${location.pathname}?${urlQuery}`;
  const [prevUrlKey, setPrevUrlKey] = useState(urlKey);
  if (urlKey !== prevUrlKey) {
    setPrevUrlKey(urlKey);
    setInput(urlQuery);
  }

  // ...and drop any pending debounced commit from before the URL changed
  useEffect(() => clearTimeout(timer.current), [urlKey]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function commit(value: string) {
    const { pathname, search } = locationRef.current;
    const base = sectionOf(pathname);
    const currentQuery = new URLSearchParams(search).get("q") ?? "";
    if (value === currentQuery && pathname === base) return;

    // Leaving the section root (e.g. an open modal) closes it
    navigate(
      { pathname: base, search: value.trim() ? `?${new URLSearchParams({ q: value })}` : "" },
      // Typing refines the current search instead of piling up history entries
      { replace: currentQuery !== "" && value.trim() !== "" }
    );
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInput(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(value), SEARCH_DEBOUNCE_MS);
  }

  function handleClear() {
    clearTimeout(timer.current);
    setInput("");
    commit("");
    inputEl.current?.focus();
  }

  // Press Enter anywhere to jump into the search box
  useKey("Enter", function (e) {
    // Ignore Enter on focused elements (inputs, buttons, stars)
    if (e.target !== document.body) return;
    inputEl.current?.focus();
    inputEl.current?.select();
  });

  const section = sectionOf(location.pathname);
  const placeholder =
    section === "/my-list"
      ? "Filter my list..."
      : `Search ${section === "/series" ? "series" : "movies"}...`;

  return (
    <div role="search" className="relative ml-auto min-w-0 flex-1 sm:w-72 sm:flex-none">
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        aria-hidden
      >
        🔍
      </span>
      <input
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        value={input}
        onChange={handleChange}
        ref={inputEl}
        className="w-full rounded-md border border-white/15 bg-black/60 py-2 pl-10 pr-9 text-sm text-white placeholder-neutral-400 transition focus:border-white/50 focus:bg-black/80 focus:outline-none"
      />
      {input && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1.5 text-neutral-400 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}
