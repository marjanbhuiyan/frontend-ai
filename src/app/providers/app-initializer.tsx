import { useEffect, useState, type ReactNode } from "react";
import type React from "react";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { GlobalLoader } from "@/components/common/global-loader";
import { getToken } from "@/utils/token";
// import { getStoredStoreId } from "@/utils/store-storage";
// import { getMeApi } from "@/features/auth/api/auth-api";
import { initAppApi } from "@/app/api/app-init-api";
// import { getStoresApi } from "@/features/store/api/store-api";
// import { normalizeUser } from "@/features/auth/utils/normalize-user";
import { useMenus } from "@/features/menus/hooks/use-menus";
import { getMenus } from "@/features/menus/api/menus-api";


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
  const { setIsLoading: setAuthLoading, } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState<InitStep>("auth");

  useEffect(() => {
    let cancelled = false;

    async function initialize(): Promise<void> {
      setCurrentStep("auth");
      try {
        const token = getToken();

        if (!token) {
          setAuthLoading(false);
          setIsInitialized(true);
          cancelled = true;
        }

        if (cancelled) return;

        const res = await initAppApi();
        
        console.log("app init response", res.data);

        setAuthLoading(false);
        setIsInitialized(true);
      } catch {
        setAuthLoading(false);
        setIsInitialized(true);
      }
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
