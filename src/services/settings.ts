import { apiClient } from "@/services/api-client";
import type { UserSettings } from "@/features/auth/types";

/**
 * Fetches global / user-level settings from the server.
 *
 * Mock mode: returns simulated data when no backend is available.
 * Replace the mock block with a real API call when your backend is ready:
 *   const { data } = await apiClient.get<UserSettings>("/settings");
 *   return data;
 */
export async function loadSettingsApi(): Promise<UserSettings> {
  // ── Mock mode (remove when backend is connected) ──────────────────────
  if (
    import.meta.env.VITE_USE_MOCK === "true" ||
    !import.meta.env.VITE_API_BASE_URL
  ) {
    await simulateNetworkDelay(200);
    console.log("[mock] loadSettingsApi called");
    return {
      theme: "system",
      locale: "en",
    };
  }

  // ── Real API call ─────────────────────────────────────────────────────
  const { data } = await apiClient.get<UserSettings>("/settings");
  return data;
}

/* ── internal helper ────────────────────────────────────────────────────── */
function simulateNetworkDelay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
