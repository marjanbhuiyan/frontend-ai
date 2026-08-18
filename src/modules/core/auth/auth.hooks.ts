import { useMutation} from "@tanstack/react-query";
import { useNavigate} from "react-router-dom";

import {
  logoutApi,
} from "@/app/api/auth.api";

import {
  useAuthStore,
} from "@/platform/stores/auth.store";

import {
  useActiveStoreStore,
} from "@/platform/stores/active-store.store";

import {
  queryClient,
} from "@/app/query/query-client";

export function useLogout() {
  const navigate =
    useNavigate();

  const clearAuth =
    useAuthStore(
      (state) =>
        state.clearAuth,
    );

  const clearStore =
    useActiveStoreStore(
      (state) =>
        state.clearActiveStore,
    );

  return useMutation({
    mutationFn: logoutApi,

    onSettled: () => {
      clearAuth();

      clearStore();

      queryClient.clear();

      navigate(
        "/login",
        {
          replace: true,
        },
      );
    },
  });
}