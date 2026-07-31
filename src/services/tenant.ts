import { apiClient } from "@/services/api-client";
import type { TenantInfo } from "@/features/auth/types";

/**
 * Fetches the tenant / company configuration for the current user.
 *
 * Mock mode: returns simulated data when no backend is available.
 * Replace the mock block with a real API call when your backend is ready:
 *   const { data } = await apiClient.get<TenantInfo>(`/tenants/${tenantId}`);
 *   return data;
 */
export async function loadTenantApi(
  tenantId: string
): Promise<TenantInfo> {
  // ── Mock mode (remove when backend is connected) ──────────────────────
  if (import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_BASE_URL) {
    await simulateNetworkDelay(250);
    console.log("[mock] loadTenantApi called for tenantId:", tenantId);
    return {
      id: tenantId,
      name: "Acme Corporation",
      slug: "acme-corp",
    };
  }

  // ── Real API call ─────────────────────────────────────────────────────
  const { data } = await apiClient.get<TenantInfo>(
    `/tenants/${tenantId}`
  );
  return data;
}

/* ── internal helper ────────────────────────────────────────────────────── */
function simulateNetworkDelay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
