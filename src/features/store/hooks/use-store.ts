import {
  useMutation,
} from "@tanstack/react-query";
import {createStoredApi} from "@/features/store/api/store-api";


export function useCreateStore() {
  return useMutation({
    mutationFn: createStoredApi,
  });
}