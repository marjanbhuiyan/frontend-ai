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
import { DataTableContext, type DataTableContextValue } from "@/components/data-table/context";
import { useDataTable } from "@/components/data-table/hooks/useDataTable";
import type { TableConfig } from "@/components/data-table/types";

interface DataTableProviderProps<T> {
  config: TableConfig<T>;
  data?: T[];
  /* ADDED: external loading signal from the parent page.
     When provided, overrides the internal query.isLoading so the skeleton
     renders during the parent's fetch lifecycle. */
  externalLoading?: boolean;
  children: ReactNode;
}

export function DataTableProvider<T>({ config, data: dataOverride, externalLoading, children }: DataTableProviderProps<T>) {
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
      /* FIXED: when data is passed directly (dataOverride), the query is
         disabled so query.isLoading stays true forever, causing the skeleton
         to show instead of the actual data. Override to false for direct mode.
         ADDED: externalLoading takes priority — the parent page's useQuery
         owns the loading lifecycle when no endpoint is configured. */
      isLoading: externalLoading ?? (isUsingDirectData ? false : query.isLoading),
      isFetching: externalLoading ?? (isUsingDirectData ? false : query.isFetching),
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
