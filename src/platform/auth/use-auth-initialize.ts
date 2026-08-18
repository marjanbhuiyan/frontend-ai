// src/platform/auth/use-auth-initialize.ts

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useAuthStore,
} from "./auth.store";

const API_URL =
  import.meta.env.VITE_API_URL;

export function useAuthInitialize() {
  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken,
    );

  const setAccessToken =
    useAuthStore(
      (state) =>
        state.setAccessToken,
    );

  const clearAuth =
    useAuthStore(
      (state) =>
        state.clearAuth,
    );

  const [
    initialized,
    setInitialized,
  ] = useState(false);

  const [
    authenticated,
    setAuthenticated,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        /*
         * Access token exists.
         *
         * We assume the session can be
         * authenticated and allow
         * bootstrap to verify it.
         */
        if (accessToken) {
          if (!mounted) return;

          setAuthenticated(true);
          setInitialized(true);

          return;
        }

        /*
         * No access token:
         *
         * try refresh-token cookie.
         */
        const response =
          await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            {
              withCredentials:
                true,
            },
          );

        const newAccessToken =
          response.data?.data
            ?.accessToken;

        if (!newAccessToken) {
          throw new Error(
            "Refresh token invalid",
          );
        }

        setAccessToken(
          newAccessToken,
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
    setAccessToken,
    clearAuth,
  ]);

  return {
    initialized,
    authenticated,
  };
}