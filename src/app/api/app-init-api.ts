import { apiClient } from "@/services/api-client";

export async function refreshSession(){
  const { data } = await apiClient.get("/auth/refresh");
  return data;
}
