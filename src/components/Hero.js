import { useMovieDetails } from "../hooks/useMovieDetails";
import { hasValue } from "../utils";
import Poster from "./Poster";
import { TitleLink } from "./MovieCard";

export function Hero({ featuredId }) {
  const { movie, isLoading, error } = useMovieDetails(featuredId);

  if (error) return <div className="h-24" />;
  if (isLoading || !movie.Title)
    return <div className="h-[70vh] min-h-[420px] animate-pulse bg-surface-700" />;

  const { Title, Year, Genre, Plot, Poster: poster, imdbRating, Type } = movie;

  return (
    <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
      {/* Posters are portrait, so a blurred, scaled copy fills the wide banner */}
      {hasValue(poster) && (
        <img
          src={poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-surface-800 via-surface-800/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface-800 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl items-end gap-10 px-4 pb-16 sm:px-8 md:items-center md:pb-0">
        <div className="max-w-xl animate-pop-in">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-brand">
            Featured {Type === "series" ? "series" : "film"}
          </p>
          <h2 className="text-4xl font-extrabold leading-tight drop-shadow-lg sm:text-6xl">
            {Title}
          </h2>
          <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
            <span className="font-semibold text-green-400">★ {imdbRating}</span>
            <span>{Year}</span>
            {hasValue(Genre) && <span>{Genre}</span>}
          </p>
          <p className="mt-4 line-clamp-3 text-base text-neutral-200 sm:text-lg">{Plot}</p>
          <div className="mt-6 flex gap-3">
            <TitleLink id={featuredId} className="btn-primary">
              ▶ Rate it
            </TitleLink>
            <TitleLink id={featuredId} className="btn-ghost">
              ⓘ More info
            </TitleLink>
          </div>
        </div>

        <Poster
          src={poster}
          title={Title}
          className="ml-auto hidden w-64 rotate-2 rounded-lg shadow-2xl shadow-black ring-1 ring-white/10 lg:block"
        />
      </div>
    </section>
  );
}
