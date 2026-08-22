import { alcoholicLabel } from "@/types/cocktail";

interface DrinkDescriptionProps {
  category: string;
  alcoholic: boolean;
}

export function DrinkDescription({
  category,
  alcoholic,
}: DrinkDescriptionProps) {
  return (
    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
      {[category, alcoholicLabel(alcoholic)].filter(Boolean).join(" · ")}
    </p>
  );
}
