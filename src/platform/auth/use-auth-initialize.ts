import { useEffect, useState } from "react";
import { api } from "@/platform/api/axios";
import { useAuthStore } from "@/platform/auth/auth.store";
import type { RetryConfig } from "@/platform/api/axios";


interface AuthInitializationResult {
  initialized: boolean;
  authenticated: boolean;
}

export function useAuthInitialize() {
  const setAccessToken = useAuthStore(
      (state) => state.setAccessToken,
    );

  const clearAuth = useAuthStore(
      (state) => state.clearAuth,
    );

  const accessToken = useAuthStore(
      (state) => state.accessToken,
    );

  const [ initialized, setInitialized ] = useState(false);

  const [ authenticated, setAuthenticated ] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        /*
         * CASE 1
         *
         * Access token exists.
         *
         * Let /bootstrap use it.
         * If expired, Axios interceptor
         * will automatically refresh it.
         */
        if (accessToken) {
          if (mounted) {
            setAuthenticated(true);

            setInitialized(true);
          }

          return;
        }

        /*
         * CASE 2
         *
         * No access token.
         *
         * Try refresh cookie.
         */
        const response = await api.post("/auth/refresh",
            {},
            {
              withCredentials:
                true,

              _skipAuthRefresh:
                true,
            } as RetryConfig,
          );

        const newToken = response.data
            ?.data
            ?.accessToken;

        if (!newToken) {
          throw new Error(
            "No access token returned from refresh",
          );
        }

        setAccessToken(
          newToken,
        );

        if (mounted) {
          setAuthenticated(
            true,
          );
        }
      } catch {
        clearAuth();

        if (mounted) {
          setAuthenticated(
            false,
          );
        }
      } finally {
        if (mounted) {
          setInitialized(
            true,
          );
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [
    accessToken,
    clearAuth,
    setAccessToken,
  ]);

  return {
    initialized,
    authenticated,
  };
}