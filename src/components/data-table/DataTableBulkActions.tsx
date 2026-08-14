/* ──────────────────────────────────────────────────────────────────────────
 * BULK ACTIONS BAR — shown when rows are selected.
 *
 * NOTE: The primary rendering of this bar is now handled dynamically inside
 * DataTableHeader (which replaces the column headers with the selected-state
 * bar matching the screenshot's peach/salmon style). This standalone component
 * is kept for backward compatibility and can be used outside the table header.
 * ────────────────────────────────────────────────────────────────────────── */
import { useDataTableContext } from "@/components/data-table/context";
import { Trash2 } from "lucide-react";

export function DataTableBulkActions<T>(): React.JSX.Element {
  const { table, bulkActions } = useDataTableContext<T>();
  const selectedCount = table.getSelectedRowModel().rows.length;

  if (selectedCount === 0 || bulkActions.length === 0) return <></>;

  return (
    /* ── Peach/salmon selected-state bar matching screenshot ── */
    <div className="flex items-center gap-2 rounded-t-lg border-b border-orange-100 bg-orange-50 px-4 py-2.5">
      <span className="text-sm font-semibold text-orange-600">
        {selectedCount} selected
      </span>
      {bulkActions.map((action, index) => (
        <button
          key={index}
          onClick={() => action.action(table.getSelectedRowModel().rows)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-orange-500 transition-colors hover:bg-orange-100 hover:text-orange-700"
          title={action.label}
        >
          {action.icon ? (
            <action.icon className="h-4 w-4" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      ))}
    </div>
  );
}
