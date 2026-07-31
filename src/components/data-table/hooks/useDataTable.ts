import type { TableConfig } from "../types";
import { useTableState } from "./useTableState";
import { useTableQuery } from "./useTableQuery";

export function useDataTable<T>(config: TableConfig<T>, dataOverride?: T[]) {
  const { state, setState } = useTableState(config.defaultPageSize);
  const query = useTableQuery<T>(config.endpoint, config.queryKey, state);

  const sorting = state.sortBy
    ? [{ id: state.sortBy, desc: state.sortOrder === "desc" }]
    : [];

  const onSortingChange = (updater: unknown) => {
    const next = typeof updater === "function"
      ? updater(sorting)
      : updater;
    const arr = next as Array<{ id: string; desc: boolean }>;
    if (arr.length > 0) {
      setState({ sortBy: arr[0].id, sortOrder: arr[0].desc ? "desc" : "asc" });
    } else {
      setState({ sortBy: undefined, sortOrder: undefined });
    }
  };

  const onPaginationChange = (updater: unknown) => {
    const next = typeof updater === "function"
      ? updater({ pageIndex: state.page - 1, pageSize: state.limit })
      : updater;
    const val = next as { pageIndex: number; pageSize: number };
    setState({ page: val.pageIndex + 1, limit: val.pageSize });
  };

  const onColumnVisibilityChange = (updater: unknown) => {
    const next = typeof updater === "function"
      ? updater(state.columnVisibility)
      : updater;
    setState({ columnVisibility: next as Record<string, boolean> });
  };

  return {
    state,
    setState,
    query,
    dataOverride,
    onSortingChange,
    onPaginationChange,
    onColumnVisibilityChange,
  };
}
