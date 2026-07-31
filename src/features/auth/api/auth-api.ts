import { apiClient } from "@/services/api-client";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "@/features/auth/types";

/**
 * Helper: true when no real backend is configured.
 */
function isMockMode(): boolean {
  return (
    import.meta.env.VITE_USE_MOCK === "true" ||
    !import.meta.env.VITE_API_BASE_URL
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Endpoints                                 */
/* -------------------------------------------------------------------------- */

export async function loginApi(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  return data;
}

export async function registerApi(formData: FormData) {
  const { data } = await apiClient.post("/auth/register", formData);
  return data;
}

export async function logoutApi(): Promise<void> {
  const { data } = await apiClient.post("/auth/logout");
  return data;
}

export async function getMeApi(): Promise<AuthResponse> {
  const { data } = await apiClient.get<AuthResponse>("/auth/me");
  return data;
}


export async function refreshTokenApi(): Promise<{ token: string }> {
  if (isMockMode()) {
    console.log("[mock] refreshTokenApi called");
    return { token: "mock-refreshed-token-" + Date.now() };
  }

  const { data } = await apiClient.post<{ token: string }>(
    "/auth/refresh",
    {},
    { withCredentials: true }
  );
  return data;
}
