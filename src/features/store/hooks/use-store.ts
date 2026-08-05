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



export function useCreateStore() {
  return useMutation({
    mutationFn: createStoredApi,
  });
}

export function useSelectStore() {
  const { initSession } = useAuth();

  return useMutation({
    mutationFn: (storeId: number) => selectStoreApi(storeId),
    onSuccess: async (res) => {
      const { accessToken, newUser, store, menus, permissions } = res.data;
      setToken(accessToken);
      initSession({
        user: normalizeUser({ ...newUser, id: String(newUser.id), avatar: newUser.avatar_url ?? undefined }, permissions),
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