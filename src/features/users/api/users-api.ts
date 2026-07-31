import { apiClient } from "@/services/api-client";
import type { User } from "@/features/auth/types";
import type { PaginatedResponse } from "@/types";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Endpoints                                 */
/* -------------------------------------------------------------------------- */

export async function getUsersApi(
  params?: UserListParams
): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>("/users", {
    params,
  });
  return data;
}

export async function getUserByIdApi(id: string): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${id}`);
  return data;
}
