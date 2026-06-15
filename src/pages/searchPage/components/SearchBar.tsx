import { useEffect, useState, type FormEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  defaultValue: string;
  onSubmit: (query: string) => void;
}

export function SearchBar({ defaultValue, onSubmit }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) onSubmit(q);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="flex items-center gap-3 rounded-full border border-border bg-gradient-to-b from-card to-background py-2 pl-6 pr-2 shadow-2xl shadow-black/40 transition-colors focus-within:border-amber/55">
        <Search className="h-5 w-5 shrink-0 text-amber" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search cocktails…"
          autoComplete="off"
          aria-label="Search cocktails"
          className="flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:bg-amber-bright"
        >
          Find
        </button>
      </div>
    </form>
  );
}
