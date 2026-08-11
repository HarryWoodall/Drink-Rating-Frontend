import { useQuery } from "@tanstack/react-query";
import { fetchFavourites } from "@/services/api";

/** Every drink the signed-in user has favourited. */
export function useFavourites(enabled: boolean) {
  return useQuery({
    queryKey: ["favourites"],
    queryFn: fetchFavourites,
    enabled,
  });
}
