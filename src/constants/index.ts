export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  UNAUTHORIZED: "/unauthorized",
} as const;

export const QUERY_KEYS = {
  ME: ["me"] as const,
  USERS: ["users"] as const,
} as const;

export const DEFAULTS = {
  LOCALE: "en",
  THEME: "system" as const,
  STALE_TIME: 30 * 1000,       // 30 seconds
  GC_TIME: 10 * 60 * 1000,     // 10 minutes
  ME_STALE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;
