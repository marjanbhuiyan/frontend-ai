import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Menu, StoreInfo } from "@/features/auth/types";
import { setToken, clearToken } from "@/utils/token";
import { clearStoredStoreId } from "@/utils/store-storage";
import { useAuthStore } from "@/store/useAuthStore";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  menus: Menu[];
  permissions: string[];
  appInitialize: boolean;
  stores: StoreInfo[];
  selectStore: boolean;
  currentStore: StoreInfo | null;
  setUser: (user: User | null) => void;
  setSelectStore: (selectStore: boolean) => void;
  setMenus: (menus: Menu[]) => void;
  setPermissions: (permissions: string[]) => void;
  setAppInitialize: (appInitialize: boolean) => void;
  setStores: (stores: StoreInfo[]) => void;
  setCurrentStore: (store: StoreInfo | null) => void;
  setIsLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  initSession: (data: { user: User; permissions: string[]; menus: Menu[]; store: StoreInfo; stores?: StoreInfo[] }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [appInitialize, setAppInitialize] = useState(false);
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [currentStore, setCurrentStore] = useState<StoreInfo | null>(null);
  const [selectStore, setSelectStore] = useState<boolean>(false);

  const login = useCallback((user: User, token: string) => {
    setToken(token);
    setUser(user);
    useAuthStore.getState().setSession({
      accessToken: token,
      user,
      store: undefined as never,
      permissions: [],
      menus: [],
    });
  }, []);

  const initSession = useCallback((data: { user: User; permissions: string[]; menus: Menu[]; store: StoreInfo; stores?: StoreInfo[] }) => {
    setUser(data.user);
    setPermissions(data.permissions);
    setMenus(data.menus);
    setCurrentStore(data.store);
    if (data.stores) setStores(data.stores);
    setAppInitialize(true);
    useAuthStore.getState().setSession({
      accessToken: useAuthStore.getState().accessToken ?? "",
      user: data.user,
      store: data.store as never,
      permissions: data.permissions,
      menus: data.menus,
    });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    clearStoredStoreId();
    setUser(null);
    setMenus([]);
    setPermissions([]);
    setStores([]);
    setCurrentStore(null);
    useAuthStore.getState().clear();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        menus,
        permissions,
        appInitialize,
        stores,
        currentStore,
        selectStore,
        setSelectStore,
        setUser,
        setMenus,
        setPermissions,
        setAppInitialize,
        setStores,
        setCurrentStore,
        setIsLoading,
        login,
        initSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
