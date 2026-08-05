import { z } from "zod";
import { registertSchema, loginSchema } from "@/features/auth/schemas";

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  avatar?: string;
  tenant?: TenantInfo;
  settings?: UserSettings;
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
}

export type AuthResponse = ApiResponse<AuthData>;

export interface Menu {
  id?: string;
  title: string;
  type: "group" | "item" | "collapse";
  route?: string;
  url?: string;
  icon?: string;
  children?: Menu[];
  componentName?: string;
  resourceName?: string;
  badge?: {
    title: string;
    variant: "teal" | "red" | "blue" | "green" | "default";
  };
}

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

export interface StoreSelectData {
  accessToken: string;
  newUser: {
    id: number;
    email: string;
    avatar_url: string | null;
    phone: string | null;
    name: string;
  };
  store: StoreInfo;
  menus: Menu[];
  permissions: string[];
}

export type StoreSelectResponse = ApiResponse<StoreSelectData>;

export type RegisterInput = z.input<typeof registertSchema>;
export type LoginInput = z.input<typeof loginSchema>;

