import { cn } from "@/lib/utils";
import type { AlcoholicFilter } from "../hooks/useSearchResults";
import { drinkCategories, DrinkCategory } from "../types/FilterTypes";

interface SearchFiltersProps {
  filter: AlcoholicFilter;
  resultCount: number;
  onFilterChange: (f: string) => void;
}

type FilterOptions = {
  value: string;
  label: string;
};

const ALCOHOL_FILTER_OPTIONS: { value: AlcoholicFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "alcoholic", label: "Alcoholic" },
  { value: "non-alcoholic", label: "Non-Alcoholic" },
];

const CATEGORY_FILTER_OPTIONS: { value: string; label: DrinkCategory }[] =
  drinkCategories.map((x) => {
    return {
      value: x.toLowerCase(),
      label: x,
    };
  });

export function SearchFilters({
  filter,
  resultCount,
  onFilterChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-5">
      <span className="text-xs text-muted-foreground">
        {resultCount} {resultCount === 1 ? "result" : "results"}
      </span>
      <ToggleFilter
        filter={filter}
        filterOptions={ALCOHOL_FILTER_OPTIONS}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}

interface ToggleFilterProps {
  filter: AlcoholicFilter;
  filterOptions: FilterOptions[];
  onFilterChange: (f: string) => void;
}

function ToggleFilter({
  filter,
  filterOptions,
  onFilterChange,
}: ToggleFilterProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 p-1">
      {filterOptions.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onFilterChange(opt.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs md:text-sm font-medium transition-all",
            filter === opt.value
              ? "bg-amber text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
