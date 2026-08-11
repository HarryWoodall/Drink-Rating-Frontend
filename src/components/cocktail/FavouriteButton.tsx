import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CocktailDetail } from "@/types/cocktail";
import { useToggleFavourite } from "@/pages/cocktail/hooks/useFavourite";
import { authClient } from "@/lib/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Size = keyof typeof sizeMap;

type FavouriteButtonProps = {
  cocktail: CocktailDetail;
  readonly?: boolean;
  size?: Size;
};

type IconProps = {
  favourite: boolean;
  readOnly?: boolean;
  size: number;
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

function Icon({ favourite, readOnly, size }: IconProps) {
  return (
    <Heart
      size={size}
      className={cn(
        "transition-colors [filter:drop-shadow(2px_3px_3px_rgba(50,0,0,0.8))]",
        favourite && "fill-current text-rose-700",
        favourite &&
          !readOnly &&
          "group-hover:fill-none group-hover:text-secondary",
        !favourite && "text-secondary",
        !favourite &&
          !readOnly &&
          "group-hover:fill-current group-hover:text-rose-700",
      )}
    />
  );
}

export function FavouriteButton({
  cocktail,
  readonly = false,
  size = "lg",
}: FavouriteButtonProps) {
  const favourite = cocktail.favourite ?? false;
  const { mutate } = useToggleFavourite(cocktail.idDrink);
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) return null;

  if (readonly) {
    if (!favourite) {
      return null;
    }

    return (
      <Icon favourite={favourite} readOnly={true} size={sizeMap[size].icon} />
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
          <Icon
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
