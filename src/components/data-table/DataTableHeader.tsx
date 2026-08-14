import { flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataTableContext } from "@/components/data-table/context";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function DataTableHeader<T>(): React.JSX.Element {
  const { table, config, bulkActions } = useDataTableContext<T>();
  const selectedCount = table.getSelectedRowModel().rows.length;
  const hasSelection = selectedCount > 0;

  /* ── DYNAMIC HEADER: when rows are selected, replace the normal column
       headers with the peach/salmon bulk-actions bar (matching screenshot).
       The bar shows "X selected" on the left + bulk action icons on the right.
       Works whenever `enableRowSelection` is true — bulk action buttons are
       optional and only shown if `bulkActions.length > 0`. ── */
  if (hasSelection && config.enableRowSelection) {
    /* ── Calculate the correct colSpan for the "X selected" label.
         It should span all columns except the checkbox column:
         visible data columns + action column (if enabled).
         `getVisibleFlatColumns()` includes the checkbox column, so subtract 1
         for it, then add 1 for the action column (not part of the column defs). */
    const visibleColumns = table.getVisibleFlatColumns().length;
    const actionColumnCount = (config.enableRowActions && config.rowActions && config.rowActions.length > 0) ? 1 : 0;
    const selectedLabelColSpan = visibleColumns - 1 + actionColumnCount;

    return (
      <TableHeader>
        <TableRow className="border-b-0 bg-orange-50 hover:bg-orange-50">
          {/* ── Checkbox (stays for deselect-all) ──
              h-12 matches the default header height so the row doesn't shift. */}
          {config.enableRowSelection && (
            <TableHead className="w-12 h-12 bg-transparent px-4 pl-5">
              <Checkbox
                checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() ? "indeterminate" : false)}
                onCheckedChange={() => {
                  const anySelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
                  table.toggleAllRowsSelected(!anySelected);
                }}
                aria-label="Select all rows"
              />
            </TableHead>
          )}
          {/* ── "X selected" label ──
              colSpan calculated to match the default header's column count
              (all data columns + action column) so the layout stays aligned. */}
          <TableHead
            colSpan={selectedLabelColSpan}
            className="bg-transparent h-12 px-4 text-left text-sm font-semibold text-orange-600"
          >
            {selectedCount} selected
          </TableHead>
          {/* ── Bulk action icons (delete icon on the right) ──
              Only rendered when bulkActions are configured. h-12 for
              consistent height. Uses shadcn Tooltip instead of native title. */}
          {bulkActions.length > 0 && (
            <TableHead className="bg-transparent h-12 px-4 text-right">
              {bulkActions.map((action, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger
                    render={
                      <button
                        onClick={() => action.action(table.getSelectedRowModel().rows)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-orange-500 transition-colors hover:bg-orange-100 hover:text-orange-700"
                      />
                    }
                  >
                    {action.icon ? (
                      <action.icon className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>{action.label}</TooltipContent>
                </Tooltip>
              ))}
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
    );
  }

  /* ── DEFAULT: normal column headers with soft styling ── */
  return (
    /* ── Header wrapper: soft background, no border ── */
    <TableHeader className="[&_tr]:border-b-0 border-t-0">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="border-b-0 bg-gray-50 hover:bg-gray-100">
          {/* ── Select-all checkbox column ──
              h-12 overrides the default h-10 from TableHead to increase
              header height; py-3 adds vertical breathing room.
              FIXED: same two-state toggle as the selected-state header —
              any selected → deselect all; none selected → select all. */}
          {config.enableRowSelection && (
            <TableHead className="w-12 h-12 bg-transparent px-4 pl-5">
              <Checkbox
                checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() ? "indeterminate" : false)}
                onCheckedChange={() => {
                  const anySelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
                  table.toggleAllRowsSelected(!anySelected);
                }}
                aria-label="Select all rows"
              />
            </TableHead>
          )}
          {/* ── Column headers with sort indicators ──
              h-12 overrides default h-10 for increased row height.
              Text is capitalize (not uppercase) with bg-gray-50 background. */}
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            return (
              <TableHead
                key={header.id}
                className={`bg-transparent h-12 px-4 text-sm font-medium capitalize text-gray-600 ${canSort ? "cursor-pointer select-none hover:text-gray-800" : ""}`}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
              >
                {/* ── Flex container for header text + sort arrow ── */}
                <div className="flex items-center gap-1.5">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {/* ── Sort indicator arrows ── */}
                  {canSort && (
                    <span className="text-gray-400">
                      {{
                        asc: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M12 5l0 14"></path><path d="M18 11l-6 -6"></path><path d="M6 11l6 -6"></path></svg>,
                        desc: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M12 5l0 14"></path><path d="M18 13l-6 6"></path><path d="M6 13l6 6"></path></svg>,
                      }[header.column.getIsSorted() as string] ?? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M12 5l0 14"></path><path d="M18 11l-6 -6"></path><path d="M6 11l6 -6"></path></svg>}
                    </span>
                  )}
                </div>
              </TableHead>
            );
          })}
          {/* ── "Action" header for the row-actions column ── */}
          {config.enableRowActions && config.rowActions && config.rowActions.length > 0 && (
            <TableHead className="bg-transparent h-12 px-4 text-right text-sm font-medium capitalize text-gray-600">
              Action
            </TableHead>
          )}
        </TableRow>
      ))}
    </TableHeader>
  );
}
