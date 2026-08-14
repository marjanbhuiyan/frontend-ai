import { flexRender } from "@tanstack/react-table";
import { useDataTableContext } from "@/components/data-table/context";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "@/components/data-table/DataTableRowActions";
import { DataTableEmpty } from "@/components/data-table/DataTableEmpty";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";

export function DataTableBody<T>(): React.JSX.Element {
  const { table, config, isLoading } = useDataTableContext<T>();

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return <DataTableEmpty />;
  }

  return (
    /* ── Table body: clean white rows with subtle borders, matching image ── */
    <tbody data-slot="table-body" className="[&_tr:last-child]:border-0">
      {rows.map((row) => (
        <tr
          key={row.id}
          data-slot="table-row"
          /* ── Row styling: border-bottom, hover bg, selected state ── */
          className="border-b border-gray-100 transition-colors hover:bg-gray-50 data-[state=selected]:bg-blue-50/60"
          data-state={row.getIsSelected() ? "selected" : undefined}
        >
          {/* ── Checkbox cell ── */}
          {config.enableRowSelection && (
            <td className="px-4 py-3.5 align-middle whitespace-nowrap pl-5 [&:has([role=checkbox])]:pr-0">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(checked) => row.toggleSelected(checked)}
                aria-label="Select row"
              />
            </td>
          )}
          {/* ── Data cells ── */}
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              data-slot="table-cell"
              className="px-4 py-3.5 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
          {/* ── Inline action icons (Eye, Pencil, Trash) — matching image ── */}
          {config.enableRowActions && config.rowActions && config.rowActions.length > 0 && (
            <td className="px-4 py-3.5 align-middle whitespace-nowrap text-right">
              <DataTableRowActions row={row} />
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
}
