import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  getUsersApi,
  getUserByIdApi,
  type UserListParams,
} from "@/features/users/api/users-api";
import type { User } from "@/features/auth/types";
import type { PaginatedResponse } from "@/types";
import { QUERY_KEYS, DEFAULTS } from "@/constants";

export function useUsers(params?: UserListParams): UseQueryResult<PaginatedResponse<User>, Error> {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, params],
    queryFn: () => getUsersApi(params),
    staleTime: DEFAULTS.STALE_TIME,
  });
}

export function useUser(id: string): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, id],
    queryFn: () => getUserByIdApi(id),
    enabled: !!id,
  });
}
