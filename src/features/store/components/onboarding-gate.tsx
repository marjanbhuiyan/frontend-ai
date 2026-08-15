import { useEffect, useMemo, useState } from "react";
import { Search, Store, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMyStores, useSelectStore } from "@/features/store/hooks/use-store";
import { useAuthStore } from "@/store/useAuthStore";
import { getStoredStoreId } from "@/utils/store-storage";
import type { StoreInfo } from "@/features/auth/types";
import { useCurrentSubscription } from "@/features/subscription/hooks/use-subscription";
import { SubscriptionModal } from "@/features/subscription/components/subscription-modal";
import CreateStoreModal from "@/features/dashboard/pages/dashboard/create-store-modal";

/**
 * Modal shown when the user has multiple stores and none selected yet. Mirrors
 * the legacy StoreSelectionModal that used to live in DashboardLayout — the
 * original block there is left commented out; this is the live replacement.
 */
function StoreSelectModal({
  stores,
  isSwitching,
  onSelect,
}: {
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
    <Dialog open onOpenChange={() => {}} disablePointerDismissal>
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
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          <p className="px-3 py-2 text-xs font-medium text-gray-500">Select a store to continue</p>
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

/**
 * Renders the post-login onboarding gate. Order of checks:
 *   1. No subscription      -> SubscriptionModal (pick a plan)
 *   2. Has subscription:
 *      a. 0 stores          -> CreateStoreModal
 *      b. 1 store           -> nothing
 *      c. >1 stores, none selected -> StoreSelectModal
 *      d. >1 stores, one selected  -> nothing
 *
 * The gate renders `null` (no overlay) whenever nothing needs attention, so it
 * is safe to mount inside DashboardLayout next to the existing chrome.
 */
export function OnboardingGate(): React.JSX.Element | null {
  const subQuery = useCurrentSubscription();
  const myStoresQuery = useMyStores();
  const selectStoreMutation = useSelectStore();
  const { stores: sessionStores, subscription } = useAuthStore();

  const fetchedStores = myStoresQuery.data?.data ?? [];
  const hasFetchedStores = myStoresQuery.data !== undefined;

  // Prefer the store's subscription (set immediately by login/register/subscribe)
  // and only fall back to the freshly fetched query — which covers hard refreshes
  // where the bootstrap session may not carry the subscription.
  const querySub = subQuery.data?.data;
  const hasSubscription = subscription?.hasSubscription ?? querySub?.hasSubscription;

  const currentStore = sessionStores[0] ?? null;
  const hasSelectedStore = !!currentStore || getStoredStoreId() != null;

  // Fetch the real store list once we know the user has an active plan. The
  // login/register response reports `stores: []` even when the user owns
  // stores, so /stores/my-stores is the source of truth for the store count.
  useEffect(() => {
    if (hasSubscription && !hasFetchedStores) {
      myStoresQuery.refetch();
    }
  }, [hasSubscription, hasFetchedStores, myStoresQuery]);

  const handleSelectStore = (store: StoreInfo) => {
    selectStoreMutation.mutate(store.storeId);
  };

  if (subQuery.isLoading) return null;

  if (!hasSubscription) {
    return <SubscriptionModal />;
  }

  // Waiting for the store list to be fetched.
  if (!hasFetchedStores || myStoresQuery.isFetching) return null;

  if (fetchedStores.length === 0) {
    return <CreateStoreModal open onSuccess={() => myStoresQuery.refetch()} />;
  }

  if (fetchedStores.length > 1 && !hasSelectedStore) {
    return (
      <StoreSelectModal
        stores={fetchedStores}
        isSwitching={selectStoreMutation.isPending}
        onSelect={handleSelectStore}
      />
    );
  }

  return null;
}

export default OnboardingGate;
