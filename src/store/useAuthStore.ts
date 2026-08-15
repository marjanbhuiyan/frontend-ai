import { create } from "zustand";
import type { User, Menu, StoreInfo, Session, Subscription } from "@/features/auth/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  stores: StoreInfo[];
  menus: Menu[];
  permissions: string[];
  forbiddenRoutes: string[];

  /* Active subscription — used by the onboarding gate to decide whether the
     user must pick a plan before reaching the store step. */
  subscription: Subscription | null;

  isAuthenticated: boolean;

  setSession: (session: Session) => void;
  /* Updates only the subscription (used after subscribing so the onboarding
     gate can advance without rebuilding the whole session). */
  setSubscription: (subscription: Subscription) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
    (set) => ({
      user: null,
      accessToken: null,

      stores: [],
      menus: [],
      permissions: [],
      forbiddenRoutes: [],

      subscription: null,

      isAuthenticated: false,

      setSession: (session) =>
        set({
          user: session.user,
          accessToken: session.accessToken,
          stores: session.stores ?? (session.store ? [session.store] : []),
          menus: session.menus ?? [],
          permissions: session.permissions ?? [],
          forbiddenRoutes: session.forbiddenRoutes ?? [],
          subscription: session.subscription ?? null,

          isAuthenticated: true,
        }),

      setSubscription: (subscription) =>
        set({ subscription }),

      clearSession: () =>
        set({
          user: null,
          accessToken: null,
          stores: [],
          menus: [],
          permissions: [],
          forbiddenRoutes: [],

          subscription: null,

          isAuthenticated: false,
        }),
    })
);