import { apiClient } from "@/lib/api/axios";

export async function initAppApi(){
  const { data } = await apiClient.get("/app/init");
  return data;
}
