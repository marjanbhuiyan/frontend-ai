import { useEffect, useState, type ReactNode } from "react";
import type React from "react";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { GlobalLoader } from "@/components/common/global-loader";
import { getToken, setToken, clearToken } from "@/utils/token";
import { refreshTokenApi } from "@/features/auth/api/auth-api";
import { getStoresApi } from "@/features/store/api/store-api";
import { normalizeUser } from "@/features/auth/utils/normalize-user";

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
  const { setIsLoading: setAuthLoading, setStores, setUser } = useAuth();
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
      try {
        const res = await refreshTokenApi();
        const { accessToken, user } = res.data;
        if (cancelled) return;
        setToken(accessToken);
        setUser(normalizeUser({ ...user, id: String(user.id), avatar: user.avatar_url ?? undefined }));
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
