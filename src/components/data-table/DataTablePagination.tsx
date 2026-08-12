import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from "lucide-react";
import { useDataTableContext } from "@/components/data-table/context";

/**
 * Inline dropdown (button + native menu) used for both "Rows per page"
 * and "Go to page" in the footer — no dependency on the global menu
 * primitives, keeps the footer self-contained.
 */
function TableDropdown({
  value,
  options,
  max,
  onSelect,
  ariaLabel,
}: {
  value: number;
  options: number[];
  max?: number;
  onSelect: (value: number) => void;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      {/* Button shows the current value; opening the native <select> is done
          by calling showPicker() so our button fully controls the styling. */}
      <button
        type="button"
        onClick={(e) => e.currentTarget.nextElementSibling?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))}
        className={`flex h-8 items-center justify-between rounded-md border border-gray-300 bg-white pl-2.5 pr-1.5 text-sm text-gray-600 hover:bg-gray-50 focus:border-indigo-500 focus:outline-none ${max ? "w-[68px]" : "w-[58px]"}`}
        aria-label={ariaLabel}
      >
        {max ? value : value}
        <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
      </button>
      {/* Native select kept invisible but overlay-positioned; it reuses the
          button's box, so it is practically the same pixel area. */}
      <select
        className="absolute inset-0 cursor-pointer opacity-0"
        value={value}
        onChange={(e) => onSelect(Number(e.target.value))}
        aria-label={ariaLabel}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DataTablePagination<T>(): React.JSX.Element {
  const { config, pagination, state, setState } = useDataTableContext<T>();

  if (!config.enablePagination) return <></>;

  const currentPage = state.page;
  const totalPages = pagination.totalPages;

  const getVisiblePages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    /* ── Pagination footer: matches image's layout (left controls + right page buttons) ── */
    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-5 py-3.5 sm:flex-row">
      {/* ── Left side — rows per page + go to page ── */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm text-gray-600">Row per page</span>
          <TableDropdown
            value={state.limit}
            options={config.pageSizeOptions ?? [10, 25, 50, 100]}
            onSelect={(limit) => setState({ limit, page: 1 })}
            ariaLabel="Rows per page"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm text-gray-600">Go to</span>
          {/* ── Go-to page input (matches image's input field style) ── */}
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
              if (!isNaN(page)) setState({ page });
            }}
            className="h-8 w-[58px] rounded-md border border-gray-300 bg-white px-2.5 text-sm text-gray-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* ── Right side — page navigation buttons (active page indigo, matching image) ── */}
      <div className="flex items-center gap-1">
        {/* ── First page button (|<) ── */}
        <button
          onClick={() => setState({ page: 1 })}
          disabled={state.page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        {/* ── Previous page button (<) ── */}
        <button
          onClick={() => setState({ page: Math.max(1, state.page - 1) })}
          disabled={state.page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* ── Page number buttons ── */}
        {getVisiblePages().map((page, i) => {
          if (page === "...") {
            return (
              <span key={`dots-${i}`} className="flex h-8 w-8 items-center justify-center text-sm text-gray-500">
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => setState({ page })}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* ── Next page button (>) ── */}
        <button
          onClick={() => setState({ page: Math.min(totalPages, state.page + 1) })}
          disabled={state.page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {/* ── Last page button (|>) ── */}
        <button
          onClick={() => setState({ page: totalPages })}
          disabled={state.page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}