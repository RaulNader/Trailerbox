import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Poster from "./Poster";
import { ErrorMessage, Spinner } from "./Status";
import { useKey } from "../hooks/useKey";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { hasValue } from "../utils";
import { useWatched } from "../contexts/WatchedContext";

export function MovieModal({ selectedId, onClose }) {
  const { watched, addWatched, removeWatched } = useWatched();
  const { movie, isLoading, error } = useMovieDetails(selectedId);
  const watchedMovie = watched.find((m) => m.imdbID === selectedId);
  const [userRating, setUserRating] = useState(watchedMovie?.userRating ?? 0);

  useKey("Escape", onClose);

  // Lock page scroll while the modal is open
  useEffect(function () {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Writer: writer,
    Genre: genre,
    Rated: rated,
    Type: type,
    totalSeasons,
  } = movie;

  useEffect(
    function () {
      if (!title) return;
      document.title = `${title} | usePopcorn`;
      return () => {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  function handleSave() {
    addWatched({
      imdbID: selectedId,
      title,
      year,
      poster,
      type,
      imdbRating: Number(imdbRating) || 0,
      runtime: parseInt(runtime, 10) || 0,
      userRating,
    });
    onClose();
  }

  const ratingChanged = userRating > 0 && userRating !== watchedMovie?.userRating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm animate-fade-in sm:items-center sm:p-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Movie details"}
        className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-surface-700 shadow-2xl shadow-black ring-1 ring-white/10 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-lg transition hover:bg-white hover:text-black"
        >
          ✕
        </button>

        {isLoading && <Spinner className="py-32" />}
        {!isLoading && error && (
          <div className="p-8">
            <ErrorMessage message={error} />
          </div>
        )}

        {!isLoading && !error && title && (
          <>
            <header className="relative flex flex-col gap-6 overflow-hidden p-6 sm:flex-row sm:p-8">
              {hasValue(poster) && (
                <img
                  src={poster}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-700 to-transparent" />

              <Poster
                src={poster}
                title={title}
                className="relative mx-auto w-40 shrink-0 rounded-md shadow-xl ring-1 ring-white/10 sm:mx-0 sm:w-48"
              />

              <div className="relative flex flex-col justify-end gap-3">
                <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-300">
                  <span className="font-semibold text-green-400">★ {imdbRating} IMDb</span>
                  <span>{year}</span>
                  {hasValue(rated) && (
                    <span className="rounded border border-white/40 px-1.5 text-xs">{rated}</span>
                  )}
                  {hasValue(runtime) && <span>{runtime}</span>}
                  {hasValue(totalSeasons) && (
                    <span>
                      {totalSeasons} season{totalSeasons === "1" ? "" : "s"}
                    </span>
                  )}
                </div>
                {hasValue(genre) && (
                  <ul className="flex flex-wrap gap-2">
                    {genre.split(", ").map((g) => (
                      <li key={g} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                        {g}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </header>

            <section className="space-y-6 px-6 pb-8 sm:px-8">
              <div className="rounded-lg bg-surface-800 p-4 ring-1 ring-white/5">
                <p className="mb-3 text-sm text-neutral-400">
                  {watchedMovie
                    ? `In your list — you rated it ${watchedMovie.userRating}/10`
                    : "Rate it to add it to your list"}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <StarRating
                    maxRating={10}
                    size={26}
                    color="#e50914"
                    defaultRating={watchedMovie?.userRating ?? 0}
                    onSetRating={setUserRating}
                  />
                  <div className="ml-auto flex gap-2">
                    {watchedMovie && (
                      <button
                        className="btn-ghost"
                        onClick={() => {
                          removeWatched(selectedId);
                          onClose();
                        }}
                      >
                        Remove
                      </button>
                    )}
                    {ratingChanged && (
                      <button className="btn-brand" onClick={handleSave}>
                        {watchedMovie ? "Update rating" : "+ Add to My List"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {hasValue(plot) && <p className="leading-relaxed text-neutral-200">{plot}</p>}

              <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                <Credit label="Starring" value={actors} />
                <Credit label="Director" value={director} />
                <Credit label="Writer" value={writer} />
                <Credit label="Released" value={released} />
              </dl>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Credit({ label, value }) {
  if (!hasValue(value)) return null;
  return (
    <>
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-neutral-200">{value}</dd>
    </>
  );
}
