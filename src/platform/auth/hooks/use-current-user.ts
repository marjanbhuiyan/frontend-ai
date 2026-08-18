import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/platform/auth/api/me-api";
import { useAuthStore } from "@/platform/auth/stores/auth.store";

export function useCurrentUser() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,

    enabled: !!accessToken,

    staleTime: 10 * 60 * 1000,
  });
}