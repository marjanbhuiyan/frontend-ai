import { z } from "zod";
import { registertSchema, loginSchema } from "@/features/auth/schemas";

 


export interface Session {
  user: User;
  accessToken: string;
  store?: StoreInfo;
  stores?: StoreInfo[];
  menus: Menu[];
  permissions: string[];
  forbiddenRoutes?: string[];
  /* Active subscription returned by /auth/login, /auth/register and
     GET /subscriptions/me. Persisted on the session so the onboarding gate
     (subscription -> create store -> select store) knows the user's plan. */
  subscription?: Subscription;
}

/* Mirror of the backend subscription object. Present on the auth responses and
   on GET /subscriptions/me. `hasSubscription` drives the onboarding gate. */
export interface Subscription {
  hasSubscription: boolean;
  plan: string | null;
  status: string | null;
  expiresAt: string | null;
  currentPeriodEnd: string | null;
}


export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  // roles: string[];
  // permissions: string[];
  // tenant?: TenantInfo;
  // settings?: UserSettings;
}
export interface Store {
  id: string;
  name: string;
  slug: string;
}

export interface Menu {
  id?: string;
  title: string;
  type: "group" | "item" | "collapse";
  api?: string;
  path?: string;
  icon?: string;
  children?: Menu[];
  componentName?: string;
  resourceName?: string;
  badge?: {
    title: string;
    variant: "teal" | "red" | "blue" | "green" | "default";
  };
}

export interface SessionResponse {
  accessToken: string;
  user: User;
  store: Store;
  permissions: string[];
  menus: Menu[];
}


export interface AuthState {
    accessToken?: string;
    user?: User;
    store?: Store;
    permissions: string[];
    menus: Menu[];
    setSession(data: SessionResponse): void;
    clear(): void;
}



export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  locale: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StoreInfo {
  id?: number | null;
  storeId: number;
  storeName: string;
  role?: string;
  logo?: string | null;
}

export interface AuthData {
  accessToken: string;
  user: User;
  permissions: string[];
  menus: Menu[];
  hasStore?: boolean;
  stores?: StoreInfo[];
  forbiddenRoutes?: string[];
}

export type AuthResponse = ApiResponse<AuthData>;


export interface MeData {
  user: User;
  permissions: string[];
  menus: Menu[];
}

export interface AppInitData {
  user: User;
  store: StoreInfo;
  role: {
    id: number;
    name: string;
  };
  permissions: string[];
  menus: Menu[];
  stores?: StoreInfo[];
}

export type AppInitResponse = ApiResponse<AppInitData>;

export interface SelectedStore {
  id: number;
  name: string;
  logo: string | null;
  phone: string | null;
  address: string | null;
  timezone: string;
  currency: string;
  plan: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StoreSelectData {
  storeId?: number;
  accessToken: string;
  user: User;
  permissions: string[];
  menus: Menu[];
  hasStore?: boolean;
  // Select-store returns a SINGLE store object — unlike `/stores/my-stores`
  // which returns a `StoreInfo[]` list — so allow both shapes here.
  stores?: SelectedStore | SelectedStore[];
  forbiddenRoutes?: string[];
}

export type StoreSelectResponse = ApiResponse<StoreSelectData>;

export interface RefreshData {
  accessToken: string;
  user: {
    id: number;
    email: string;
    avatar_url: string | null;
    phone: string | null;
    name: string;
  };
}

export type RefreshResponse = ApiResponse<RefreshData>;

export type RegisterInput = z.input<typeof registertSchema>;
export type LoginInput = z.input<typeof loginSchema>;

