import MenuCollapse from "@/features/dashboard/components/menu/menu-collapse";
import MenuItem from "@/features/dashboard/components/menu/menu-item";
import type { Menu } from "@/features/auth/types";


export default function MenuNode({
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