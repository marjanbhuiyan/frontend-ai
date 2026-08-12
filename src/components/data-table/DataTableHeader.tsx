import { flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataTableContext } from "@/components/data-table/context";

export function DataTableHeader<T>(): React.JSX.Element {
  const { table, config } = useDataTableContext<T>();

  return (
    /* ── Header wrapper: light gray bg, bottom border, matching the image ── */
    <TableHeader className="[&_tr]:border-b [&_tr]:border-gray-200">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="border-b border-gray-200 bg-gray-50/80">
          {/* ── Select-all checkbox column ── */}
          {config.enableRowSelection && (
            <TableHead className="w-12 bg-transparent pl-5">
              <Checkbox
                checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() ? "indeterminate" : false)}
                onCheckedChange={table.getToggleAllRowsSelectedHandler()}
                aria-label="Select all rows"
              />
            </TableHead>
          )}
          {/* ── Column headers with sort indicators ── */}
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            return (
              <TableHead
                key={header.id}
                className={`bg-transparent text-xs font-semibold uppercase tracking-wider text-gray-500 ${canSort ? "cursor-pointer select-none hover:text-gray-700" : ""}`}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
              >
                {/* ── Flex container for header text + sort arrow ── */}
                <div className="flex items-center gap-1">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {/* ── Sort indicator arrows (matching image's ↕ style) ── */}
                  {canSort && (
                    <span className="text-gray-400">
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted() as string] ?? " ↕"}
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
