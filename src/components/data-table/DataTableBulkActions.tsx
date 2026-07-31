import { useDataTableContext } from "./context";

export function DataTableBulkActions<T>(): React.JSX.Element {
  const { table, bulkActions } = useDataTableContext<T>();
  const selectedCount = table.getSelectedRowModel().rows.length;

  if (selectedCount === 0 || bulkActions.length === 0) return <></>;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-blue-100">
      <span className="text-sm text-blue-700 font-medium">
        {selectedCount} selected
      </span>
      {bulkActions.map((action, index) => (
        <button
          key={index}
          onClick={() => action.action(table.getSelectedRowModel().rows)}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
        >
          {action.icon && <action.icon className="h-3.5 w-3.5" />}
          {action.label}
        </button>
      ))}
    </div>
  );
}
