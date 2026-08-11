import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { User } from "@/features/auth/types";
import type { Menu } from "@/features/menus/types";
import DynamicIcon from "@/components/common/dynamic-icon";
import type React from "react";
import MenuNode from "@/features/dashboard/components/menu";


function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "U";
}

function Sidebar({
  sidebarOpen,
  menus,
  user,
  onToggleSidebar,
}: {
  sidebarOpen: boolean;
  menus: Menu[];
  user?: User | null;
  onToggleSidebar?: () => void;
}): React.JSX.Element {
  const { pathname } = useLocation();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onToggleSidebar}
        />
      )}
      <aside
        className={`${sidebarOpen ? "w-[260px] translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden"} fixed inset-y-0 left-0 z-50 flex flex-shrink-0 flex-col border-r border-gray-100 bg-white transition-all duration-200 md:static md:z-auto`}
      >
      <div className="hidden items-center gap-2 px-5 py-4 md:flex">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M12 2L4 8.5L12 15L20 8.5L12 2Z" fill="#2563eb" />
          <path d="M4 8.5L12 22L20 8.5L12 15L4 8.5Z" fill="#93c5fd" />
        </svg>
        <span className="text-[1.1rem] font-semibold text-gray-800">Mantis</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3 text-[0.8125rem]">
        {menus.map((item, i) => (
          <MenuNode key={item.id ?? i} item={item} pathname={pathname} onToggleSidebar={onToggleSidebar} />
        ))}
      </nav>

      <div className="mx-3 mb-3 flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          {getInitials(user?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8125rem] font-medium text-gray-800">
            {user?.name ?? "Guest User"}
          </p>
          <p className="truncate text-[0.7rem] text-gray-400">
            {/* {user?.roles?.[0] ?? "UI/UX Designer"} */}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
      </div>
    </aside>
    </>
  );
}

export default Sidebar;
