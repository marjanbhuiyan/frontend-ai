import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDataTableContext } from "./context";
import type { Row } from "@tanstack/react-table";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
}

export function DataTableRowActions<T>({ row }: DataTableRowActionsProps<T>): React.JSX.Element {
  const { rowActions } = useDataTableContext<T>();

  if (rowActions.length === 0) return <></>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <span className="sr-only">Open menu</span>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {rowActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            variant={action.variant === "destructive" ? "destructive" : "default"}
            onClick={() => action.onClick(row.original)}
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
