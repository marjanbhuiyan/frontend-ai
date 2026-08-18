import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/platform/auth/stores/auth.store";
import { loginApi, registerApi } from "@/platform/auth/api/auth-api";
import { queryClient } from "@/lib/query-client";


export function useLogin() {
  const navigate = useNavigate();

  const setAccessToken =
    useAuthStore(
      (state) => state.setAccessToken,
    );

  return useMutation({
    mutationFn: loginApi,

    onSuccess: async (response) => {
      setAccessToken(
        response.accessToken,
      );

      await queryClient.invalidateQueries();

      navigate("/dashboard", {
        replace: true,
      });
    },
  });
}


export function useRegister() {
  const setAccessToken =
    useAuthStore(
      (state) => state.setAccessToken,
    );

  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerApi,

    onSuccess: (response) => {
      setAccessToken(
        response.accessToken,
      );

      navigate("/dashboard", {
        replace: true,
      });
    },
  });
}