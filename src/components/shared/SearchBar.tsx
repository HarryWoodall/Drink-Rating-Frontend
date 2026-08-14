import { useEffect, useState, type FormEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  defaultValue: string;
  onSubmit: (event: FormEvent) => void;
  onChange: (query: string) => void;
}

export function SearchBar({
  defaultValue,
  onSubmit,
  onChange,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    // TODO - figure out how to do this properly
    setQuery(defaultValue);
  }, [defaultValue]);

  return (
    <form onSubmit={onSubmit} className="max-w-xl">
      <div className="flex items-center gap-3 rounded-full border border-border bg-gradient-to-b from-card to-background md:py-2 pl-3 md:pl-6 pr-2 shadow-2xl shadow-black/40 transition-colors focus-within:border-amber/55">
        <Search className="h-5 w-5 shrink-0 text-amber" />
        <input
          value={query}
          onChange={(e) => {
            const queryValue = e.target.value;
            setQuery(queryValue);
            onChange(queryValue);
          }}
          type="text"
          placeholder="Search a cocktail by name…"
          autoComplete="off"
          aria-label="Search cocktails"
          className="flex-1 bg-transparent py-2.5 text-sm md:text-base outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-amber px-5 md:px-6 py-2 my-1.5 md:my-0 md:py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:bg-amber-bright"
        >
          Find
        </button>
      </div>
    </form>
  );
}
