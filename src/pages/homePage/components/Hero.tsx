import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { searchPath } from "@/lib/paths";
import { SearchBar } from "@/components/shared/layouts/SearchBar/SearchBar";
import type { SearchType } from "@/types/search";

export function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("name");

  function submit(e: FormEvent) {
    e.preventDefault();
    const formattedQuery = query.trim();
    if (formattedQuery) navigate(searchPath(formattedQuery, type));
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

      <p className="mt-6 mb-8 max-w-[46ch] text-lg text-muted-foreground">
        A community-rated index of classic and modern cocktails. Search the
        cellar, leave your verdict, and let the crowd guide your next round.
      </p>

      <SearchBar
        defaultValue=""
        type={type}
        onChange={(q) => setQuery(q)}
        onTypeChange={setType}
        onSubmit={submit}
      />
    </header>
  );
}
