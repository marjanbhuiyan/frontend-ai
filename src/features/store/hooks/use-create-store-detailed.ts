import { useMutation } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { createStoredApi } from "@/features/store/api/store-api";
import type { CreateStoreForm } from "@/features/store/types";
import { getErrorMessage } from "@/features/auth/utils/error-message";

export function useCreateStoreDetailed() {
  return useMutation({
    mutationFn: (payload: CreateStoreForm) => createStoredApi(payload),
    onSuccess: (res) => {
      console.log("res store create", res);
      // const { accessToken, hasStore, stores } = res.data;
      // setToken(accessToken);
      // setHasStore(hasStore);
      // setStores(stores);
      // toast.success(res.message);

      // const newStore = stores[stores.length - 1];
      // if (newStore) {
      //   switchStore.mutate(newStore);
      // }
    },
    onError: (error) => {
      const msg = getErrorMessage(error, "Failed to create store.");
      toast.error(msg);
    },
  });
}
