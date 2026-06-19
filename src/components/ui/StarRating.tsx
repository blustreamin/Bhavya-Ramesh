import { StarIcon } from "./Icons";

type StarRatingProps = {
  /** Rating from 0 to `max`. */
  value: number;
  max?: number;
  className?: string;
};

/** Static star rating row (gold filled, dim empty). */
export function StarRating({ value, max = 5, className }: StarRatingProps) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className ?? ""}`}
      role="img"
      aria-label={`${value} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon
          key={i}
          className={`h-3 w-3 ${i < value ? "text-amber-400" : "text-white/25"}`}
        />
      ))}
    </div>
  );
}
