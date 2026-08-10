import { apiClient } from "@/services/api-client";
import type { ApiResponse, StoreInfo, StoreSelectResponse } from "@/features/auth/types";
import type { CreateStoreForm } from "../types";

// export interface CreateStorePayload {
//   name: string;
// }

// export interface StoreResponse {
//   id: number;
//   name: string;
// }

// export async function createStoreApi(payload: CreateStorePayload): Promise<ApiResponse<StoreResponse>> {
//   const { data } = await apiClient.post<ApiResponse<StoreResponse>>("/stores", payload);
//   return data;
// }

/**
 * Returns every store the current user has access to. Used to populate the
 * store switcher in the dashboard header.
 */
export async function getStoresApi(): Promise<ApiResponse<StoreInfo[]>> {
  const { data } = await apiClient.get<ApiResponse<StoreInfo[]>>("/stores");
  return data;
}

/**
 * Returns every store the current user has access to (used by the store
 * switcher in the dashboard header when the dropdown is opened).
 */
export async function getMyStoresApi(): Promise<ApiResponse<StoreInfo[]>> {
  const { data } = await apiClient.get<ApiResponse<StoreInfo[]>>("/stores/my-stores");
  return data;
}

/**
 * Selects a store and returns a new session (access token, user, menus,
 * permissions) scoped to that store.
 */
export async function selectStoreApi(storeId: number): Promise<StoreSelectResponse> {
  const { data } = await apiClient.post<StoreSelectResponse>("/auth/select-store", { storeId });
  return data;
}

/* -------------------------------------------------------------------------- */
/* Detailed store creation (onboarding modal)                                 */
/* -------------------------------------------------------------------------- */

// export interface CreateStoreDetailedPayload {
//   name: string;
//   phone?: string;
//   address?: string;
//   currency?: string;
//   logo?: File | null;
// }

// export interface CreateStoreDetailedData {
//   accessToken: string;
//   user: { id: number };
//   hasStore: boolean;
//   stores: StoreInfo[];
// }

/**
 * Creates a store with full onboarding details (name, logo, phone, address,
 * currency). Sent as multipart/form-data since the backend only persists
 * the logo when it's uploaded as a file (a plain URL string is ignored).
 *
 * On success the backend also rotates the session and returns a fresh
 * access token, since the previous token was scoped to "no store".
 */
export async function createStoredApi(payload: CreateStoreForm){
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("phone", payload.phone);
  formData.append("address", payload.address);
  if (payload.logo) formData.append("logo", payload.logo);

  const { data } = await apiClient.post(
    "/stores",
    formData,
  );
  return data;
}
