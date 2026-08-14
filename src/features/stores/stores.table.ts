import { Eye, Pencil, Trash2 } from "lucide-react";
import { storeColumns } from "./stores.columns";
import type { StoreRow } from "./types";

/* Store list table config — mirrors the users table config pattern.
   No `endpoint`/`queryKey` because store data comes from useAuthStore
   (passed via the DataTable `data` prop), not from a paginated API. */
export const storesTableConfig = {
  title: "Stores",
  columns: storeColumns,
  /* ── OLD (client-side mode): no endpoint — data was passed directly via the
       DataTable `data` prop. Client-side mode triggered a TanStack mount-time
       page-clamp setState → syncStateToURL → window.history.replaceState that
       threw "DOMException: The operation is insecure" and crashed the page. ── */
  // /* ── No endpoint — data is passed directly from useAuthStore ── */
  /* ── NEW (server mode): fetch /stores/my-stores like the Users table does
       with /users. useTableQuery.normalizeBody unwraps the `{ data: [...] }`
       array and computes pagination client-side, so no backend change is
       needed. Server mode keeps manualPagination=true, which prevents the
       mount-time clamp that caused the crash. ── */
  endpoint: "/stores/my-stores",
  queryKey: "my-stores",
  enableSearch: true,
  enableRowSelection: true,
  enableColumnVisibility: true,
  enableBulkActions: true,
  enableFilters: true,
  enablePagination: true,
  enableRowActions: true,
  enableExport: true,
  enableRefresh: true,
  enableCreate: false,
  searchPlaceholder: "Search stores...",
  createButtonLabel: "Add Store",
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50],
  /* ── Bulk actions for selected store rows ── */
  bulkActions: [
    {
      label: "Delete selected",
      icon: Trash2,
      action: (rows: { original: StoreRow }[]) => {
        console.log("Delete selected stores:", rows.map((r) => r.original.storeId));
      },
    },
  ],
  /* ── Row actions — View (primary/inline), Edit + Delete (kebab dropdown) ── */
  rowActions: [
    {
      label: "View",
      icon: Eye,
      primary: true,
      onClick: (store: StoreRow) => console.log("View store:", store.storeId),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: (store: StoreRow) => console.log("Edit store:", store.storeId),
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive" as const,
      onClick: (store: StoreRow) => console.log("Delete store:", store.storeId),
    },
  ],
};
