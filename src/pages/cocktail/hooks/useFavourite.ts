import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addFavourite, removeFavourite } from "@/services/api";
import type { CocktailDetail } from "@/types/cocktail";

/**
 * Toggles a drink's favourite flag. The star flips immediately and rolls back
 * if the request fails, so the button never lags behind the click.
 */
export function useToggleFavourite(drinkId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favourite: boolean) =>
      favourite ? addFavourite(drinkId) : removeFavourite(drinkId),

    onMutate: async (favourite) => {
      await queryClient.cancelQueries({ queryKey: ["cocktail"] });

      const previous = queryClient.getQueriesData<CocktailDetail>({
        queryKey: ["cocktail"],
      });

      queryClient.setQueriesData<CocktailDetail>(
        { queryKey: ["cocktail"] },
        (old) =>
          old && old.idDrink === drinkId ? { ...old, favourite } : old,
      );

      return { previous };
    },

    onError: (_error, _favourite, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error("Couldn't update your favourites");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cocktail"] });
    },
  });
}
