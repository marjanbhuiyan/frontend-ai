import { apiClient } from "@/services/api-client";
import type { MenuResponse } from "@/features/menus/types";

// ── Mock mode (removed — menus are now permission/store scoped server-side,
//    returned by the login / store-select / /auth/me session payloads) ─────
// function isMockMode(): boolean {
//   return (
//     import.meta.env.VITE_USE_MOCK === "true" ||
//     !import.meta.env.VITE_API_BASE_URL
//   );
// }

// function demoMenus(): Menu[] {
//   ...
// }

export async function getMenus(): Promise<MenuResponse> {
  const { data } = await apiClient.get<MenuResponse>("/menus");
  return data;
}
