import { useQuery } from "@tanstack/react-query";
import { getAppBootstrap } from "@/app/bootstrap/app-bootstrap-api";
import { queryKeys } from "@/platform/query/query-keys";
import { useAuthStore } from "@/platform/auth/auth.store";

export function useAppBootstrap() {
  const accessToken = useAuthStore( (state) => state.accessToken );

  return useQuery({
    queryKey:
      queryKeys.app.bootstrap,

    queryFn:
      getAppBootstrap,

    enabled:
      !!accessToken,

    staleTime:
      5 * 60 * 1000,

    gcTime:
      30 * 60 * 1000,
      
    retry: false,
  });
}