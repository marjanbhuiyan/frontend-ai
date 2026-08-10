import { useMutation, useQuery } from "@tanstack/react-query";
import { createStoredApi, getMyStoresApi, selectStoreApi } from "@/features/store/api/store-api";
import { QUERY_KEYS } from "@/constants";
import { getErrorMessage } from "@/utils/get-error-message";
import { setStoredStoreId } from "@/utils/store-storage";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/lib/toast";



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
      // store (access token, user, permissions, menus + forbiddenRoutes).
      // Persist it into the Zustand store so the sidebar & routes reflect the
      // newly selected store, then reload to boot the app with that session.
      const {
        storeId,
        accessToken,
        user,
        permissions,
        menus,
        stores,
        forbiddenRoutes,
      } = res.data;

      useAuthStore.getState().setSession({
        accessToken,
        user,
        stores,
        permissions,
        menus,
        forbiddenRoutes,
      });
      setStoredStoreId(storeId);
      toast.success("Store selected successfully.");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to select store."));
    },
  });
}