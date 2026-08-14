import { useDataTableContext } from "@/components/data-table/context";

/* ── Loading skeleton that matches the actual column count of the table.
     Uses the table context to calculate the correct number of columns:
     checkbox (if enabled) + visible data columns + action column (if enabled). */
export function DataTableSkeleton<T>(): React.JSX.Element {
  const { table, config } = useDataTableContext<T>();

  /* Calculate the real column count so the skeleton aligns with the header/body */
  const checkboxColumnCount = config.enableRowSelection ? 1 : 0;
  const dataColumnCount = table.getVisibleFlatColumns().length;
  const actionColumnCount = (config.enableRowActions && config.rowActions && config.rowActions.length > 0) ? 1 : 0;
  const totalColumnCount = checkboxColumnCount + dataColumnCount + actionColumnCount;

  return (
    <tbody data-slot="table-body" className="[&_tr:last-child]:border-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} data-slot="table-row" className="border-b border-gray-100">
          {/* ── Checkbox cell skeleton ── */}
          {config.enableRowSelection && (
            <td className="px-4 py-3.5 align-middle whitespace-nowrap pl-5 [&:has([role=checkbox])]:pr-0">
              <div className="h-4 w-4 animate-pulse rounded-sm border border-gray-200 bg-gray-100" />
            </td>
          )}
          {/* ── Data cell skeletons — count matches visible columns ── */}
          {Array.from({ length: dataColumnCount }).map((_, j) => (
            <td key={j} className="px-4 py-3.5 align-middle whitespace-nowrap">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </td>
          ))}
          {/* ── Action cell skeleton ── */}
          {actionColumnCount > 0 && (
            <td className="px-4 py-3.5 align-middle whitespace-nowrap text-right">
              <div className="ml-auto h-4 w-4 animate-pulse rounded bg-gray-200" />
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
}
