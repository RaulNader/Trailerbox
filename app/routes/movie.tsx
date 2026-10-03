import { data, Link } from "react-router";
import { Rating } from "~/components/Rating";
import { getMovie } from "~/lib/movies";
import type { Route } from "./+types/movie";

export async function loader({ params }: Route.LoaderArgs) {
  const movie = await getMovie(params.movieId);
  if (!movie) throw data(null, { status: 404, statusText: "Movie not found" });
  return { movie };
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
  return [{ title: data ? `${data.movie.title} | MovieBox` : "MovieBox" }];
}

export default function MovieDetails({ loaderData }: Route.ComponentProps) {
  const { movie } = loaderData;

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <Link to="/" className="text-sm text-zinc-400 hover:text-brand">
        ← All movies
      </Link>
      <header className="space-y-2">
        <h1 className="text-4xl font-black">{movie.title}</h1>
        <p className="text-zinc-500">{movie.year}</p>
        <Rating value={movie.rating} />
      </header>
      <ul className="flex flex-wrap gap-2">
        {movie.genres.map((genre) => (
          <li
            key={genre}
            className="rounded-full bg-zinc-800 px-3 py-1 text-xs"
          >
            {genre}
          </li>
        ))}
      </ul>
      <p className="text-lg leading-relaxed text-zinc-300">
        {movie.description}
      </p>
    </article>
  );
}
