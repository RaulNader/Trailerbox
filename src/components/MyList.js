import { average } from "../utils";
import { fromWatched } from "./MovieCard";
import { MovieGrid } from "./MovieGrid";
import { EmptyState } from "./Status";
import { useWatched } from "../contexts/WatchedContext";

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-surface-700 p-4 ring-1 ring-white/5">
      <p className="text-sm text-neutral-400">
        <span aria-hidden>{icon}</span> {label}
      </p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export function MyList({ filter }) {
  const { watched, removeWatched } = useWatched();

  if (!watched.length)
    return (
      <EmptyState icon="🍿" title="Your list is empty">
        Open any movie or series, rate it with the stars, and it will show up here.
      </EmptyState>
    );

  const term = filter.trim().toLowerCase();
  const shown = term
    ? watched.filter((m) => m.title.toLowerCase().includes(term))
    : watched;

  const totalMinutes = watched.reduce((sum, m) => sum + m.runtime, 0);

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="🎬" label="Titles" value={watched.length} />
        <Stat
          icon="⭐️"
          label="Avg. IMDb"
          value={average(watched.map((m) => m.imdbRating)).toFixed(1)}
        />
        <Stat
          icon="🌟"
          label="Your avg."
          value={average(watched.map((m) => m.userRating)).toFixed(1)}
        />
        <Stat
          icon="⏳"
          label="Time watched"
          value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
        />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">
          {term ? `My List matching “${filter.trim()}”` : "My List"}
        </h2>
        {shown.length ? (
          <MovieGrid
            movies={[...shown].reverse().map(fromWatched)}
            onRemove={removeWatched}
          />
        ) : (
          <EmptyState icon="🔍" title="No matches">
            Nothing in your list matches “{filter.trim()}”.
          </EmptyState>
        )}
      </section>
    </div>
  );
}
