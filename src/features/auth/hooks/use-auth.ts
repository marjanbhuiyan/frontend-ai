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
import { useAuth } from "@/features/auth/hooks/auth-context";
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
      const { accessToken, user, menus, stores, permissions, forbiddenRoutes } = res?.data;
      useAuthStore.getState().setSession({ accessToken, user, stores, menus, permissions, forbiddenRoutes });
      toast.success(res.message);
      navigate(ROUTES.DASHBOARD)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed. Please check your credentials."));
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (formData: FormData) => registerApi(formData),
    onSuccess: async (res) => {
      toast.success(res.message);
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
  const { setUser, setPermissions, setMenus } = useAuth();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      clearToken();
      setUser(null);
      setPermissions([]);
      setMenus([]);
      queryClient.clear();
      toast.success("Logged out successfully.");
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Logout failed. Please try again."));
    },
  });
}
