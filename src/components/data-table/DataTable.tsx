import { DataTableProvider } from "./DataTableProvider";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableBulkActions } from "./DataTableBulkActions";
import type { TableConfig } from "./types";

interface DataTableProps<T> {
  config: TableConfig<T>;
  data?: T[];
}

export function DataTable<T>({ config, data }: DataTableProps<T>): React.JSX.Element {
  return (
    <DataTableProvider config={config} data={data}>
      <div className="rounded-sm border border-gray-100 bg-white shadow-sm">
        <DataTableToolbar />
        <DataTableBulkActions />
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
