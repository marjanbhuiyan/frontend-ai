import type { ColumnDef, Row } from "@tanstack/react-table";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TableResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: "select" | "multi-select" | "date-range" | "text";
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface BulkAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive" | "outline";
  action: (rows: Row<T>[]) => void | Promise<void>;
  requireConfirmation?: boolean;
  confirmationMessage?: string;
  permission?: string;
}

export interface RowAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
  onClick: (row: T) => void | Promise<void>;
  permission?: string;
}

export interface TableState {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters: Record<string, string | string[] | undefined>;
  columnVisibility: Record<string, boolean>;
}

export interface TableConfig<T> {
  endpoint?: string;
  queryKey?: string;
  title: string;
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  enableSearch?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  enableBulkActions?: boolean;
  enableRowActions?: boolean;
  enableFilters?: boolean;
  enableExport?: boolean;
  enableRefresh?: boolean;
  enableCreate?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  filters?: FilterConfig[];
  bulkActions?: BulkAction<T>[];
  rowActions?: RowAction<T>[];
  onCreate?: () => void;
  createButtonLabel?: string;
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filterType?: "select" | "multi-select" | "date-range" | "text";
    filterOptions?: { label: string; value: string }[];
    filterLabel?: string;
  }
}
