import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData, unknown>[];
    loading?: boolean;
    sorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
    emptyMessage?: string;
}

function SortIndicator({ state }: { state: "asc" | "desc" | "none" }) {
    if (state === "asc") return <ArrowUp className="size-3.5 text-muted-foreground" />;
    if (state === "desc") return <ArrowDown className="size-3.5 text-muted-foreground" />;
    return <ChevronsUpDown className="size-3.5 text-muted-foreground/50" />;
}

export default function DataTable<TData>({ data, columns, loading, sorting, onSortingChange, emptyMessage }: DataTableProps<TData>): React.JSX.Element {
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting: sorting ?? [],
        },
        onSortingChange: (updater) => {
            if (!onSortingChange) return;
            onSortingChange(
                typeof updater === "function" ? updater(sorting ?? []) : updater
            );
        },
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
    });

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            const canSort = header.column.getCanSort();
                            const isSorted = header.column.getIsSorted();
                            return (
                                <TableHead
                                    key={header.id}
                                    className={cn(
                                        canSort && "cursor-pointer select-none",
                                        header.column.columnDef.meta?.align === "center" && "text-center",
                                        header.column.columnDef.meta?.align === "right" && "text-right"
                                    )}
                                    onClick={
                                        canSort
                                            ? () => header.column.toggleSorting(isSorted === "asc")
                                            : undefined
                                    }
                                >
                                    <span className="inline-flex items-center gap-1">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                        {canSort && <SortIndicator state={isSorted || "none"} />}
                                    </span>
                                </TableHead>
                            );
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className={cn(
                                        cell.column.columnDef.meta?.align === "center" && "text-center",
                                        cell.column.columnDef.meta?.align === "right" && "text-right"
                                    )}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                            {emptyMessage}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
