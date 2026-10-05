import { Link, useLocation, type LinkProps } from "react-router";
import Poster from "./Poster";
import type { CardMovie } from "../types";

type TitleLinkProps = Omit<LinkProps, "to"> & { id: string };

// Opens the details modal as a nested route (relative to the current page,
// e.g. /movies -> /movies/tt0816692) without jumping to the top of the page
export function TitleLink({ id, children, ...props }: TitleLinkProps) {
  const { search } = useLocation();

  return (
    <Link
      to={{ pathname: id, search }}
      state={{ modal: true }}
      preventScrollReset
      {...props}
    >
      {children}
    </Link>
  );
}

interface MovieCardProps {
  movie: CardMovie;
  userRating?: number;
  onRemove?: (id: string) => void;
}

export function MovieCard({ movie, userRating = 0, onRemove }: MovieCardProps) {
  const { id, title, year, poster, type } = movie;

  return (
    <article className="group relative animate-fade-in">
      <TitleLink
        id={id}
        aria-label={`${title} (${year})`}
        className="relative block aspect-[2/3] w-full overflow-hidden rounded-md bg-surface-700 shadow-lg ring-1 ring-fg/5 transition duration-300 ease-out hover:z-10 hover:scale-105 hover:shadow-2xl hover:shadow-black/40 hover:ring-fg/25 focus-visible:scale-105"
      >
        <Poster src={poster} title={title} className="h-full w-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />

        {/* Overlay text sits on the black gradient, so it stays white in both themes */}
        <div className="absolute inset-x-0 bottom-0 translate-y-3 p-3 text-left text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight">{title}</h3>
          <p className="mt-1 text-xs text-white/75">
            {year}
            {type && <span className="ml-2 rounded border border-white/30 px-1 uppercase">{type}</span>}
          </p>
        </div>

        {userRating > 0 && (
          <span className="absolute left-2 top-2 rounded bg-brand px-1.5 py-0.5 text-xs font-bold text-white shadow">
            ★ {userRating}
          </span>
        )}
      </TitleLink>

      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          aria-label={`Remove ${title} from My List`}
          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm text-white opacity-0 transition hover:bg-brand group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
        >
          ✕
        </button>
      )}

      {/* Touch screens have no hover, so show the title under the card */}
      <p className="mt-2 truncate text-sm text-neutral-300 md:hidden">{title}</p>
    </article>
  );
}
