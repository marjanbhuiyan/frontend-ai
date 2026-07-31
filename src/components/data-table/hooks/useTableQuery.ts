import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import type { TableResponse, TableState } from "../types";
import { buildQueryParams } from "../lib/queryParams";

export function useTableQuery<T>(
  endpoint: string | undefined,
  queryKey: string | undefined,
  state: TableState
): UseQueryResult<TableResponse<T>, Error> {
  const enabled = !!endpoint && !!queryKey;

  return useQuery({
    queryKey: enabled ? [queryKey, state] : ["__noop__"],
    queryFn: async () => {
      if (!endpoint) throw new Error("No endpoint configured");
      const params = buildQueryParams(state);
      const { data } = await apiClient.get<TableResponse<T>>(endpoint, { params });
      return data;
    },
    enabled,
  });
}
