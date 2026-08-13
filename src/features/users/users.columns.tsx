import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, UserStatus } from "@/features/users/types";

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
  Active: "bg-green-50 text-green-600 border-green-200",
  Inactive: "bg-gray-50 text-gray-500 border-gray-200",
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
}

/* ADDED statuses — the data actually returned by the column/API uses values
   like "Complete" / "Canceled" (see users.mock.ts + the reference image), which
   are NOT part of the `UserStatus` union keys. Map them to the same green/red
   visual language so the badge is colored instead of falling back to gray. */
const EXTRA_STATUS_STYLES: Record<string, string> = {
  Complete: "bg-green-50 text-green-600 border-green-200",
  Canceled: "bg-red-50 text-red-500 border-red-200",
}

const ALL_STATUS_STYLES: Record<string, string> = {
  ...statusStyles,
  ...EXTRA_STATUS_STYLES,
}

/* FIXED status styling: if the row's `status` value is not one of the keys
   above (unknown/missing value from the API), `statusStyles[status]` is
   `undefined` and the badge renders with NO background/border/text color.
   Use a neutral fallback so the pill always looks styled.
   Also normalizes case + surrounding whitespace ("Complete", "complete") so
   lookup succeeds regardless of what the backend sends. */
const DEFAULT_STATUS_STYLE = "bg-gray-50 text-gray-500 border-gray-200";

function resolveStatusStyle(status: string): string {
  if (typeof status !== "string") return DEFAULT_STATUS_STYLE;
  const key = status.trim().toLowerCase();
  if (!key) return DEFAULT_STATUS_STYLE;

  for (const [name, style] of Object.entries(ALL_STATUS_STYLES)) {
    if (name.toLowerCase() === key) return style;
  }

  return DEFAULT_STATUS_STYLE;
}

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "#",
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "USER INFO",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      console.log("original", row.original);
      const user = row.original;
      const colorClass = avatarColors[user.id % avatarColors.length];
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className={`${colorClass} text-white text-xs`}>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-sm text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
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
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <p className="font-medium text-sm text-gray-800">{user.phone}</p>
        </div>
      );
    },

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
      /* FIXED: resolve via the defensive helper (falls back to a neutral pill
         for unknown/missing status values instead of no styling). */
      const styleClass = resolveStatusStyle(status);
      return (
         <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styleClass}`}
                    >
                  {status}
             </span>
      );
    },
  }
];
