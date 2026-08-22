import { Button } from "@/components/ui/button";
import { cocktailPath } from "@/lib/paths";
import { Drink } from "@/types/cocktail";
import { Shuffle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

type RandomDrinkActionsProps = {
  drink: Drink;
  onShuffle: (() => void) | undefined;
  fetching?: boolean;
};

export function RandomDrinkActions({
  drink,
  onShuffle,
  fetching,
}: RandomDrinkActionsProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      <Button
        onClick={onShuffle}
        disabled={fetching}
        className="group rounded-full"
      >
        <Shuffle
          className={
            fetching
              ? "animate-spin"
              : "transition-transform group-hover:rotate-180"
          }
        />
        Shuffle Again
      </Button>
      {drink && (
        <Button asChild variant="outline" className="rounded-full">
          <Link to={cocktailPath(drink.id)}>
            View &amp; Rate
            <ArrowUpRight />
          </Link>
        </Button>
      )}
    </div>
  );
}
