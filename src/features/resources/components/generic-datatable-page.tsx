import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import ResourceDataTable from "@/features/resources/components/resource-datatable";
import { useResourceConfig } from "@/features/resources/hooks/use-resource";
import type { DataTableColumn } from "@/features/resources/types/datatable";
import type { Menu } from "@/app/types";

interface GenericDataTablePageProps {
    menu: Menu;
}

function resourceFromMenu(menu: Menu): string | null {
    if (menu.resource) return menu.resource;
    if (menu.route) {
        const segments = menu.route.split("/").filter(Boolean);
        if (segments.length) return segments[segments.length - 1];
    }
    return null;
}

const statusColorMap: Record<string, string> = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-50 text-gray-700 border-gray-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    draft: "bg-blue-50 text-blue-700 border-blue-200",
    archived: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-green-50 text-green-700 border-green-200",
    shipped: "bg-blue-50 text-blue-700 border-blue-200",
    processing: "bg-yellow-50 text-yellow-700 border-yellow-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    paid: "bg-green-50 text-green-700 border-green-200",
    sent: "bg-blue-50 text-blue-700 border-blue-200",
    overdue: "bg-red-50 text-red-700 border-red-200",
};

const currencyFields = new Set([
    "price",
    "total",
    "amount",
    "tax",
    "spent",
    "salary",
    "cost",
]);

function generateColumns(
    fields: Array<{
        name: string;
        label?: string;
        type?: string;
        sortable?: boolean;
        searchable?: boolean;
        visible?: boolean;
        hidden?: boolean;
        options?: Array<{ label: string; value: string | number }>;
    }>
): DataTableColumn[] {
    return fields
        .filter((f) => !f.hidden && f.visible !== false)
        .map((field) => {
            const lower = field.name.toLowerCase();
            const isCurrency = currencyFields.has(lower);

            return {
                accessorKey: field.name,
                header: field.label ?? field.name,
                sortable: field.sortable ?? false,
                searchable: field.searchable ?? false,
                cell: (value, _row) => {
                    if (value == null || value === "") {
                        return <span className="text-muted-foreground">-</span>;
                    }

                    if (
                        field.type === "select" &&
                        typeof value === "string" &&
                        statusColorMap[value]
                    ) {
                        return (
                            <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColorMap[value]}`}
                            >
                                {value}
                            </span>
                        );
                    }

                    if (field.type === "number" && typeof value === "number") {
                        if (isCurrency) {
                            return (
                                <span className="font-medium">
                                    ${value.toLocaleString()}
                                </span>
                            );
                        }
                        return <span>{value.toLocaleString()}</span>;
                    }

                    if (field.type === "email" && typeof value === "string") {
                        return <span className="text-blue-600">{value}</span>;
                    }

                    if (field.type === "date" && typeof value === "string") {
                        const parsed = new Date(value);
                        if (!Number.isNaN(parsed.getTime())) {
                            return <span>{parsed.toLocaleDateString()}</span>;
                        }
                        return <span>{value}</span>;
                    }

                    return <span>{String(value)}</span>;
                },
            };
        });
}

export default function GenericDataTablePage({ menu }: GenericDataTablePageProps) {
    const resourceName = resourceFromMenu(menu);
    console.log("Resource name:", resourceName);
    const { data: resource, isLoading } = useResourceConfig(resourceName ?? "");

    const columns = useMemo(() => {
        if (!resource) return [];
        return generateColumns(resource.fields);
    }, [resource]);

    if (!resourceName) {
        return (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
                Resource not defined for this menu item.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
                Resource "{resourceName}" not found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold">{resource.pluralLabel}</h2>
                <p className="text-sm text-muted-foreground">
                    Manage {resource.pluralLabel.toLowerCase()} records.
                </p>
            </div>
            <ResourceDataTable
                endpoint={menu.api ?? resource.endpoint}
                columns={columns}
                defaultPageSize={resource.defaultPageSize}
                pageSizeOptions={resource.pageSizeOptions}
                enableSearch={resource.enableSearch}
                enablePagination={resource.enablePagination}
                searchPlaceholder={`Search ${resource.pluralLabel.toLowerCase()}...`}
            />
        </div>
    );
}
