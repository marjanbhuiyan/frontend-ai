import { Eye, Pencil, Trash2 } from "lucide-react";
import { userColumns } from "./users.columns";
import type { User } from "./types";

export const usersTableConfig = {
  title: "Users ss",
  columns: userColumns,
  enableSearch: true,
  enableRowSelection: true,
  enableColumnVisibility: true,
  enablePagination: true,
  enableRowActions: true,
  enableExport: false,
  enableRefresh: false,
  enableCreate: true,
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
