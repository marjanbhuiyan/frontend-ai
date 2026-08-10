import { useEffect, useState, type ReactNode } from "react";
import type React from "react";
import axios from "axios";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { GlobalLoader } from "@/components/common/global-loader";
import { getToken, setToken, clearToken } from "@/utils/token";
import { getStoresApi } from "@/features/store/api/store-api";
import { getMeApi } from "@/features/auth/api/auth-api";
import { normalizeUser } from "@/features/auth/utils/normalize-user";
import type { Menu, StoreInfo, User } from "@/features/auth/types";
import { useAuthStore } from "@/store/useAuthStore";
import { API_BASE_URL } from "@/constants";

type InitStep =
  | "auth"
  | "profile"
  | "permissions"
  | "tenant"
  | "settings"
  | "complete";

const STEP_LABELS: Record<InitStep, string> = {
  auth: "Checking authentication...",
  profile: "Loading user profile...",
  permissions: "Loading permissions & roles...",
  tenant: "Loading tenant configuration...",
  settings: "Applying theme & language settings...",
  complete: "Ready!",
};

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps): React.JSX.Element {
  const { setIsLoading: setAuthLoading, setStores, setUser, setMenus, setPermissions } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState<InitStep>("auth");

  useEffect(() => {
    let cancelled = false;

    async function initialize(): Promise<void> {
      setCurrentStep("auth");
      const token = getToken();

      if (!token) {
        setAuthLoading(false);
        setIsInitialized(true);
        return;
      }

      setCurrentStep("profile");
      let accessToken = "";
      let normalizedUser: User | undefined;
      try {
        const { data: res } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { user } = res.data;
        if (cancelled) return;
        accessToken = res.data.accessToken;
        setToken(accessToken);
        normalizedUser = normalizeUser({ ...user, id: String(user.id), avatar: user.avatar_url ?? undefined });
        setUser(normalizedUser);
        useAuthStore.getState().setSession({
          accessToken,
          user: normalizedUser,
          store: undefined as never,
          // Preserve the persisted (already backend-scoped) session instead of
          // wiping menus/permissions — a hard refresh must keep the last
          // selected store's menus intact until /auth/me refreshes them below.
          permissions: useAuthStore.getState().permissions,
          menus: useAuthStore.getState().menus,
          forbiddenRoutes: useAuthStore.getState().forbiddenRoutes,
        });
      } catch {
        if (cancelled) return;
        clearToken();
        setAuthLoading(false);
        setIsInitialized(true);
        return;
      }

      try {
        const storesRes = await getStoresApi();
        if (cancelled) return;
        setStores(storesRes.data);
      } catch {
        // stores may fail — user still sees dashboard with no-store modal
      }

      // Load the store-scoped permission & menu tree once, then persist it into
      // the Zustand store (single source of truth for the sidebar & router).
      // /auth/me returns the menus/permissions/forbiddenRoutes the backend
      // filtered for the current user + selected store.
      let sessionMenus: Menu[] = [];
      let sessionPermissions: string[] = [];
      let sessionForbiddenRoutes: string[] = [];
      let sessionStores: StoreInfo[] = [];
      try {
        const meRes = await getMeApi();
        if (cancelled) return;
        sessionMenus = meRes.data.menus ?? [];
        sessionPermissions = meRes.data.permissions ?? [];
        sessionForbiddenRoutes = meRes.data.forbiddenRoutes ?? [];
        sessionStores = meRes.data.stores ?? [];
      } catch {
        // /auth/me unavailable — fall back to the persisted session below
      }

      const persisted = useAuthStore.getState();
      useAuthStore.getState().setSession({
        accessToken,
        user: normalizedUser!,
        store: undefined as never,
        stores: sessionStores.length ? sessionStores : persisted.stores,
        menus: sessionMenus.length ? sessionMenus : persisted.menus,
        permissions: sessionPermissions.length ? sessionPermissions : persisted.permissions,
        forbiddenRoutes: sessionForbiddenRoutes.length ? sessionForbiddenRoutes : persisted.forbiddenRoutes,
      });
      setMenus(sessionMenus.length ? sessionMenus : persisted.menus);
      setPermissions(sessionPermissions.length ? sessionPermissions : persisted.permissions);

      setCurrentStep("complete");
      setAuthLoading(false);
      setIsInitialized(true);
    }
    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isInitialized) {
    return (
      <GlobalLoader
        message="Starting application..."
        subMessage={STEP_LABELS[currentStep]}
      />
    );
  }

  return <>{children}</>;
}
