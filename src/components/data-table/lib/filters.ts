import type { FilterConfig } from "../types";

export function getActiveFilters(
  filters: FilterConfig[],
  currentFilters: Record<string, string | string[] | undefined>
): FilterConfig[] {
  return filters.filter((f) => {
    const value = currentFilters[f.id];
    return value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0);
  });
}

export function getFilterLabel(
  filter: FilterConfig,
  value: string | string[] | undefined
): string {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        const option = filter.options?.find((o) => o.value === v);
        return option?.label ?? v;
      })
      .join(", ");
  }
  const option = filter.options?.find((o) => o.value === value);
  return option?.label ?? value;
}

export function clearFilter(
  filters: Record<string, string | string[] | undefined>,
  id: string
): Record<string, string | string[] | undefined> {
  const next = { ...filters };
  delete next[id];
  return next;
}
