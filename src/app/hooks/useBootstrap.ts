import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function useBootstrap() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      clearSession();
    }
  }, [clearSession]);

  return { isPending: false };
}