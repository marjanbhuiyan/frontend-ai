import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import type { TableResponse, TableState, PaginationMeta } from "../types";
import { buildQueryParams } from "../lib/queryParams";

// Resolve the response body to the stable `{ data, pagination }` shape the
// DataTableProvider consumes. Handles both conventions seen across the app:
//  1. unwrapped  -> { data: rows, meta }            (AppListResponse)
//  2. wrapped    -> { statusCode, data: { data, meta }, message, success }
function normalizeBody<T>(
  body: TableResponse<T> & { meta?: PaginationMeta },
  fallback: PaginationMeta
): TableResponse<T> {
  // Detect the shared ApiResponse wrapper: its `data` is an object
  // (the paginated payload) rather than the rows array itself.
  const isWrapped =
    body &&
    typeof body.data === "object" &&
    body.data !== null &&
    !Array.isArray(body.data) &&
    ("data" in body.data || "meta" in body.data || "pagination" in body.data);

  const payload = (
    isWrapped
      ? (body.data as { data?: T[]; meta?: PaginationMeta; pagination?: PaginationMeta })
      : (body as { data?: T[]; meta?: PaginationMeta; pagination?: PaginationMeta })
  );

  const rows: T[] = Array.isArray(payload?.data) ? payload.data : [];
  const pagination: PaginationMeta =
    payload?.pagination ??
    payload?.meta ??
    {
      page: fallback.page,
      limit: fallback.limit,
      total: rows.length,
      totalPages: Math.max(1, Math.ceil(rows.length / fallback.limit)),
    };

  return { data: rows, pagination };
}

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
      const { data } = await apiClient.get<
        TableResponse<T> & { meta?: PaginationMeta }
      >(endpoint, { params });
      return normalizeBody<T>(data, {
        page: state.page,
        limit: state.limit,
        total: 0,
        totalPages: 0,
      });
    },
    enabled,
  });
}
