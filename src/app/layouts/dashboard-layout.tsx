import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/shared/components/app-sidebar";
import { DashboardHeader } from "@/shared/components/dashboard-header";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* <AppSidebar /> */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* <DashboardHeader /> */}

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}