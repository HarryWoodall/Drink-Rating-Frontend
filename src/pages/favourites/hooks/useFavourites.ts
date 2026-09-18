import { fetchFavourites } from "@/services/favouritesService";
import { useQuery } from "@tanstack/react-query";

/** Every drink the signed-in user has favourited. */
export function useFavourites(enabled: boolean) {
  return useQuery({
    queryKey: ["favourites"],
    queryFn: fetchFavourites,
    enabled,
  });
}
