import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/sidebar";
import Header from "@/features/dashboard/pages/dashboard/header";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { useLogout, useInitApp } from "@/features/auth/hooks/use-auth";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { user, menus, stores, currentStore } = useAuth();

  console.log('stores', stores)
  const logout = useLogout();
  const switchStore = useInitApp();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc] font-sans text-gray-800">
      <Sidebar sidebarOpen={sidebarOpen} menus={menus} user={user} onToggleSidebar={() => setSidebarOpen(false)} />
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
          {stores && stores.length > 0 && <div>Hello</div>}
        </main>
      </div>
    </div>
  );
}
