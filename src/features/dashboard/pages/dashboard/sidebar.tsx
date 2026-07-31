import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Menu, User } from "@/features/auth/types";
import DynamicIcon from "@/components/common/dynamic-icon";
import type React from "react";

function MenuBadge({
  badge,
}: {
  badge: NonNullable<Menu["badge"]>;
}): React.JSX.Element {
  const variants: Record<string, string> = {
    teal: "bg-teal-50 text-teal-600",
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    default: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[0.6rem] font-semibold leading-none ${variants[badge.variant] || variants.default}`}
    >
      {badge.title}
    </span>
  );
}

function isActive(url: string | undefined, pathname: string): boolean {
  if (!url) return false;
  if (url === "/") return pathname === "/";
  return pathname === url || pathname.startsWith(url + "/");
}

function anyChildActive(
  children: Menu[] | undefined,
  pathname: string,
): boolean {
  if (!children) return false;
  return children.some(
    (c) => isActive(c.url, pathname) || anyChildActive(c.children, pathname),
  );
}

function MenuItem({
  item,
  pathname,
  subItem,
  onToggleSidebar,
}: {
  item: Menu;
  pathname: string;
  subItem?: boolean;
  onToggleSidebar?: () => void;
}): React.JSX.Element {
  const navigate = useNavigate();
  const active = isActive(item.url, pathname);

  const handleClick = () => {
    if (item.url) {
      navigate(item.url);
      if (window.innerWidth < 768) {
        onToggleSidebar?.();
      }
    }
  };

  if (subItem) {
    return (
      <button
        onClick={handleClick}
        className={`relative w-full rounded-none py-1.5 pl-8 pr-2 text-left text-[0.8125rem] transition-colors ${
          active
            ? "bg-blue-50 font-medium text-blue-600 border-r-2 border-blue-600"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        }`}
      >
        {item.title}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[0.8125rem] transition-colors ${
          active
            ? "bg-blue-50 font-medium text-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <DynamicIcon name={item.icon} size={17} strokeWidth={1.75} />
        <span className="flex-1 text-left">{item.title}</span>
        {item.badge && <MenuBadge badge={item.badge} />}
      </button>
      {item.children && (
        <div className="mt-0.5 flex flex-col gap-0.5 border-l border-gray-100">
          {item.children.map((child, i) => (
            <MenuNode key={child.id ?? i} item={child} pathname={pathname} subItem onToggleSidebar={onToggleSidebar} />
          ))}
        </div>
      )}
    </div>
  );
}

function MenuCollapse({
  item,
  depth,
  pathname,
  onToggleSidebar,
}: {
  item: Menu;
  depth: number;
  pathname: string;
  onToggleSidebar?: () => void;
}): React.JSX.Element {
  const [expanded, setExpanded] = useState(
    depth === 0 || anyChildActive(item.children, pathname),
  );

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const active = anyChildActive(item.children, pathname);

  return (
    <div>
      <button
        onClick={handleToggle}
        className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[0.8125rem] transition-colors ${
          active
            ? "font-medium text-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <DynamicIcon name={item.icon ?? "HelpCircle"} size={17} strokeWidth={1.75} />
        <span className="flex-1 text-left">{item.title}</span>
        {item.badge && <MenuBadge badge={item.badge} />}
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="mt-0.5 flex flex-col gap-0.5 border-l border-gray-100">
          {item.children?.map((child, i) => (
            <MenuNode key={child.id ?? i} item={child} depth={depth + 1} pathname={pathname} subItem onToggleSidebar={onToggleSidebar} />
          ))}
        </div>
      )}
    </div>
  );
}

function MenuNode({
  item,
  depth = 0,
  pathname,
  subItem,
  onToggleSidebar,
}: {
  item: Menu;
  depth?: number;
  pathname: string;
  subItem?: boolean;
  onToggleSidebar?: () => void;
}): React.JSX.Element {
  switch (item.type) {
    case "group":
      return (
        <>
          <p className="mb-1 mt-5 px-3 text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400 first:mt-0">
            {item.title}
          </p>
          {item.children?.map((child, i) => (
            <MenuNode
              key={child.id ?? i}
              item={child}
              depth={depth + 1}
              pathname={pathname}
              subItem={subItem}
              onToggleSidebar={onToggleSidebar}
            />
          ))}
        </>
      );
    case "collapse":
      return <MenuCollapse item={item} depth={depth} pathname={pathname} onToggleSidebar={onToggleSidebar} />;
    case "item":
    default:
      return <MenuItem item={item} pathname={pathname} subItem={subItem} onToggleSidebar={onToggleSidebar} />;
  }
}

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
            {user?.roles?.[0] ?? "UI/UX Designer"}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
      </div>
    </aside>
    </>
  );
}

export default Sidebar;
