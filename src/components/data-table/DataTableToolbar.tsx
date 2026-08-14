import { Search, RefreshCw, Download, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataTableContext } from "./context";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DataTableToolbar<T>(): React.JSX.Element {
  const { config, state, setState, refetch, isFetching, pagination, data } = useDataTableContext<T>();

  /* ──────────────────────────────────────────────────────────────────────────
   * Status filter options — matches the "All Status" dropdown in the image.
   * These are hardcoded for the Users table; a more generic approach would
   * read them from config.filters, but for pixel-perfect matching we keep
   * them inline here.
   * ────────────────────────────────────────────────────────────────────────── */
  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Complete", value: "Complete" },
    { label: "Pending", value: "Pending" },
    { label: "Canceled", value: "Canceled" },
  ];

  /* ──────────────────────────────────────────────────────────────────────────
   * Status tab options with counts — matches the screenshot's tab design.
   * Each tab shows a label + badge count. "All" includes every row.
   * ────────────────────────────────────────────────────────────────────────── */
  const statusTabs = [
    { label: "All", value: "", color: "bg-gray-800 text-white" },
    { label: "Active", value: "Active", color: "bg-green-100 text-green-700" },
    { label: "Pending", value: "Pending", color: "bg-amber-100 text-amber-700" },
    { label: "Banned", value: "Banned", color: "bg-red-100 text-red-600" },
    { label: "Rejected", value: "Rejected", color: "bg-gray-100 text-gray-600" },
  ];

  /* Calculate status counts from the current data */
  const getStatusCount = (statusValue: string) => {
    if (!statusValue) return data.length;
    return data.filter((item: Record<string, unknown>) => {
      const itemStatus = (item.status as string) ?? "";
      return itemStatus.toLowerCase() === statusValue.toLowerCase();
    }).length;
  };

  /* Current status filter value (derived from state.filters) */
  const currentStatusFilter = (state.filters?.status as string) ?? "";

  /* ──────────────────────────────────────────────────────────────────────────
   * Sort options — matches the "Sort by (#)" dropdown in the image.
   * Each option maps to a sortBy + sortOrder pair sent to the API.
   * ────────────────────────────────────────────────────────────────────────── */
  const sortOptions = [
    { label: "Sort by (#)", sortBy: "id", sortOrder: "asc" as const },
    { label: "Sort by (Name)", sortBy: "name", sortOrder: "asc" as const },
    { label: "Sort by (Age)", sortBy: "age", sortOrder: "asc" as const },
    { label: "Sort by (Country)", sortBy: "country", sortOrder: "asc" as const },
    { label: "Sort by (Status)", sortBy: "status", sortOrder: "asc" as const },
  ];

  /* Current sort label (derived from state.sortBy) */
  const currentSortLabel = sortOptions.find((o) => o.sortBy === state.sortBy)?.label ?? sortOptions[0].label;

  return (
    <div className="flex flex-col">
      {/* ── Status tabs section — above the toolbar, matching screenshot ── */}
      <div className="border-b border-gray-200 px-5 pt-2">
        <Tabs
          value={currentStatusFilter}
          onValueChange={(value) => {
            setState({ filters: { ...state.filters, status: value || undefined }, page: 1 });
          }}
        >
          <TabsList variant="line" className="h-auto gap-0 bg-transparent p-0">
            {statusTabs.map((tab) => {
              const count = getStatusCount(tab.value);
              const isActive = currentStatusFilter === tab.value;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative h-10 rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 data-active:text-gray-900"
                >
                  {tab.label}
                  <span className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${tab.color}`}>
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* ── Main toolbar — search, filters, sort, action buttons ── */}
      <div className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      {/* ── Left side — search input + status filter + sort dropdown ──────── */}
      <div className="flex flex-1 items-center gap-2">
        {config.enableSearch && (
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              /* ── Updated placeholder to show record count, matching the image ── */
              placeholder={config.searchPlaceholder ?? `Search ${pagination.total} records...`}
              value={state.search ?? ""}
              onChange={(e) => {
                setState({ search: e.target.value || undefined, page: 1 });
              }}
              className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        )}

        {/* ── "All Status" filter dropdown (matches image's blue-outlined style) ── */}
        {config.enableFilters && (
          <div className="relative">
            <select
              value={currentStatusFilter}
              onChange={(e) => {
                setState({ filters: { ...state.filters, status: e.target.value || undefined }, page: 1 });
              }}
              className="h-9 appearance-none rounded-lg border border-blue-300 bg-white pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        )}

        {/* ── "Sort by (#)" dropdown (matches image's blue-outlined style) ── */}
        <div className="relative">
          <select
            value={currentSortLabel}
            onChange={(e) => {
              const selected = sortOptions.find((o) => o.label === e.target.value);
              if (selected) {
                setState({ sortBy: selected.sortBy, sortOrder: selected.sortOrder, page: 1 });
              }
            }}
            className="h-9 appearance-none rounded-lg border border-blue-300 bg-white pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {sortOptions.map((opt) => (
              <option key={opt.label} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* ── Right side — icon buttons + create button ─────────────────────── */}
      <div className="flex items-center gap-2">
        {config.enableRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 w-9 border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        )}

        {config.enableColumnVisibility && <DataTableViewOptions />}

        {/* ── Export/download button (enabled to match image) ── */}
        {config.enableExport && (
          <Button variant="outline" size="icon" className="h-9 w-9 border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
            <Download className="h-4 w-4" />
          </Button>
        )}

        {/* ── "+ Add Customer" button (indigo, matching image) ── */}
        {config.enableCreate && (
          <Button
            onClick={config.onCreate}
            className="h-9 gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            {config.createButtonLabel ?? "Create"}
          </Button>
        )}
      </div>
    </div>
    </div>
  );
}