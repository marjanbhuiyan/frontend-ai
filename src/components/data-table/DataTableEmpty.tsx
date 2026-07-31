export function DataTableEmpty<T>(): React.JSX.Element {
  return (
    <tbody data-slot="table-body" className="[&_tr:last-child]:border-0">
      <tr>
        <td colSpan={100} className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <svg
              className="h-10 w-10 text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No results found</p>
          </div>
        </td>
      </tr>
    </tbody>
  );
}
