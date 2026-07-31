import { apiClient } from "@/services/api-client";

/**
 * Permissions returned from the server for the current user.
 */
export interface UserPermissions {
  roles: string[];
  permissions: string[];
}

/**
 * Fetches the current user's roles and permissions.
 *
 * Mock mode: returns simulated data when no backend is available.
 * Replace the mock block with a real API call when your backend is ready:
 *   const { data } = await apiClient.get<UserPermissions>("/auth/permissions");
 *   return data;
 */
export async function loadPermissionsApi(
  userId: string
): Promise<UserPermissions> {
  // ── Mock mode (remove when backend is connected) ──────────────────────
  if (import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_BASE_URL) {
    await simulateNetworkDelay(300);
    console.log("[mock] loadPermissionsApi called for userId:", userId);
    return {
      roles: ["admin", "editor"],
      permissions: [
        "users:read",
        "users:write",
        "products:read",
        "products:write",
        "orders:read",
        "orders:write",
        "settings:manage",
      ],
    };
  }

  // ── Real API call ─────────────────────────────────────────────────────
  const { data } = await apiClient.get<UserPermissions>(
    `/auth/permissions`,
    { params: { userId } }
  );
  return data;
}

/* ── internal helper ────────────────────────────────────────────────────── */
function simulateNetworkDelay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
