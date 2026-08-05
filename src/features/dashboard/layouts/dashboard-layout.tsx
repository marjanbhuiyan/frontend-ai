import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Store, Loader2, LogOut } from "lucide-react";
import Sidebar from "@/features/dashboard/components/sidebar";
import Header from "@/features/dashboard/pages/dashboard/header";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useSelectStore } from "@/features/store/hooks/use-store";
import { getStoredStoreId, setStoredStoreId } from "@/utils/store-storage";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { StoreInfo } from "@/features/auth/types";
import Select, { components } from "react-select";

import type React from "react";

function NoStoreAccessModal({ open, onLogout }: { open: boolean; onLogout: () => void }): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="max-w-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <Store className="h-6 w-6 text-blue-600" />
        </div>
        <DialogTitle className="mt-2">No Store Access</DialogTitle>
        <p className="text-sm leading-relaxed text-gray-500">
          You don't have access to any store yet. Please contact your administrator to get store access.
        </p>
        <Button variant="outline" className="mt-2" onClick={onLogout}>
          <LogOut />
          Logout
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function StoreSelectionModal({
  open,
  stores,
  isSwitching,
  onSelect,
}: {
  open: boolean;
  stores: StoreInfo[];
  isSwitching: boolean;
  onSelect: (store: StoreInfo) => void;
}): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="max-w-md gap-0 p-0">
        <div className="border-b border-gray-100 px-4 py-3">
          <DialogTitle className="text-base font-semibold text-gray-800">Select a Store</DialogTitle>
        </div>
        <div className="px-4 py-4">
          <Select
            options={stores.map((store) => ({
              value: store.storeId,
              label: store.storeName,
              store,
            }))}
            onChange={(option) => {
              if (option) {
                onSelect(option.store);
              }
            }}
            isSearchable
            isDisabled={isSwitching}
            isLoading={isSwitching}
            placeholder="Search stores..."
            autoFocus
            menuIsOpen
            openMenuOnClick={false}
            components={{
              Option: ({ children, ...props }) => (
                <components.Option {...props}>
                  <div className="flex items-center gap-3 py-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Store className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-800">{props.data.store.storeName}</p>
                      <p className="text-xs text-gray-400">Store ID: {props.data.store.storeId}</p>
                    </div>
                  </div>
                </components.Option>
              ),
              SingleValue: ({ children, ...props }) => (
                <components.SingleValue {...props}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Store className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-800">{props.data.store.storeName}</p>
                      <p className="text-xs text-gray-400">Store ID: {props.data.store.storeId}</p>
                    </div>
                  </div>
                </components.SingleValue>
              ),
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            noOptionsMessage={() => "No stores found"}
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
                boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                "&:hover": { borderColor: "#d1d5db" },
                borderRadius: "0.5rem",
                minHeight: "2.75rem",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "0.5rem",
                border: "1px solid #f3f4f6",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                marginTop: "0.25rem",
                maxHeight: "20rem",
              }),
              menuList: (base) => ({
                ...base,
                padding: "0.5rem",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#eff6ff"
                  : state.isFocused
                  ? "#f9fafb"
                  : "transparent",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                cursor: state.isDisabled ? "not-allowed" : "pointer",
                opacity: state.isDisabled ? 0.6 : 1,
                ":active": {
                  backgroundColor: "#eff6ff",
                },
              }),
              input: (base) => ({
                ...base,
                fontSize: "0.875rem",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#9ca3af",
                fontSize: "0.875rem",
              }),
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { user, menus, stores, currentStore, setCurrentStore } = useAuth();

  console.log("stores", stores)

  const logout = useLogout();
  const selectStore = useSelectStore();

  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(() => {
    const storedId = getStoredStoreId();
    return storedId !== null && stores.some((s) => s.storeId === storedId) ? storedId : null;
  });

  useEffect(() => {
    if (stores.length === 1 && currentStore?.storeId !== stores[0].storeId) {
      setStoredStoreId(stores[0].storeId);
      setCurrentStore(stores[0]);
    }
  }, [stores, currentStore, setCurrentStore]);

  const handleSelectStore = (store: StoreInfo) => {
    console.log("Selected store:", store);
    setStoredStoreId(store.storeId);
    setSelectedStoreId(store.storeId);
    selectStore.mutate(store.storeId);
  };

  const showNoStoreModal = stores.length === 0;
  const showStoreSelectionModal = stores.length > 1 && currentStore?.storeId !== selectedStoreId;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc] font-sans text-gray-800">
      <Sidebar sidebarOpen={sidebarOpen} menus={menus} user={user} onToggleSidebar={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          user={user}
          stores={stores}
          currentStore={currentStore}
          onSwitchStore={(store) => selectStore.mutate(store.storeId)}
          isSwitchingStore={selectStore.isPending}
          onLogout={() => logout.mutate()}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <NoStoreAccessModal open={showNoStoreModal} onLogout={() => logout.mutate()} />
      <StoreSelectionModal
        open={showStoreSelectionModal}
        stores={stores}
        isSwitching={selectStore.isPending}
        onSelect={handleSelectStore}
      />
    </div>
  );
}
