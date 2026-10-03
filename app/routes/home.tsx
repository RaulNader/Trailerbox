import { Form } from "react-router";
import { MovieCard } from "~/components/MovieCard";
import { getMovies } from "~/lib/movies";
import type { Route } from "./+types/home";

export function meta(): Route.MetaDescriptors {
  return [{ title: "MovieBox" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  return { movies: await getMovies(q), q };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { movies, q } = loaderData;

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Top Movies</h1>
        <Form className="w-full sm:w-72">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search movies…"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 outline-none focus:border-brand"
          />
        </Form>
      </div>

      {movies.length === 0 ? (
        <p className="text-zinc-400">No movies match "{q}".</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
