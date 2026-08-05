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
import { initAppApi } from "@/app/api/app-init-api";
import { getStoresApi, selectStoreApi } from "@/features/store/api/store-api";
import type {
  LoginInput,
  RegisterCredentials,
  AuthResponse,
  AppInitResponse,
  StoreInfo,
} from "@/features/auth/types";
import { clearToken, getToken, setToken } from "@/utils/token";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { QUERY_KEYS, ROUTES, DEFAULTS } from "@/constants";
import { toast } from "@/lib/toast";
import { normalizeUser } from "@/features/auth/utils/normalize-user";
import { getErrorMessage } from "@/utils/get-error-message";

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
  const { login, setStores, initSession } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginInput) => loginApi(credentials),
    onSuccess: async (res) => {
      const { accessToken, user } = res?.data;
      if (res?.data.stores) setStores(res?.data.stores);
      login(user, accessToken);
      // try {
      //   const initRes = await initAppApi();
      //   const { user: initUser, permissions, menus, store, stores } = initRes.data;
      //   initSession({ user: normalizeUser(initUser, permissions), permissions, menus, store, stores });
      // } catch (error) {
      //   toast.error(getErrorMessage(error, "Failed to initialize app."));
      // }
      // try {
      //   const storesRes = await getStoresApi();
      //   setStores(storesRes.data);
      // } catch (error) {
      //   console.error("[login] Failed to load stores:", error);
      // }
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
      const { user, store, permissions, menus, stores } = res.data;
      initSession({ user: normalizeUser(user, permissions), permissions, menus, store, stores });
      await new Promise((resolve) => setTimeout(resolve, 0));
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to initialize app."));
    },
  });
}

// export function useSelectStore() {
//   const { initSession } = useAuth();

//   return useMutation({
//     mutationFn: (storeId: number) => selectStoreApi(storeId),
//     onSuccess: async (res) => {
//       const { accessToken, newUser, store, menus, permissions } = res.data;
//       setToken(accessToken);
//       initSession({
//         user: normalizeUser({ ...newUser, id: String(newUser.id), avatar: newUser.avatar_url ?? undefined }, permissions),
//         permissions,
//         menus,
//         store,
//       });
//     },
//     onError: (error) => {
//       toast.error(getErrorMessage(error, "Failed to select store."));
//     },
//   });
// }

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
