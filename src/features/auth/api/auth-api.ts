import { apiClient } from "@/services/api-client";
import type {
  LoginInput,
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


export async function loginApi(formData: LoginInput){
  const { data } = await apiClient.post("/auth/login",
    formData
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


export async function refreshTokenApi(){
  const { data } = await apiClient.post(
    "/auth/refresh",
    {},
    { withCredentials: true }
  );
  return data;
}
