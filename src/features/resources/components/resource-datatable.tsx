import { useMemo, useState } from "react";
import { useDataTable } from "@/features/resources/hooks/use-datatable";
import GenericTable from "@/features/resources/components/generic-table";
import DataTableFilter from "@/features/resources/components/datatable-filter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { DataTableColumn } from "@/features/resources/types/datatable";

type Row = Record<string, unknown>;

interface ResourceDataTableProps {
    endpoint: string;
    columns: DataTableColumn[];
    defaultPageSize?: number;
    pageSizeOptions?: number[];
    enableSearch?: boolean;
    enablePagination?: boolean;
    searchPlaceholder?: string;
}

const ResourceDataTable = ({
    endpoint,
    columns: columnConfigs,
    defaultPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    enableSearch = true,
    enablePagination = true,
    searchPlaceholder,
}: ResourceDataTableProps) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(defaultPageSize);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);

    const sort = sorting[0];
    const { data, isLoading } = useDataTable<Row>({
        endpoint,
        page,
        limit,
        search: search || undefined,
        sortBy: sort?.id,
        sortOrder: sort?.desc ? "desc" : "asc",
    });

    const columns: ColumnDef<Row, unknown>[] = useMemo(
        () =>
            columnConfigs.map((col) => ({
                id: col.accessorKey,
                accessorKey: col.accessorKey,
                header: col.header,
                meta: {
                    align: col.align,
                },
                enableSorting: col.sortable ?? false,
                cell: col.cell
                    ? ({ row }) => col.cell!(row.original[col.accessorKey], row.original)
                    : ({ getValue }) => {
                          const value = getValue();
                          if (value == null || value === "") return <span className="text-muted-foreground">-</span>;
                          return String(value);
                      },
            })),
        [columnConfigs]
    );

    const rows: Row[] = data?.data ?? [];
    const meta = data?.meta;

    function handleSearch(nextSearch: string): void {
        setSearch(nextSearch);
        setPage(1);
    }

    function handlePageSizeChange(nextLimit: number): void {
        setLimit(nextLimit);
        setPage(1);
    }

    return (
        <div className="space-y-4">
            {enableSearch && (
                <DataTableFilter
                    search={search}
                    placeholder={searchPlaceholder}
                    onSearch={handleSearch}
                />
            )}

            <GenericTable
                data={rows}
                columns={columns}
                loading={isLoading}
                sorting={sorting}
                onSortingChange={setSorting}
            />

            {enablePagination && meta && meta.total > 0 && (
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Rows per page</span>
                        <select
                            className="h-8 rounded-md border bg-background px-2 text-sm outline-none"
                            value={limit}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span>
                            Page {meta.page} of {meta.totalPages} ({meta.total} records)
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={page <= 1}
                            onClick={() => setPage(1)}
                        >
                            <ChevronsLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={page >= meta.totalPages}
                            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={page >= meta.totalPages}
                            onClick={() => setPage(meta.totalPages)}
                        >
                            <ChevronsRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceDataTable;
