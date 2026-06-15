import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { searchPath } from "@/lib/paths";

const SUGGESTIONS = ["Margarita", "Negroni", "Espresso Martini", "Mojito"];

export function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(searchPath(q));
  }

  return (
    <header className="pb-6 pt-10">
      <div className="mb-6 flex items-center gap-3.5 text-[0.7rem] uppercase tracking-[0.46em] text-amber">
        <span className="h-px w-12 bg-amber/60" />
        Rate · Review · Rediscover
      </div>

      <h1 className="max-w-[14ch] font-serif text-[clamp(2.9rem,8vw,5.5rem)] font-light leading-[0.98] tracking-tight">
        Every great night starts with the{" "}
        <em className="italic text-amber">right pour.</em>
      </h1>

      <p className="mt-6 max-w-[46ch] text-lg text-muted-foreground">
        A community-rated index of classic and modern cocktails. Search the
        cellar, leave your verdict, and let the crowd guide your next round.
      </p>

      <form onSubmit={submit} className="mt-9 max-w-xl">
        <div className="flex items-center gap-3 rounded-full border border-border bg-gradient-to-b from-card to-background py-2 pl-6 pr-2 shadow-2xl shadow-black/40 transition-colors focus-within:border-amber/55">
          <Search className="h-5 w-5 shrink-0 text-amber" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search a cocktail by name…"
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

        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          Try:
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => navigate(searchPath(s))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-amber/40 hover:text-amber"
            >
              {s}
            </button>
          ))}
        </div>
      </form>
    </header>
  );
}
