import { api } from "@/platform/api/axios";

import type {AppBootstrapResponse, AppBootstrapApiResponse} from "@/types/app.types";

export async function getAppBootstrap(): Promise<AppBootstrapResponse> {
  const response = await api.get<AppBootstrapApiResponse>( "/app/bootstrap");
  return response.data.data;
}