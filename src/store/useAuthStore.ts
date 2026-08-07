import { create } from "zustand";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Store {
  id: number;
  name: string;
}

export interface Menu {
  id: number;
  name: string;
  title: string;
  path: string | null;
  icon?: string;
  parentId: number | null;
  order: number;
  children?: Menu[];
}

export interface Permission {
  id: number;
  name: string;
}

export interface Session {
  user: User;
  accessToken: string;
  stores: Store[];
  menus: Menu[];
  permissions: Permission[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  stores: Store[];
  menus: Menu[];
  permissions: Permission[];

  isAuthenticated: boolean;

  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  stores: [],
  menus: [],
  permissions: [],

  isAuthenticated: false,

  setSession: (session) =>
    set({
      user: session.user,
      accessToken: session.accessToken,
      stores: session.stores,
      menus: session.menus,
      permissions: session.permissions,

      isAuthenticated: true,
    }),

  clearSession: () =>
    set({
      user: null,
      accessToken: null,
      stores: [],
      menus: [],
      permissions: [],

      isAuthenticated: false,
    }),
}));