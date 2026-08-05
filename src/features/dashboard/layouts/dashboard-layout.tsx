import { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Store, Loader2, LogOut, Search } from "lucide-react";
import Sidebar from "@/features/dashboard/components/sidebar";
import Header from "@/features/dashboard/pages/dashboard/header";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useSelectStore } from "@/features/store/hooks/use-store";
import { getStoredStoreId, setStoredStoreId } from "@/utils/store-storage";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StoreInfo } from "@/features/auth/types";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const q = searchQuery.toLowerCase();
    return stores.filter((s) => s.storeName.toLowerCase().includes(q));
  }, [stores, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="max-w-md gap-0 overflow-hidden p-0">
        <div className="flex items-center border-b border-gray-100 px-4">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stores..."
            autoFocus
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 sm:flex">
            Esc
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredStores.length === 0 ? (
            <div className="flex items-center justify-center px-4 py-8 text-sm text-gray-400">
              No stores found
            </div>
          ) : (
            filteredStores.map((store) => (
              <button
                key={store.storeId}
                type="button"
                disabled={isSwitching}
                onClick={() => onSelect(store)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <Store className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-800">{store.storeName}</p>
                  <p className="text-xs text-gray-400">Store ID: {store.storeId}</p>
                </div>
                {isSwitching ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
                ) : (
                  <span className="shrink-0 rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    Select
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { user, menus, stores, currentStore, setCurrentStore, selectStore, setSelectStore } = useAuth();

  const logout = useLogout();
  const selectStoreMutation = useSelectStore();

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
    setSelectStore(false);
    selectStoreMutation.mutate(store.storeId);
  };

  const showNoStoreModal = stores.length === 0;
  const showStoreSelectionModal = stores.length > 1 && selectStore;

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
          onSwitchStore={(store) => selectStoreMutation.mutate(store.storeId)}
          isSwitchingStore={selectStoreMutation.isPending}
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
        isSwitching={selectStoreMutation.isPending}
        onSelect={handleSelectStore}
      />
    </div>
  );
}
