import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Drink } from "@/types/cocktail";
import { useToggleFavourite } from "@/pages/drink/hooks/useFavourite";
import { authClient } from "@/lib/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FavouriteIcon } from "./FavouriteIcon";

type Size = keyof typeof sizeMap;

type FavouriteButtonProps = {
  cocktail: Drink;
  readonly?: boolean;
  size?: Size;
};

const sizeMap = {
  sm: {
    button: "h-8 w-8 [&_svg]:size-6",
    icon: 24,
  },
  lg: {
    button: "h-12 w-12 [&_svg]:size-10",
    icon: 42,
  },
} as const;

export function FavouriteButton({
  cocktail,
  readonly = false,
  size = "lg",
}: FavouriteButtonProps) {
  const favourite = cocktail.favourite ?? false;
  const { mutate } = useToggleFavourite(cocktail.id);
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) return null;

  if (readonly) {
    if (!favourite) {
      return null;
    }

    return (
      <FavouriteIcon
        favourite={favourite}
        readOnly={true}
        size={sizeMap[size].icon}
      />
    );
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button
          variant="link"
          size="icon"
          aria-pressed={favourite}
          aria-label={
            favourite ? "Remove from favourites" : "Add to favourites"
          }
          onClick={() => mutate(!favourite)}
          className={cn("group", sizeMap[size].button)}
        >
          <FavouriteIcon
            favourite={favourite}
            readOnly={false}
            size={sizeMap[size].icon}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {!favourite ? <p>Add to favourites</p> : <p>Remove from favourites</p>}
      </TooltipContent>
    </Tooltip>
  );
}
