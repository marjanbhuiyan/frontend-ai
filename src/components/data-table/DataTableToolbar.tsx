import { Search, RefreshCw, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataTableContext } from "./context";
import { DataTableViewOptions } from "./DataTableViewOptions";

export function DataTableToolbar<T>(): React.JSX.Element {
  const { config, state, setState, refetch, isFetching } = useDataTableContext<T>();

  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        {config.enableSearch && (
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={config.searchPlaceholder ?? "Search..."}
              value={state.search ?? ""}
              onChange={(e) => {
                setState({ search: e.target.value || undefined, page: 1 });
              }}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {config.enableRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        )}

        {config.enableExport && (
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}

        {config.enableColumnVisibility && <DataTableViewOptions />}

        {config.enableCreate && (
          <Button onClick={config.onCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {config.createButtonLabel ?? "Create"}
          </Button>
        )}
      </div>
    </div>
  );
}
