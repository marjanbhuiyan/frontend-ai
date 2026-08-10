import { useMutation, useQuery } from "@tanstack/react-query";
import { createStoredApi, getMyStoresApi, selectStoreApi } from "@/features/store/api/store-api";
import { QUERY_KEYS } from "@/constants";
import { getErrorMessage } from "@/utils/get-error-message";
import { setStoredStoreId } from "@/utils/store-storage";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/lib/toast";
import { normalizeUser } from "@/features/auth/utils/normalize-user";



export function useCreateStore() {
  return useMutation({
    mutationFn: createStoredApi,
  });
}

export function useMyStores() {
  return useQuery({
    queryKey: QUERY_KEYS.MY_STORES,
    queryFn: getMyStoresApi,
    enabled: false,
  });
}

export function useSelectStore() {
  return useMutation({
    mutationFn: (storeId: number) => selectStoreApi(storeId),
    onSuccess: (res) => {
      // Mirrors useLogin — the backend returns a session scoped to the chosen
      // store (access token, user, permissions, menus + forbiddenRoutes) for
      // the newly selected store.
      const {
        storeId,
        accessToken,
        user,
        permissions,
        menus,
        stores,
        forbiddenRoutes,
      } = res.data;

      // The `stores` key in the response is a SINGLE store object
      // (`{ id, name, ... }`), not an array — unlike `/stores/my-stores`.
      // Normalize here so the persisted session always holds an array using
      // the `StoreInfo` shape (`storeId`/`storeName`) the switcher expects.
      const selectedStore = Array.isArray(stores) ? stores[0] : stores;
      const selectedStoreInfo = selectedStore
        ? {
            storeId: selectedStore.id,
            storeName: selectedStore.name,
            logo: selectedStore.logo ?? null,
          }
        : null;

      // Backend puts the selected store's id on `stores.id`; the top-level
      // `storeId` field is absent in some responses so fall back to it.
      const resolvedStoreId = selectedStore?.id ?? storeId;

      // The select-store user shape differs from `User` (numeric `id` +
      // `avatarUrl` instead of `avatar`), so normalize it the same way the
      // app-initializer does for the refresh flow.
      const normalizedUser = normalizeUser({
        ...user,
        id: String(user.id),
        avatar: (user as { avatarUrl?: string }).avatarUrl ?? undefined,
      });

      // Apply the new session directly — no reload needed since /auth/refresh
      // returns the same payload on a hard refresh anyway.
      useAuthStore.getState().setSession({
        accessToken,
        user: normalizedUser,
        stores: selectedStoreInfo ? [selectedStoreInfo] : [],
        permissions,
        menus,
        forbiddenRoutes,
      });
      if (resolvedStoreId != null) setStoredStoreId(resolvedStoreId);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to select store."));
    },
  });
}