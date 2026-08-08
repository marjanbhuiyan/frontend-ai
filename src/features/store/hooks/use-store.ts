import {
  useMutation,
} from "@tanstack/react-query";
import {createStoredApi} from "@/features/store/api/store-api";
import { selectStoreApi } from "@/features/store/api/store-api";
import { getErrorMessage } from "@/utils/get-error-message";
import { normalizeUser } from "@/features/auth/utils/normalize-user";
import { toast } from "@/lib/toast";
import { useAuthStore } from "@/store/useAuthStore";



export function useCreateStore() {
  return useMutation({
    mutationFn: createStoredApi,
  });
}

export function useSelectStore() {
  return useMutation({
    mutationFn: (storeId: number) => selectStoreApi(storeId),
    onSuccess: async (res) => {
      const { accessToken, user: userData, store, menus, permissions } = res.data;
      const normalizedUser = normalizeUser({ ...userData, id: String(userData.id), avatar: userData.avatar_url ?? undefined }, permissions);
      useAuthStore.getState().setSession({
        accessToken,
        user: normalizedUser,
        store,
        permissions,
        menus,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to select store."));
    },
  });
}