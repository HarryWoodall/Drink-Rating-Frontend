import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

type IconProps = {
  favourite: boolean;
  readOnly?: boolean;
  size: number;
};

export function FavouriteIcon({ favourite, readOnly, size }: IconProps) {
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
