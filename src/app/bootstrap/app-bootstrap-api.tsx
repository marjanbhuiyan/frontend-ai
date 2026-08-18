import { api } from "@/platform/api/axios";
import type { AppBootstrapResponse } from "@/types/app.types";

export async function getAppBootstrap(): Promise<AppBootstrapResponse> {
  const response =
    await api.get(
      "/app/bootstrap",
    );

  return response.data.data;
}
// GET /app/bootstrap?storeId=5