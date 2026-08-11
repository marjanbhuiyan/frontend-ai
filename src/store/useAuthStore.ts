import { create } from "zustand";
import type { User, Menu, StoreInfo } from "@/features/auth/types";

export interface Session {
  user: User;
  accessToken: string;
  store?: StoreInfo;
  stores?: StoreInfo[];
  menus: Menu[];
  permissions: string[];
  forbiddenRoutes?: string[];
}

export type { User, Menu, StoreInfo };

interface AuthState {
  user: User | null;
  accessToken: string | null;
  stores: StoreInfo[];
  menus: Menu[];
  permissions: string[];
  forbiddenRoutes: string[];

  isAuthenticated: boolean;

  setSession: (session: Session) => void;
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

      isAuthenticated: false,

      setSession: (session) =>
        set({
          user: session.user,
          accessToken: session.accessToken,
          stores: session.stores ?? (session.store ? [session.store] : []),
          menus: session.menus ?? [],
          permissions: session.permissions ?? [],
          forbiddenRoutes: session.forbiddenRoutes ?? [],

          isAuthenticated: true,
        }),

      clearSession: () =>
        set({
          user: null,
          accessToken: null,
          stores: [],
          menus: [],
          permissions: [],
          forbiddenRoutes: [],

          isAuthenticated: false,
        }),
    })
);