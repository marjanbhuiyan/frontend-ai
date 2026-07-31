import { flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDataTableContext } from "./context";

export function DataTableHeader<T>(): React.JSX.Element {
  const { table, config } = useDataTableContext<T>();

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {config.enableRowSelection && (
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </TableHead>
          )}
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            return (
              <TableHead
                key={header.id}
                className={canSort ? "cursor-pointer select-none" : ""}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
              >
                <div className="flex items-center gap-1">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {canSort && (
                    <span className="text-muted-foreground">
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted() as string] ?? ""}
                    </span>
                  )}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
