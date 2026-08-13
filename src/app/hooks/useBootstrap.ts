import { useQuery } from "@tanstack/react-query";
import { refreshSession } from "@/app/api/app-api";
import { useAuthStore } from "@/store/useAuthStore";

export function useBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);

  return useQuery({
    queryKey: ["bootstrap"],

    queryFn: async () => {
      const session = await refreshSession();
      const { data } = session;
      setSession({
        accessToken: data.accessToken,
        user: data.user,
        stores: Array.isArray(data.stores)
          ? data.stores
          : data.stores
            ? [data.stores]
            : [],
        permissions: data.permissions ?? [],
        menus: data.menus ?? [],
      });

      return session;
    },

    retry: false,

    staleTime: Infinity,
  });
}