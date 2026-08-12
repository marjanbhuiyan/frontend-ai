/* ──────────────────────────────────────────────────────────────────────────
 * PIXEL-PERFECT MATCH: Row actions changed from kebab dropdown menu to
 * inline icon buttons (Eye, Pencil, Trash2) as shown in the reference image.
 * - Eye (view) and Pencil (edit) use blue styling
 * - Trash2 (delete) uses red styling
 * ────────────────────────────────────────────────────────────────────────── */
import { useDataTableContext } from "@/components/data-table/context";
import type { Row } from "@tanstack/react-table";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
}

export function DataTableRowActions<T>({ row }: DataTableRowActionsProps<T>): React.JSX.Element {
  const { rowActions } = useDataTableContext<T>();

  if (rowActions.length === 0) return <></>;

  return (
    /* ── Inline action icons container (flex row with gap) ── */
    <div className="flex items-center gap-2">
      {rowActions.map((action, index) => {
        /* Determine color class based on action variant */
        const isDestructive = action.variant === "destructive";
        const iconColorClass = isDestructive
          ? "text-red-500 hover:text-red-700 hover:bg-red-50"
          : "text-blue-500 hover:text-blue-700 hover:bg-blue-50";

        return (
          <button
            key={index}
            type="button"
            onClick={() => action.onClick(row.original)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${iconColorClass}`}
            title={action.label}
          >
            {action.icon && <action.icon className="h-4 w-4" />}
          </button>
        );
      })}
    </div>
  );
}
