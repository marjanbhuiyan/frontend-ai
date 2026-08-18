import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;

  setAccessToken: (
    accessToken: string,
  ) => void;

  clearAuth: () => void;
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({
        accessToken: null,

        setAccessToken: (accessToken) => {
          set({
            accessToken,
          });
        },

        clearAuth: () => {
          set({
            accessToken: null,
          });
        },
      }),
      {
        name: "auth-storage",

        partialize: (state) => ({
          accessToken: state.accessToken,
        }),
      },
    ),
  );