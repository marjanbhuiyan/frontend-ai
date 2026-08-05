import { useEffect, useState, type ReactNode } from "react";
import type React from "react";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { GlobalLoader } from "@/components/common/global-loader";
import { getToken, clearToken } from "@/utils/token";
import { getStoresApi } from "@/features/store/api/store-api";
import { refreshTokenApi } from "@/features/auth/api/auth-api";


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
  const { setIsLoading: setAuthLoading, setStores, initSession, login } = useAuth();
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
        login(res?.data.accessToken, res?.data.user)
        setStores(res?.data.stores)
        if (cancelled) return;
      } catch {
        if (cancelled) return;
        clearToken();
      }

      // try {
      //   const storesRes = await getStoresApi();
      //   if (cancelled) return;
      //   setStores(storesRes.data);
      // } catch {
      //   console.error("[init] Failed to load stores");
      // }

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
