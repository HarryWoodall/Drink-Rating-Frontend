interface DrinkDescriptionProps {
  category: string;
  alcoholic: string;
}

export function DrinkDescription({
  category,
  alcoholic,
}: DrinkDescriptionProps) {
  return (
    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
      {[category, alcoholic].filter(Boolean).join(" · ")}
    </p>
  );
}
