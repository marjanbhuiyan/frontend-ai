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

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  menus: Menu[];
  permissions: string[];
  hasStore: boolean;
  stores: StoreInfo[];
  currentStore: StoreInfo | null;
  setUser: (user: User | null) => void;
  setMenus: (menus: Menu[]) => void;
  setPermissions: (permissions: string[]) => void;
  setHasStore: (hasStore: boolean) => void;
  setStores: (stores: StoreInfo[]) => void;
  setCurrentStore: (store: StoreInfo | null) => void;
  setIsLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  initSession: (data: { user: User; permissions: string[]; menus: Menu[]; store: StoreInfo }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [hasStore, setHasStore] = useState(false);
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [currentStore, setCurrentStore] = useState<StoreInfo | null>(null);

  const login = useCallback((user: User, token: string) => {
    setToken(token);
    setUser(user);
  }, []);

  const initSession = useCallback((data: { user: User; permissions: string[]; menus: Menu[]; store: StoreInfo }) => {
    setUser(data.user);
    setPermissions(data.permissions);
    setMenus(data.menus);
    setCurrentStore(data.store);
    setHasStore(true);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    clearStoredStoreId();
    setUser(null);
    setMenus([]);
    setPermissions([]);
    setStores([]);
    setCurrentStore(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        menus,
        permissions,
        hasStore,
        stores,
        currentStore,
        setUser,
        setMenus,
        setPermissions,
        setHasStore,
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
