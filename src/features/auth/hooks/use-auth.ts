import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  loginApi,
  logoutApi,
  registerApi,
  getMeApi,
} from "@/features/auth/api/auth-api";
import type {
  LoginInput,
  AuthResponse,
} from "@/features/auth/types";
import { clearToken, getToken } from "@/utils/token";
import { QUERY_KEYS, ROUTES, DEFAULTS } from "@/constants";
import { toast } from "@/lib/toast";
import { getErrorMessage } from "@/utils/get-error-message";
  import { useAuthStore } from "@/store/useAuthStore";

export function useMe(): UseQueryResult<AuthResponse, Error> {
  const token = getToken();
  return useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: getMeApi,
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: DEFAULTS.ME_STALE_TIME,
  });
}

export function useLogin(){
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginInput) => loginApi(credentials),
    onSuccess: async (res) => {
      const { accessToken, user, menus, stores, permissions, forbiddenRoutes, subscription } = res?.data;
      useAuthStore.getState().setSession({ accessToken, user, stores, menus, permissions, forbiddenRoutes, subscription });
      toast.success(res.message);
      navigate(ROUTES.DASHBOARD)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed. Please check your credentials."));
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) => registerApi(formData),
    onSuccess: async (res) => {
      // Registration returns a full session (access token, user, subscription,
      // stores) so the user is logged in immediately and forwarded to the
      // dashboard, where the onboarding gate picks the plan / creates a store.
      const { accessToken, user, menus, stores, permissions, forbiddenRoutes, subscription } = res?.data;
      useAuthStore.getState().setSession({
        accessToken,
        user,
        stores: stores ?? [],
        menus: menus ?? [],
        permissions: permissions ?? [],
        forbiddenRoutes: forbiddenRoutes ?? [],
        subscription,
      });
      toast.success(res.message);
      navigate(ROUTES.DASHBOARD)
    },
    onError: (error) => {
      if (error instanceof AxiosError){
        toast.error(error.response?.data.message || "Registration failed. Please try again.");
      }else{
        toast.error("Registration failed. Please try again.");
      }
    },
  });
}

export function useLogout(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      useAuthStore.getState().clearSession();
      queryClient.clear();
      toast.success("Logged out successfully.");
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Logout failed. Please try again."));
    },
  });
}
