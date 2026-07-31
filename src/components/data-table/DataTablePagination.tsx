import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataTableContext } from "./context";

export function DataTablePagination<T>(): React.JSX.Element {
  const { config, pagination, state, setState } = useDataTableContext<T>();

  if (!config.enablePagination) return <></>;

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-4 py-3 sm:flex-row">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>Rows per page</span>
        <select
          value={state.limit}
          onChange={(e) => setState({ limit: Number(e.target.value), page: 1 })}
          className="h-8 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-600 focus:border-blue-500 focus:outline-none"
        >
          {(config.pageSizeOptions ?? [10, 25, 50, 100]).map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          {pagination.total > 0
            ? `${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}`
            : "0 items"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setState({ page: 1 })}
          disabled={state.page <= 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setState({ page: Math.max(1, state.page - 1) })}
          disabled={state.page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={state.page === page ? "default" : "outline"}
            size="icon"
            onClick={() => setState({ page })}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setState({ page: Math.min(pagination.totalPages, state.page + 1) })}
          disabled={state.page >= pagination.totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setState({ page: pagination.totalPages })}
          disabled={state.page >= pagination.totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
