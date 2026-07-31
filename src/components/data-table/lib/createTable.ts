import type { TableConfig } from "../types";

export function createTableConfig<T>(config: TableConfig<T>): TableConfig<T> {
  return {
    enableSearch: true,
    enableRowSelection: false,
    enableColumnVisibility: true,
    enablePagination: true,
    enableBulkActions: false,
    enableRowActions: false,
    enableFilters: false,
    enableExport: false,
    enableRefresh: true,
    enableCreate: false,
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    searchPlaceholder: "Search...",
    filters: [],
    bulkActions: [],
    rowActions: [],
    ...config,
  };
}
