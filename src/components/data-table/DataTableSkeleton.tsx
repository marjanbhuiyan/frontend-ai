export function DataTableSkeleton(): React.JSX.Element {
  return (
    <tbody data-slot="table-body" className="[&_tr:last-child]:border-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} data-slot="table-row" className="border-b">
          {Array.from({ length: 5 }).map((_, j) => (
            <td key={j} className="p-2 align-middle whitespace-nowrap">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
