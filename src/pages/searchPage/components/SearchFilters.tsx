import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AlcoholicFilter } from "../hooks/useSearchResults";
import { drinkCategories, DrinkCategory } from "../types/FilterTypes";

interface SearchFiltersProps {
  filter: AlcoholicFilter;
  category: string;
  resultCount: number;
  onFilterChange: (f: string) => void;
  onCategoryChange: (c: string) => void;
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
      value: x,
      label: x,
    };
  });

export function SearchFilters({
  filter,
  category,
  resultCount,
  onFilterChange,
  onCategoryChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-5">
      <div className="flex items-center gap-3">
        <CategoryFilter
          category={category}
          onCategoryChange={onCategoryChange}
        />
        <span className="text-xs text-muted-foreground">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      </div>
      <ToggleFilter
        filter={filter}
        filterOptions={ALCOHOL_FILTER_OPTIONS}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}

interface CategoryFilterProps {
  category: string;
  onCategoryChange: (c: string) => void;
}

function CategoryFilter({ category, onCategoryChange }: CategoryFilterProps) {
  const activeLabel =
    CATEGORY_FILTER_OPTIONS.find((opt) => opt.value === category)?.label ??
    CATEGORY_FILTER_OPTIONS[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label={`Category: ${activeLabel}. Change category filter`}
        className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 md:py-2.5 text-xs md:text-sm font-medium outline-none transition-colors hover:border-amber/40 focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="text-muted-foreground">Category</span>
        <span className={cn(category !== "all" && "text-amber")}>
          {activeLabel}
        </span>
        <ChevronDown className="size-3.5 md:size-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[13rem] rounded-[1.25rem] border-border bg-card p-1.5 shadow-2xl shadow-black/60"
      >
        <DropdownMenuRadioGroup
          value={category}
          onValueChange={onCategoryChange}
        >
          {CATEGORY_FILTER_OPTIONS.map((opt) => {
            const selected = category === opt.value;

            return (
              <DropdownMenuRadioItem
                key={opt.value}
                value={opt.value}
                className={cn(
                  "cursor-pointer rounded-[1rem] px-3.5 py-2 pl-3.5 text-sm transition-colors focus:bg-amber/10 focus:text-foreground [&>span:first-child]:hidden",
                  selected && "bg-amber/15 focus:bg-amber/20",
                )}
              >
                <span
                  className={cn(
                    "transition-colors",
                    selected
                      ? "font-semibold text-amber"
                      : "text-muted-foreground",
                  )}
                >
                  {opt.label}
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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
            "rounded-full px-4 py-0.5 md:py-1.5 text-xs md:text-sm font-medium transition-all",
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
