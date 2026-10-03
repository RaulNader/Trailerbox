import { Link } from "react-router";
import type { Movie } from "~/types/movie";
import { Rating } from "./Rating";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-1 hover:border-brand"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold group-hover:text-brand">
          {movie.title}
        </h2>
        <span className="text-sm text-zinc-500">{movie.year}</span>
      </div>
      <p className="line-clamp-3 text-sm text-zinc-400">{movie.description}</p>
      <div className="mt-auto">
        <Rating value={movie.rating} />
      </div>
    </Link>
  );
}
