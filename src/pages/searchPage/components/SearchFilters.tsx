import { cn } from "@/lib/utils";
import type { AlcoholicFilter, SearchType } from "../hooks/useSearchResults";

interface SearchFiltersProps {
  type: SearchType;
  filter: AlcoholicFilter;
  resultCount: number;
  onTypeChange: (t: SearchType) => void;
  onFilterChange: (f: AlcoholicFilter) => void;
}

const TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: "name", label: "By Name" },
  { value: "ingredient", label: "By Ingredient" },
];

const FILTER_OPTIONS: { value: AlcoholicFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "alcoholic", label: "Alcoholic" },
  { value: "non-alcoholic", label: "Non-Alcoholic" },
];

export function SearchFilters({
  type,
  filter,
  resultCount,
  onTypeChange,
  onFilterChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-5">
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 p-1">
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onTypeChange(opt.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              type === opt.value
                ? "bg-amber text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 p-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange(opt.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                filter === opt.value
                  ? "bg-amber text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
