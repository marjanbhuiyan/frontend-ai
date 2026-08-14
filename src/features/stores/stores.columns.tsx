import type { ColumnDef } from "@tanstack/react-table";
import { Store } from "lucide-react";
import type { StoreRow } from "./types";

/* Store list columns — mirrors the User List column pattern (id, info
   cell with icon/avatar, then remaining fields) but adapted for the
   StoreInfo shape coming from the auth session. */
export const storeColumns: ColumnDef<StoreRow>[] = [
  {
    accessorKey: "storeId",
    header: "#",
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "storeName",
    header: "Store info",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const store = row.original;
      return (
        <div className="flex items-center gap-3">
          {/* ── Store icon/avatar — indigo background matching the old store management page ── */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
            {store.logo ? (
              <img src={store.logo} alt={store.storeName} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <Store className="h-4 w-4 text-indigo-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800">{store.storeName}</p>
            <p className="text-sm text-gray-400">ID: {store.storeId}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <span className="text-sm text-gray-600">
          {role ?? "—"}
        </span>
      );
    },
  },
];
