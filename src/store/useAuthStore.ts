import { create } from "zustand";
import type { AuthState } from "@/features/auth/types";


export const useAuthStore = create<AuthState>((set) => ({
  accessToken: undefined,
  user: undefined,
  store: undefined,
  permissions: [],
  menus: [],
  setSession: (data) =>
    set(() => ({
      accessToken: data.accessToken,
      user: data.user,
      store: data.store,
      permissions: data.permissions,
      menus: data.menus,
    })),
  clear: () => set(() => ({ accessToken: undefined, user: undefined, store: undefined, permissions: [], menus: [] })),
}));
