import { useNavigate } from "react-router-dom";
import DynamicIcon from "@/components/common/dynamic-icon";
import { isActive } from "@/features/menus/utils/is-active";
import MenuNode from "@/features/dashboard/components/menu";
import type { Menu } from "@/features/auth/types";
import { MenuBadge } from "@/features/menus/utils/menu-badge";

export default function MenuItem({
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
  const active = isActive(item.path, pathname);

  const handleClick = () => {
    if (item.path) {
      navigate(item.path);
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