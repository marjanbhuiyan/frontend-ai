import { DataTableProvider } from "@/components/data-table/DataTableProvider";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { DataTableHeader } from "@/components/data-table/DataTableHeader";
import { DataTableBody } from "@/components/data-table/DataTableBody";
import { DataTablePagination } from "@/components/data-table/DataTablePagination";
// DataTableBulkActions removed from here — the selected-state bar is now
// rendered dynamically inside DataTableHeader (replaces column headers with
// the peach/salmon "X selected" bar when rows are selected, matching the
// screenshot). The standalone component is kept in its file for reuse.
// import { DataTableBulkActions } from "@/components/data-table/DataTableBulkActions";
import type { TableConfig } from "@/components/data-table/types";

interface DataTableProps<T> {
  config: TableConfig<T>;
  data?: T[];
  /* ADDED: optional external loading flag — when the parent page fetches data
     itself (e.g. useQuery) and passes it via `data`, the internal query is
     disabled so isLoading is always false. The parent can pass its own loading
     state here to trigger the skeleton. */
  isLoading?: boolean;
}

/* ADDED: pass-through of externalLoading so DataTableProvider can override
   its internal isLoading when the parent owns the data-fetch lifecycle. */
export function DataTable<T>({ config, data, isLoading: externalLoading }: DataTableProps<T>): React.JSX.Element {
  return (
    <DataTableProvider config={config} data={data} externalLoading={externalLoading}>
      {/* Container: soft rounded card with a subtle border + shadow, matching the reference image */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <DataTableToolbar />
        {/* DataTableBulkActions removed — now handled dynamically inside DataTableHeader */}
        <div className="overflow-x-auto">
          <table data-slot="table" className="w-full caption-bottom text-sm">
            <DataTableHeader />
            <DataTableBody />
          </table>
        </div>
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
}
