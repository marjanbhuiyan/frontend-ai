import { useEffect, useState, type ReactNode } from "react";
import type React from "react";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { GlobalLoader } from "@/components/common/global-loader";
import { getToken } from "@/utils/token";
// import { getStoredStoreId } from "@/utils/store-storage";
// import { getMeApi } from "@/features/auth/api/auth-api";
// import { initAppApi } from "@/features/auth/api/app-init-api";
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
      try {
        setCurrentStep("auth");

        setTimeout(() => {
          console.log("Timeout completed");
        }, 200000);
        // const token = getToken();

        // if (!token) {
        //   console.log("No token found");
        //   setAuthLoading(false);
        //   setIsInitialized(true);
        //   return;
        // }

        if (cancelled) return;


        // const res = await initAppApi();

        // console.log("app init response", res.data);

        // const { user, permissions, menus, store } = res.data;
            if (cancelled) return;
            // initSession({ user: normalizeUser(user, permissions), permissions, menus, store });

        // try {
        //   // const storesRes = await getStoresApi();
        //   // if (!cancelled) setStores(storesRes.data);
        // } catch (err) {
        //   console.error("[init] Failed to load stores list:", err);
        // }

        // if (cancelled) return;

        
        // const storeId = getStoredStoreId();
        // if (storeId) {
        //   setCurrentStep("profile");
        //   try {
        //     const res = await initAppApi(storeId);
        //     const { user, permissions, menus, store } = res.data;
        //     if (cancelled) return;
        //     initSession({ user: normalizeUser(user, permissions), permissions, menus, store });
        //   } catch (err) {
        //     console.error("[init] /app/init failed, trying /me:", err);
        //     try {
        //       const res = await getMeApi();
        //       const meData = res.data;
        //       const user = normalizeUser(meData.user, meData.permissions);
        //       setUser(user);
        //       setPermissions(meData.permissions);
        //       setMenus(meData.menus);
        //       setHasStore(meData.hasStore ?? false);
        //       setStores(meData.stores ?? []);
        //     } catch {
        //       console.error("[init] /me also failed, clearing session");
        //       setAuthLoading(false);
        //       setIsInitialized(true);
        //       return;
        //     }
        //   }
        // } else {
        //   setCurrentStep("profile");
        //   try {
        //     const res = await initAppApi();
        //     const { user, permissions, menus, store } = res.data;
        //     console.log("[init] /app/init success", { user, permissions, menus, store });
        //     initSession({ user: normalizeUser(user, permissions), permissions, menus, store });
        //   } catch {
        //     console.error("[init] No store ID and /me failed");
        //     setAuthLoading(false);
        //     setIsInitialized(true);
        //     return;
        //   }
        // }
       

        if (cancelled) return;

        setCurrentStep("complete");
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
