import { useQuery } from "@tanstack/react-query";
import { fetchResource } from "@/features/resources/services/datatable.service";
import type {
    DataTableResponse,
    ListParams,
} from "@/features/resources/types/datatable";

export interface UseDataTableParams {
    endpoint: string;
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export function useDataTable<T extends Record<string, unknown>>({
    endpoint,
    page,
    limit,
    search,
    sortBy,
    sortOrder,
}: UseDataTableParams) {
    const params: ListParams = { page, limit, search, sortBy, sortOrder };

    return useQuery<DataTableResponse<T>>({
        queryKey: [endpoint, "list", params],
        queryFn: () => fetchResource<T>(endpoint, params),
        enabled: !!endpoint,
        placeholderData: (prev) => prev,
    });
}
