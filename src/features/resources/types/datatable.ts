import type { RowData } from "@tanstack/react-table";
import type { ResourceField } from "@/features/resources/types";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        align?: "left" | "center" | "right";
    }
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataTableResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface DataTableColumn {
  accessorKey: string;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  align?: "left" | "center" | "right";
  cell?: (value: unknown, row: unknown) => React.ReactNode;
}

export interface ListParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export type { ResourceField };
