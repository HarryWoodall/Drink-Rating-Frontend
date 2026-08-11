import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addFavourite, removeFavourite } from "@/services/api";
import type { DbDrinkDetails, DrinkDetail } from "@/types/cocktail";

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
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["cocktail"] }),
        queryClient.cancelQueries({ queryKey: ["favourites"] }),
      ]);

      const previous = [
        ...queryClient.getQueriesData<DrinkDetail>({
          queryKey: ["cocktail"],
        }),
        ...queryClient.getQueriesData<DbDrinkDetails[]>({
          queryKey: ["favourites"],
        }),
      ];

      queryClient.setQueriesData<DrinkDetail>(
        { queryKey: ["cocktail"] },
        (old) => (old && old.idDrink === drinkId ? { ...old, favourite } : old),
      );

      // Flip the flag in place rather than dropping the drink, so a card on the
      // favourites page stays put and the click can be undone.
      queryClient.setQueriesData<DbDrinkDetails[]>(
        { queryKey: ["favourites"] },
        (old) =>
          old?.map((drink) =>
            drink.idDrink === drinkId ? { ...drink, favourite } : drink,
          ),
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
      queryClient.invalidateQueries({
        queryKey: ["favourites"],
      });
    },
  });
}
