import React, { useState, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import DynamicIcon from "@/components/common/dynamic-icon";
import type { Menu } from "@/features/auth/types";
import MenuNode from "@/features/dashboard/components/menu";
import { isActive } from "@/features/menus/utils/is-active";
import { MenuBadge } from "@/features/menus/utils/menu-badge";

function anyChildActive(children: Menu[] | undefined, pathname: string): boolean {
  if (!children) return false;
  return children.some(
    (c) => isActive(c.path, pathname) || anyChildActive(c.children, pathname),
  );
}

export default function MenuCollapse({
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