import { apiClient } from "@/services/api-client";

export async function initAppApi(){
  const { data } = await apiClient.get("/app/init");
  return data;
}
