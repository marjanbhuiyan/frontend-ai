import { useState, useCallback } from "react";
import type { TableState } from "../types";
import { parseTableStateFromURL, syncStateToURL } from "../lib/queryParams";

const DEFAULT_STATE: TableState = {
  page: 1,
  limit: 10,
  sortBy: undefined,
  sortOrder: undefined,
  search: undefined,
  filters: {},
  columnVisibility: {},
};

export function useTableState(defaultLimit = 10): {
  state: TableState;
  setState: (updater: Partial<TableState> | ((prev: TableState) => TableState)) => void;
} {
  const initialFromURL = parseTableStateFromURL(window.location.search);

  const [state, setStateInternal] = useState<TableState>({
    ...DEFAULT_STATE,
    limit: defaultLimit,
    ...initialFromURL,
  });

  const setState = useCallback(
    (updater: Partial<TableState> | ((prev: TableState) => TableState)) => {
      setStateInternal((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        syncStateToURL(next);
        return next;
      });
    },
    []
  );

  return { state, setState };
}
