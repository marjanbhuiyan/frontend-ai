import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, UserStatus } from "./types";

const avatarColors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-pink-500", "bg-purple-500"];

function getInitials(name: string): string {
  // Guard against rows missing the `name` field (e.g. a list endpoint that
  // returns users without a display name) — mirrors the sidebar's getInitials.
  if (!name) return "U";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const statusStyles: Record<UserStatus, string> = {
  // Tinted pill styles — soft background + colored text + tinted border, matching the reference image
  Complete: "bg-green-50 text-green-600 border-green-200",
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
  Canceled: "bg-red-50 text-red-500 border-red-200",
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "#",
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "USER INFO",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const user = row.original;
      const colorClass = avatarColors[user.id % avatarColors.length];
      return (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className={`${colorClass} text-white text-xs`}>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: "CONTACT",
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "age",
    header: "AGE",
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "country",
    header: "COUNTRY",
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: "STATUS",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus;
      return (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
        >
          {status}
        </span>
      );
    },
  },
];
