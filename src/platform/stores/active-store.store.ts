import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveStoreState {
  activeStoreId: number | null;

  setActiveStore: (
    storeId: number,
  ) => void;

  clearActiveStore: () => void;
}

export const useActiveStoreStore =
  create<ActiveStoreState>()(
    persist(
      (set) => ({
        activeStoreId: null,

        setActiveStore: (storeId) => {
          set({
            activeStoreId: storeId,
          });
        },

        clearActiveStore: () => {
          set({
            activeStoreId: null,
          });
        },
      }),
      {
        name: "active-store",
      },
    ),
  );