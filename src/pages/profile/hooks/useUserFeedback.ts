import { useQuery } from "@tanstack/react-query";
import { fetchUserFeedback } from "@/services/api";

export function useUserFeedback() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userFeedback"],
    queryFn: fetchUserFeedback,
  });

  return {
    data: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
