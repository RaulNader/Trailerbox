import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Poster from "./Poster";
import { Trailer } from "./Trailer";
import { ErrorMessage, Spinner } from "./Status";
import { useKey } from "../hooks/useKey";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { useTrailer } from "../hooks/useTrailer";
import { hasValue } from "../utils";
import { useWatched } from "../contexts/watched";
import type { OmdbDetails } from "../types";

const NO_DETAILS: Partial<OmdbDetails> = {};

interface MovieModalProps {
  selectedId: string;
  onClose: () => void;
}

export function MovieModal({ selectedId, onClose }: MovieModalProps) {
  const { watched, addWatched, removeWatched } = useWatched();
  const { movie, isLoading, error } = useMovieDetails(selectedId);
  const trailerId = useTrailer(selectedId, movie?.Type);
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
    totalSeasons,
  } = movie ?? NO_DETAILS;

  function handleSave() {
    if (!movie) return;
    addWatched({
      imdbID: selectedId,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      type: movie.Type,
      imdbRating: Number(movie.imdbRating) || 0,
      runtime: parseInt(movie.Runtime, 10) || 0,
      userRating,
    });
    onClose();
  }

  const ratingChanged = userRating > 0 && userRating !== watchedMovie?.userRating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-2 animate-fade-in sm:items-center sm:p-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Movie details"}
        className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-surface-700 shadow-2xl shadow-black ring-1 ring-fg/10 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-lg text-white transition hover:bg-white hover:text-black"
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
          <article>
            {/* React 19 hoists <title> into <head>; the page behind skips its own while this is open */}
            <title>{`${title} (${year}) | TrailerBox`}</title>
            <header className="relative flex flex-col gap-5 overflow-hidden p-4 pt-14 sm:flex-row sm:p-6">
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
                className="relative mx-auto w-40 shrink-0 self-start rounded-md shadow-xl ring-1 ring-white/10 sm:mx-0 sm:w-48"
              />

              {/* Right column: title, facts, plot and credits, kept compact to fit beside the poster */}
              <div className="relative flex min-w-0 flex-1 flex-col gap-2 sm:pr-8">
                <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">{title}</h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-300">
                  <span className="font-semibold text-green-400">★ {imdbRating} IMDb</span>
                  {/* Full release date when known; it replaces a separate "Released" row */}
                  <span>{hasValue(released) ? released : year}</span>
                  {hasValue(rated) && (
                    <span className="rounded border border-fg/40 px-1.5 text-xs">{rated}</span>
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
                      <li key={g} className="rounded-full bg-fg/10 px-3 py-1 text-xs">
                        {g}
                      </li>
                    ))}
                  </ul>
                )}
                {hasValue(plot) && (
                  <p className="line-clamp-3 text-sm leading-relaxed text-neutral-200" title={plot}>
                    {plot}
                  </p>
                )}
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                  <Credit label="Starring" value={actors} />
                  <Credit label="Director" value={director} />
                  <Credit label="Writer" value={writer} />
                </dl>
              </div>
            </header>

            <section className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
              {trailerId && <Trailer youtubeId={trailerId} title={title} />}

              <div className="rounded-lg bg-surface-800 p-3 ring-1 sm:p-4 ring-fg/5">
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
                  <div className="flex gap-2 sm:ml-auto">
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
            </section>
          </article>
        )}
      </div>
    </div>
  );
}

function Credit({ label, value }: { label: string; value?: string }) {
  if (!hasValue(value)) return null;
  return (
    <>
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-neutral-200">{value}</dd>
    </>
  );
}
