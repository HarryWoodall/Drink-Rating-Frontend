import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CocktailDbDrink } from "@/types/cocktail";

interface RandomCocktailCardProps {
  drink: CocktailDbDrink;
}

export function RandomCocktailCard({ drink }: RandomCocktailCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={drink.strDrinkThumb}
          alt={drink.strDrink}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-3">
        <p className="truncate font-medium text-sm">{drink.strDrink}</p>
        <Badge variant="outline" className="mt-1 text-xs">
          {drink.strAlcoholic}
        </Badge>
      </CardContent>
    </Card>
  );
}
