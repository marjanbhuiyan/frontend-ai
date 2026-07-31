import type { TableState } from "../types";

export function buildQueryParams(state: TableState): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {
    page: state.page,
    limit: state.limit,
  };

  if (state.search) {
    params.search = state.search;
  }

  if (state.sortBy) {
    params.sortBy = state.sortBy;
    params.sortOrder = state.sortOrder;
  }

  for (const [key, value] of Object.entries(state.filters)) {
    if (value !== undefined && value !== "") {
      params[key] = Array.isArray(value) ? value.join(",") : value;
    }
  }

  return params;
}

export function parseTableStateFromURL(urlSearch: string): Partial<TableState> {
  const params = new URLSearchParams(urlSearch);
  const state: Partial<TableState> = {};

  const page = params.get("page");
  if (page) state.page = Number(page);

  const limit = params.get("limit");
  if (limit) state.limit = Number(limit);

  const sortBy = params.get("sortBy");
  if (sortBy) state.sortBy = sortBy;

  const sortOrder = params.get("sortOrder");
  if (sortOrder === "asc" || sortOrder === "desc") state.sortOrder = sortOrder;

  const searchVal = params.get("search");
  if (searchVal) state.search = searchVal;

  return state;
}

export function syncStateToURL(state: TableState): void {
  const params = new URLSearchParams();

  if (state.page > 1) params.set("page", String(state.page));
  if (state.limit !== 10) params.set("limit", String(state.limit));
  if (state.sortBy) params.set("sortBy", state.sortBy);
  if (state.sortOrder) params.set("sortOrder", state.sortOrder);
  if (state.search) params.set("search", state.search);

  for (const [key, value] of Object.entries(state.filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }
  }

  const qs = params.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, "", url);
}
