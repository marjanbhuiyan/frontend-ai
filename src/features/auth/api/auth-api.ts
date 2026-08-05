import { apiClient } from "@/services/api-client";
import type {
  LoginInput,
  RegisterCredentials,
  AuthResponse,
  RefreshResponse,
} from "@/features/auth/types";


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

export async function refreshTokenApi(): Promise<RefreshResponse> {
  const { data } = await apiClient.post<RefreshResponse>(
    "/auth/refresh",
    {},
    { withCredentials: true }
  );
  return data;
}
