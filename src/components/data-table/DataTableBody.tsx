import { flexRender } from "@tanstack/react-table";
import { useDataTableContext } from "./context";
import { DataTableRowActions } from "./DataTableRowActions";
import { DataTableEmpty } from "./DataTableEmpty";
import { DataTableSkeleton } from "./DataTableSkeleton";

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
    <tbody data-slot="table-body" className="[&_tr:last-child]:border-0">
      {rows.map((row) => (
        <tr
          key={row.id}
          data-slot="table-row"
          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          data-state={row.getIsSelected() ? "selected" : undefined}
        >
          {config.enableRowSelection && (
            <td className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0">
              <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </td>
          )}
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              data-slot="table-cell"
              className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
          {config.enableRowActions && config.rowActions && config.rowActions.length > 0 && (
            <td className="p-2 align-middle whitespace-nowrap">
              <DataTableRowActions row={row} />
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
}
