interface RatingProps {
  value: number;
  max?: number;
}

export function Rating({ value, max = 10 }: RatingProps) {
  const stars = Math.round((value / max) * 5);

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rated ${value} out of ${max}`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={i < stars ? "text-brand" : "text-zinc-700"}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-sm font-semibold">{value.toFixed(1)}</span>
    </div>
  );
}
