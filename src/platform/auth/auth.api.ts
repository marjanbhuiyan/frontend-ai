import { api } from "@/platform/api/axios";
import type { AuthResponse, LoginCredentials, LoginResponse, RegisterCredentials } from "@/platform/auth/auth.types";


export async function loginApi( payload: LoginCredentials ) : Promise<LoginResponse> {
  const response = await api.post<AuthResponse>( "/auth/login", payload );
  return response.data.data;
}

export async function registerApi( payload: RegisterCredentials ) : Promise<LoginResponse> {
  const response = await api.post<AuthResponse>( "/auth/register", payload );
  return response.data.data;
}

export async function logoutApi() {
  await api.post( "/auth/logout" );
}

export async function refreshApi() {
  const response = await api.post( "/auth/refresh",
      {},
    );

  return response.data.data;
}