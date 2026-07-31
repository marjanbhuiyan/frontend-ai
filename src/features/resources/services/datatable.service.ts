import { apiClient } from "@/services/api-client";
import { getResourceData } from "@/features/resources/api/resource-api";
import type {
  DataTableResponse,
  ListParams,
} from "@/features/resources/types/datatable";

/**
 * Helper: true when no real backend is configured.
 */
function isMockMode(): boolean {
  return (
    import.meta.env.VITE_USE_MOCK === "true" ||
    !import.meta.env.VITE_API_BASE_URL
  );
}

function resourceNameFromEndpoint(endpoint: string): string {
  return endpoint.replace(/^\//, "").split("/")[0];
}

function toPaginatedResponse<T extends Record<string, unknown>>(
  rows: T[],
  total: number,
  params: ListParams
): DataTableResponse<T> {
  return {
    data: rows,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    },
  };
}

async function fetchMock<T extends Record<string, unknown>>(
  endpoint: string,
  params: ListParams
): Promise<DataTableResponse<T>> {
  const { data } = await getResourceData(
    resourceNameFromEndpoint(endpoint),
    { ...params }
  );

  let rows = data as T[];

  if (params.search) {
    const q = params.search.toLowerCase();
    rows = rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "").toLowerCase().includes(q)
      )
    );
  }

  if (params.sortBy) {
    const { sortBy, sortOrder = "asc" } = params;
    rows = [...rows].sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av == null || bv == null) return 0;
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortOrder === "desc" ? -cmp : cmp;
    });
  }

  const start = (params.page - 1) * params.limit;
  const pageRows = rows.slice(start, start + params.limit);

  return toPaginatedResponse(pageRows, rows.length, params);
}

/**
 * Fetch a paginated, searchable, sortable list for a resource endpoint.
 * Uses demo data when no backend is configured.
 */
export async function fetchResource<T extends Record<string, unknown>>(
  endpoint: string,
  params: ListParams
): Promise<DataTableResponse<T>> {
  if (isMockMode()) {
    return fetchMock<T>(endpoint, params);
  }

  const { data } = await apiClient.get<DataTableResponse<T>>(endpoint, {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  });
  return data;
}
