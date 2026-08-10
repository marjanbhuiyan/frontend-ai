import { useEffect, useRef } from "react";
import { refreshSession } from "@/app/api/app-api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/lib/toast";

export function useRefreshSession() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const { accessToken } = useAuthStore.getState();
    if (accessToken) return;

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
        toast.error("Session expired");
      }
    }

    run();
  }, [setSession, clearSession]);
}
