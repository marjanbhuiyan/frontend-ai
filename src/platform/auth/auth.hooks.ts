import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutApi, loginApi } from "@/platform/auth/auth.api";
import { useAuthStore } from "@/platform/auth/auth.store";
import { useActiveStoreStore } from "@/platform/stores/active-store.store";
import { queryClient } from "@/platform/query/query-client";

export function useLogout() {
  const navigate = useNavigate();

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const clearStore = useActiveStoreStore((state) => state.clearActiveStore);

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


export function useLogin() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  
  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (response) => {
      setAccessToken(response.accessToken);
       queryClient.clear();
      navigate("/dashboard", { replace: true });
    },
  });
}
