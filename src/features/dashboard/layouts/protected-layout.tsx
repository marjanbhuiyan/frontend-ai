import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { useLogout, useInitApp } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/constants";
import Sidebar from "@/features/dashboard/pages/dashboard/sidebar";
import Header from "@/features/dashboard/pages/dashboard/header";

export default function ProtectedLayout() {
  const { user, menus, currentStore, stores, hasStore } = useAuth();
  const logout = useLogout();
  const switchStore = useInitApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log("hasStore", hasStore);

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc] font-sans text-gray-800">
      <Sidebar sidebarOpen={sidebarOpen} menus={menus} user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          user={user}
          stores={stores}
          currentStore={currentStore}
          onSwitchStore={(store) => switchStore.mutate(store)}
          isSwitchingStore={switchStore.isPending}
          onLogout={() => logout.mutate()}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* <CreateStoreModal open={!hasStore} /> */}
    </div>
  );
}
