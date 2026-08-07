import {
  useMutation,
} from "@tanstack/react-query";
import {createStoredApi} from "@/features/store/api/store-api";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { selectStoreApi } from "@/features/store/api/store-api";
import { getErrorMessage } from "@/utils/get-error-message";
import { normalizeUser } from "@/features/auth/utils/normalize-user";
import { setToken } from "@/utils/token";
import { toast } from "@/lib/toast";
import { useAuthStore } from "@/store/useAuthStore";



export function useCreateStore() {
  return useMutation({
    mutationFn: createStoredApi,
  });
}

export function useSelectStore() {
  const { initSession, setSelectStore } = useAuth();

  return useMutation({
    mutationFn: (storeId: number) => selectStoreApi(storeId),
    onSuccess: async (res) => {
      const { accessToken, user: userData, store, menus, permissions } = res.data;
      setToken(accessToken);
      setSelectStore(false);
      const normalizedUser = normalizeUser({ ...userData, id: String(userData.id), avatar: userData.avatar_url ?? undefined }, permissions);
      useAuthStore.getState().setSession({
        accessToken,
        user: normalizedUser,
        store,
        permissions,
        menus,
      });
      initSession({
        user: normalizedUser,
        permissions,
        menus,
        store,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to select store."));
    },
  });
}