export type UserType = "global" | "store";
import type { ApiResponse } from "@/platform/auth/auth.types";

export interface Role {
  id: number;
  name: string;
  slug: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;

  type: UserType;

  role: Role;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface Subscription {
  active: boolean;
  plan: string | null;
  expiresAt: string | null;
}

export interface StoreContext {
  store: Store;
  role: Role;
  permissions: string[];
}

export interface FeatureFlags {
  [key: string]: boolean;
}

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  permission?: string;
  feature?: string;
  children?: NavigationItem[];
}

export type AppBootstrapResponse = {
  user: User;
  accountType: UserType;
  globalRole: Role;
  subscription: Subscription | null;
  stores: Store[];
  activeStore: Store | null;
  storeRole: Role | null;
  permissions: string[];
  navigation: NavigationItem[];
  features: FeatureFlags;
};


export type AppBootstrapApiResponse = ApiResponse<AppBootstrapResponse>;
