import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/sidebar";
import Header from "@/features/dashboard/pages/dashboard/header";
import { useMenus } from "@/features/menus/hooks/use-menus";
import { useAuth } from "@/features/auth/hooks/auth-context";

export default function DashboardLayout() {
  const { setMenus } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const { data: menusRes, isLoading } = useMenus();

  useEffect(() => {
    if (menusRes?.data) {
      setMenus(menusRes.data);
    }
  }, [menusRes, setMenus]);

  if (isLoading) return <div>Loading...</div>;
  if (!menusRes?.data || menusRes.data.length === 0) return <div>no menus</div>;

  const user = { name: "John Doe", avatar: "", id: "123", email: "john.doe@example.com", roles: [], permissions: [] };
  const stores = [
    { id: 1, name: "Main Store", logo: null },
    { id: 2, name: "Dhaka Branch", logo: null },
    { id: 3, name: "Chittagong Warehouse", logo: null },
  ];
  const currentStore = stores[0];
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc] font-sans text-gray-800">
      <Sidebar sidebarOpen={sidebarOpen} menus={menusRes.data} user={user} onToggleSidebar={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          user={user}
          stores={stores}
          currentStore={currentStore}
          // onSwitchStore={(store) => switchStore.mutate(store)}
          onSwitchStore={(store) => {}}
          isSwitchingStore={false}
          onLogout={() => {}}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* <CreateStoreModal open={!hasStore} /> */}
    </div>
  );
}
