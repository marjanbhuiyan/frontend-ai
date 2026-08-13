import { Eye, Pencil, Trash2 } from "lucide-react";
import { userColumns } from "./users.columns";
import type { User } from "@/features/users/types";

export const usersTableConfig = {
  title: "Users",
  columns: userColumns,
  // Server mode — the generic DataTable fetches this endpoint on mount with
  // page/limit/search/sort params, instead of rendering static mock data.
  // queryKey matches the QUERY_KEYS.USERS convention.
  endpoint: "/users",
  queryKey: "users",
  enableSearch: true,
  enableRowSelection: true,
  enableColumnVisibility: true,
  enableBulkActions: true,
  enableFilters: true,
  enablePagination: true,
  enableRowActions: true,
  /* ── Enabled export to show download icon button, matching the image ── */
  enableExport: true,
  enableRefresh: true,
  /* ── Show and Hide add button  ── */
  enableCreate: false,
  /* ── Updated placeholder to show dynamic record count ── */
  searchPlaceholder: `Search records...`,
  createButtonLabel: "Add Customer",
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50],
  rowActions: [
    {
      label: "View",
      icon: Eye,
      onClick: (user: User) => console.log("View user:", user.id),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: (user: User) => console.log("Edit user:", user.id),
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive" as const,
      onClick: (user: User) => console.log("Delete user:", user.id),
    },
  ],
};
