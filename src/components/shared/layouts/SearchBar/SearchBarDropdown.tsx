import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SearchType } from "@/types/search";
import { ChevronDown } from "lucide-react";
import { FormEvent } from "react";

const TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "ingredient", label: "Ingredient" },
];

type SearchBarDropdownProps = {
  onTypeChange: (type: SearchType) => void;
  onSearch: (event: FormEvent) => void;
  type: SearchType;
};

export function SearchBarDropdown({
  onTypeChange,
  onSearch,
  type,
}: SearchBarDropdownProps) {
  const activeLabel =
    TYPE_OPTIONS.find((opt) => opt.value === type)?.label ??
    TYPE_OPTIONS[0].label;

  return (
    <DropdownMenu>
      <div className="flex shrink-0 items-center rounded-full bg-amber pr-3 md:pr-4 my-1.5 md:my-0 md:py-1 font-semibold text-primary-foreground outline-none transition-all hover:bg-amber-bright focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <Button
          variant="ghost"
          className="m-1 rounded-full px-3 py-0 h-8 md:h-10 md:my-0 pl-3"
          onClick={onSearch}
        >
          {/* <Search className="!size-4 md:!size-5 transition-transform duration-200" /> */}
          <span className="text-xs md:text-sm">{activeLabel}</span>
        </Button>

        <DropdownMenuTrigger
          type="button"
          aria-label={`Search ${activeLabel.toLowerCase()}, change search mode`}
          className="flex shrink-0 items-center gap-1 h-8 w-5"
        >
          <ChevronDown className="size-3 md:size-4 transition-transform duration-200" />
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[5.5rem] rounded-[1.25rem] border-border bg-card p-1.5 shadow-2xl shadow-black/60"
      >
        <DropdownMenuRadioGroup
          value={type}
          onValueChange={(value) => onTypeChange(value as SearchType)}
        >
          {TYPE_OPTIONS.map((opt) => {
            const selected = type === opt.value;

            return (
              <DropdownMenuRadioItem
                key={opt.value}
                value={opt.value}
                className={cn(
                  "cursor-pointer gap-3 rounded-[1rem] px-3.5 py-2.5 pl-3.5 text-sm transition-colors focus:bg-amber/10 focus:text-foreground [&>span:first-child]:hidden m-0.5",
                  selected && "bg-amber/15 focus:bg-amber/20",
                )}
              >
                <span
                  className={cn(
                    "pl-3 transition-colors",
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
