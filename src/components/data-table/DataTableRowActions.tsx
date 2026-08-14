/* ──────────────────────────────────────────────────────────────────────────
 * DYNAMIC ACTIONS COLUMN — configured via the table config `rowActions`.
 *
 * Each `RowAction` in `config.rowActions` can be flagged `primary: true`.
 *   - Primary actions → rendered as inline icon buttons in the row.
 *   - Non-primary actions → grouped into a kebab ("...") dropdown menu.
 *   - If no action is flagged `primary`, they are all treated as inline
 *     (preserves the previous behavior for existing tables).
 *
 * The kebab dropdown uses the codebase's base-ui `DropdownMenu` with the
 * `render` prop on `DropdownMenuTrigger` (avoids nested <button> hydration
 * errors — same pattern as DataTableViewOptions).
 *
 * FIXED: Each action icon and the kebab trigger now show a shadcn Tooltip
 * on hover (instead of the native `title` attribute), matching the
 * codebase's UI convention.
 * ────────────────────────────────────────────────────────────────────────── */
import { MoreHorizontal } from "lucide-react";
import { useDataTableContext } from "@/components/data-table/context";
import type { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
}

export function DataTableRowActions<T>({ row }: DataTableRowActionsProps<T>): React.JSX.Element {
  const { rowActions } = useDataTableContext<T>();

  if (rowActions.length === 0) return <></>;

  /* Split actions: flagged `primary` stay inline; the rest go to the kebab
     dropdown. If none are flagged primary, keep everything inline. */
  const hasPrimary = rowActions.some((a) => a.primary);
  const inlineActions = hasPrimary
    ? rowActions.filter((a) => a.primary)
    : rowActions;
  const menuActions = hasPrimary
    ? rowActions.filter((a) => !a.primary)
    : [];

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* ── Inline primary action icons with tooltip ── */}
      {inlineActions.map((action, index) => {
        const isDestructive = action.variant === "destructive";
        const iconColorClass = isDestructive
          ? "text-red-500 hover:text-red-700 hover:bg-red-50"
          : "text-blue-500 hover:text-blue-700 hover:bg-blue-50";

        return (
          <Tooltip key={`inline-${index}`}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={() => action.onClick(row.original)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${iconColorClass}`}
                />
              }
            >
              {action.icon && <action.icon className="h-4 w-4" />}
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        );
      })}

      {/* ── Kebab dropdown for the remaining actions ── */}
      {menuActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="More actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="min-w-40">
            {menuActions.map((action, index) => {
              const isDestructive = action.variant === "destructive";
              return (
                <div key={`menu-${index}`}>
                  {index > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    variant={isDestructive ? "destructive" : "default"}
                    onClick={() => action.onClick(row.original)}
                  >
                    {action.icon && <action.icon className="h-4 w-4" />}
                    {action.label}
                  </DropdownMenuItem>
                </div>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
