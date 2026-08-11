import { useQuery } from "@tanstack/react-query";
import { refreshSession } from "@/app/api/app-api";
import { useAuthStore } from "@/store/useAuthStore";

export function useBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);

  return useQuery({
    queryKey: ["bootstrap"],

    queryFn: async () => {
      const session = await refreshSession();

      setSession(session);

      return session;
    },

    retry: false,

    staleTime: Infinity,
  });
}