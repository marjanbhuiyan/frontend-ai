import { useMemo, type ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  type VisibilityState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { DataTableContext, type DataTableContextValue } from "./context";
import { useDataTable } from "./hooks/useDataTable";
import type { TableConfig } from "./types";

interface DataTableProviderProps<T> {
  config: TableConfig<T>;
  data?: T[];
  children: ReactNode;
}

export function DataTableProvider<T>({ config, data: dataOverride, children }: DataTableProviderProps<T>) {
  const {
    state,
    setState,
    query,
    onSortingChange,
    onPaginationChange,
    onColumnVisibilityChange,
  } = useDataTable(config, dataOverride);

  const isUsingDirectData = !!dataOverride;

  const data = dataOverride ?? query.data?.data ?? [];

  const pagination = dataOverride
    ? {
        page: state.page,
        limit: state.limit,
        total: dataOverride.length,
        totalPages: Math.ceil(dataOverride.length / state.limit),
      }
    : query.data?.pagination ?? {
        page: state.page,
        limit: state.limit,
        total: 0,
        totalPages: 0,
      };

  const sorting: SortingState = state.sortBy
    ? [{ id: state.sortBy, desc: state.sortOrder === "desc" }]
    : [];

  const table = useReactTable({
    data,
    columns: config.columns,
    pageCount: pagination.totalPages,
    state: {
      sorting,
      columnVisibility: state.columnVisibility as VisibilityState,
      pagination: { pageIndex: state.page - 1, pageSize: state.limit },
    },
    onSortingChange: onSortingChange as OnChangeFn<SortingState>,
    onPaginationChange: onPaginationChange as OnChangeFn<{ pageIndex: number; pageSize: number }>,
    onColumnVisibilityChange: onColumnVisibilityChange as OnChangeFn<VisibilityState>,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: !isUsingDirectData,
    manualSorting: !isUsingDirectData,
    rowCount: pagination.total,
  });

  const value = useMemo(
    () => ({
      table,
      config,
      state,
      setState,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error as Error | null,
      refetch: query.refetch,
      data,
      pagination,
      bulkActions: config.bulkActions ?? [],
      rowActions: config.rowActions ?? [],
    }),
    [table, config, state, setState, query, data, pagination]
  );

  return (
    <DataTableContext.Provider value={value as unknown as DataTableContextValue<unknown>}>
      {children}
    </DataTableContext.Provider>
  );
}
