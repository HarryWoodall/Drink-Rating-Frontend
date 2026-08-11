import { Search, X } from "lucide-react";

interface FavouritesSearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

/**
 * Narrows the already-loaded favourites as you type — no submit, since the
 * list is local and there's nothing to fetch.
 */
export function FavouritesSearchBar({
  value,
  onChange,
}: FavouritesSearchBarProps) {
  return (
    <div className="mb-8 max-w-xl">
      <div className="flex items-center gap-3 rounded-full border border-border bg-gradient-to-b from-card to-background py-2 pl-6 pr-6 shadow-2xl shadow-black/40 transition-colors focus-within:border-amber/55">
        <Search className="h-5 w-5 shrink-0 text-amber" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          placeholder="Filter your favourites…"
          autoComplete="off"
          aria-label="Filter your favourites"
          className="flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground/70"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear filter"
            className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-amber"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
