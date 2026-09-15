import { useEffect, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import type { SearchType } from "@/types/search";
import { SearchBarDropdown } from "./SearchBarDropdown";

interface SearchBarProps {
  defaultValue?: string;
  type: SearchType;
  onSubmit: (event: FormEvent) => void;
  onChange: (query: string) => void;
  onTypeChange: (type: SearchType) => void;
}

export function SearchBar({
  defaultValue,
  type,
  onSubmit,
  onChange,
  onTypeChange,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    // TODO - figure out how to do this properly
    setQuery(defaultValue);
  }, [defaultValue]);

  return (
    <form onSubmit={onSubmit} className="max-w-xl">
      <div className="flex items-center gap-3 rounded-full border border-border bg-gradient-to-b from-card to-background md:py-2 pl-4 md:pl-6 pr-2 shadow-2xl shadow-black/40 transition-colors focus-within:border-amber/55">
        <Search className="h-5 w-5 shrink-0 text-amber" />
        <input
          value={query}
          onChange={(e) => {
            const queryValue = e.target.value;
            setQuery(queryValue);
            onChange(queryValue);
          }}
          type="text"
          placeholder={
            type === "ingredient"
              ? "Search a cocktail by ingredient…"
              : "Search a cocktail by name…"
          }
          autoComplete="off"
          aria-label="Search cocktails"
          className="flex-1 min-w-0 bg-transparent py-2.5 text-sm md:text-base outline-none placeholder:text-muted-foreground/70"
        />

        <SearchBarDropdown
          onTypeChange={onTypeChange}
          onSearch={onSubmit}
          type={type}
        />
      </div>
    </form>
  );
}

// interface SearchBarDropdownProps {
//   activeLabel: string;
//   onTypeChange: (type: SearchType) => void;
//   type: SearchType;
// }

// function SearchBarDropdown({
//   activeLabel,
//   onTypeChange,
//   type,
// }: SearchBarDropdownProps) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger
//         type="button"
//         aria-label={`Search ${activeLabel.toLowerCase()}, change search mode`}
//         className="flex shrink-0 items-center gap-2 rounded-full bg-amber px-4 md:px-5 py-2 my-1.5 md:my-0 md:py-3 text-sm font-semibold text-primary-foreground outline-none transition-all hover:-translate-y-px hover:bg-amber-bright focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background"
//       >
//         {activeLabel}
//         <ChevronDown className="h-4 w-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         align="end"
//         sideOffset={10}
//         className="w-[14.5rem] rounded-[1.25rem] border-border bg-card p-1.5 shadow-2xl shadow-black/60"
//       >
//         <DropdownMenuRadioGroup
//           value={type}
//           onValueChange={(value) => onTypeChange(value as SearchType)}
//         >
//           {TYPE_OPTIONS.map((opt) => (
//             <DropdownMenuRadioItem
//               key={opt.value}
//               value={opt.value}
//               className="cursor-pointer gap-3 rounded-[1rem] px-3.5 py-2.5 pl-3.5 text-sm focus:bg-amber/10 focus:text-foreground [&>span:first-child]:hidden"
//             >
//               <Check
//                 className={cn(
//                   "h-4 w-4 shrink-0",
//                   type === opt.value ? "text-amber" : "text-transparent",
//                 )}
//               />
//               <span
//                 className={
//                   type === opt.value
//                     ? "text-foreground"
//                     : "text-muted-foreground"
//                 }
//               >
//                 {opt.label}
//               </span>
//             </DropdownMenuRadioItem>
//           ))}
//         </DropdownMenuRadioGroup>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
