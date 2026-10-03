import { average } from "../utils";
import { fromWatched } from "../mappers";
import { MovieGrid } from "./MovieGrid";
import { EmptyState } from "./Status";
import { useWatched } from "../contexts/watched";

function Stat({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-surface-700 p-4 ring-1 ring-white/5">
      <p className="text-sm text-neutral-400">
        <span aria-hidden>{icon}</span> {label}
      </p>
      <p className="mt-1 text-xl font-bold sm:text-2xl">{value}</p>
    </div>
  );
}

export function MyList({ filter }: { filter: string }) {
  const { watched, removeWatched } = useWatched();

  if (!watched.length)
    return (
      <>
        <h1 className="sr-only">My List</h1>
        <EmptyState icon="🍿" title="Your list is empty">
          Open any movie or series, rate it with the stars, and it will show up here.
        </EmptyState>
      </>
    );

  const term = filter.trim().toLowerCase();
  const shown = term
    ? watched.filter((m) => m.title.toLowerCase().includes(term))
    : watched;

  const totalMinutes = watched.reduce((sum, m) => sum + m.runtime, 0);

  return (
    <div className="space-y-10">
      <section aria-label="Stats" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
        <h1 className="mb-4 text-xl font-bold sm:text-2xl">
          {term ? `My List matching “${filter.trim()}”` : "My List"}
        </h1>
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
