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
import { initAppApi } from "@/features/auth/api/app-init-api";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  AppInitResponse,
  StoreInfo,
} from "@/features/auth/types";
import { setToken, clearToken, getToken } from "@/utils/token";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { QUERY_KEYS, ROUTES, DEFAULTS } from "@/constants";
import { toast } from "@/lib/toast";
import { normalizeUser } from "@/features/auth/utils/normalize-user";
// import type { RegisterFormData } from "@/features/auth/types";


type FieldError = { field: string; message: string };

type ApiError = AxiosError<{
  success: boolean;
  message: string;
  errors?: string[] | FieldError[];
  data: null;
}>;

const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as ApiError;
  const errors = err.response?.data?.errors;
  const message = err.response?.data?.message;
  if (errors && errors.length > 0) {
    const first = errors[0];
    if (typeof first === "string") return errors.join(", ");
    if (typeof first === "object" && "message" in first) return first.message;
  }
  if (message) return message;
  return fallback;
};

export function getFieldErrors(error: unknown): Record<string, string> {
  const err = error as ApiError;
  const errors = err.response?.data?.errors;
  if (!errors || !Array.isArray(errors)) return {};
  const result: Record<string, string> = {};
  for (const e of errors) {
    if (typeof e === "object" && "field" in e && "message" in e) {
      result[e.field] = e.message;
    }
  }
  return result;
}

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

export function useLogin(): UseMutationResult<AuthResponse, Error, LoginCredentials> {
  const { setHasStore, setStores, login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: async (res) => {
      const { accessToken, hasStore, stores, user } = res.data;
      console.log("res", res);
      login(user, accessToken);
      if(hasStore == true){
        console.log("Has store");
        setHasStore(true);
      }else{
        console.log("No store");
        setHasStore(false);
      }
      setStores(stores ?? []);
      toast.success(res.message);
      navigate(ROUTES.DASHBOARD)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed. Please check your credentials."));
    },
  });
}

export function useInitApp(): UseMutationResult<AppInitResponse, Error, StoreInfo> {
  const navigate = useNavigate();
  const { initSession } = useAuth();

  return useMutation({
    mutationFn: () => initAppApi(),
    onSuccess: async (res) => {
      const { user, store, permissions, menus } = res.data;
      initSession({ user: normalizeUser(user, permissions), permissions, menus, store });
      await new Promise((resolve) => setTimeout(resolve, 0));
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to initialize app."));
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
