import { useQuery } from "@tanstack/react-query";
import { refreshSession } from "@/app/api/app-init-api";
import { useAuthStore } from "@/store/useAuthStore";

export function useBootstrap() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  return useQuery({
    queryKey: ["bootstrap"],

    queryFn: async () => {
      try {
        const session = await refreshSession();

        setSession(session);

        return session;
      } catch (error) {
        clearSession();
        return null;
      }
    },

    retry: false,
    staleTime: Infinity,
  });
}