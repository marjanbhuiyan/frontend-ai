import { useMutation } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { createStoredApi } from "@/features/store/api/store-api";
import type { CreateStoreForm } from "@/features/store/types";
import { getErrorMessage } from "@/features/auth/utils/error-message";

export function useCreateStore() {
  return useMutation({
    mutationFn: (payload: CreateStoreForm) => createStoredApi(payload),
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (error) => {
      const msg = getErrorMessage(error, "Failed to create store.");
      toast.error(msg);
    },
  });
}
