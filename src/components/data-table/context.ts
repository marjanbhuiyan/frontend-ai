import { createContext, useContext } from "react";
import type { Table } from "@tanstack/react-table";
import type { TableConfig, TableState, BulkAction, RowAction, PaginationMeta } from "./types";

export interface DataTableContextValue<T> {
  table: Table<T>;
  config: TableConfig<T>;
  state: TableState;
  setState: (updater: Partial<TableState> | ((prev: TableState) => TableState)) => void;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
  data: T[];
  pagination: PaginationMeta;
  bulkActions: BulkAction<T>[];
  rowActions: RowAction<T>[];
}

export const DataTableContext = createContext<DataTableContextValue<unknown> | null>(null);

export function useDataTableContext<T>(): DataTableContextValue<T> {
  const ctx = useContext(DataTableContext);
  if (!ctx) {
    throw new Error("useDataTableContext must be used within a DataTableProvider");
  }
  return ctx as unknown as DataTableContextValue<T>;
}
