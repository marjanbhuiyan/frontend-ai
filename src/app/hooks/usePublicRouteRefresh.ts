import { useEffect, useRef } from "react";
import { getToken } from "@/utils/token";
import { refreshSession } from "@/app/api/app-api";
import { useAuthStore } from "@/store/useAuthStore";

export function usePublicRouteRefresh() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    // If zustand already has an access token, don't refresh and don't check localStorage.
    if (useAuthStore.getState().accessToken) return;

    // Otherwise refresh only when an access token exists in localStorage.
    if (!getToken()) return;

    async function run() {
      try {
        const session = await refreshSession();
        const { data } = session;
        setSession({
          accessToken: data.accessToken,
          user: data.user,
          stores: Array.isArray(data.stores) ? data.stores : data.stores ? [data.stores] : [],
          permissions: data.permissions ?? [],
          menus: data.menus ?? [],
        });
      } catch (error) {
        clearSession();
      }
    }

    run();
  }, [setSession, clearSession]);
}
