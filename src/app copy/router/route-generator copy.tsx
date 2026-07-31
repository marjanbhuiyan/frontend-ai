import type { RouteObject } from "react-router-dom";
import type { Menu } from "@/features/auth/types";
import { getComponent } from "@/app/router/component-registry";
import { NotFoundPageContent } from "@/components/shared/not-found-page";

export const demoMenus: Menu[] = [
  {
    id: "1",
    title: "Dashboard",
    type: "group",
    children: [
      {
        id: "1-1",
        title: "Overview",
        type: "item",
        route: "/dashboard",
        url: "/dashboard",
        icon: "LayoutDashboard",
        componentName: "Dashboard",
      },
    ],
  },
  {
    id: "2",
    title: "Management",
    type: "group",
    children: [
      {
        id: "2-1",
        title: "Users",
        type: "collapse",
        icon: "Users",
        children: [
          {
            id: "2-1-1",
            title: "User List",
            type: "item",
            route: "/dashboard/users",
            url: "/dashboard/users",
            icon: "User",
            componentName: "UserManagement",
          },
        ],
      },
      {
        id: "2-2",
        title: "Settings",
        type: "item",
        route: "/dashboard/settings",
        url: "/dashboard/settings",
        icon: "Settings",
        componentName: "Settings",
      },
    ],
  },
];

function flattenMenus(items: Menu[]): Menu[] {
  const result: Menu[] = [];
  function walk(list: Menu[]) {
    for (const item of list) {
      if (item.type === "item" && item.route) {
        result.push(item);
      }
      if ((item.type === "group" || item.type === "collapse") && item.children) {
        walk(item.children);
      }
    }
  }
  walk(items);
  return result;
}

export function generateRoutesFromMenus(menus: Menu[]): RouteObject[] {
  const source = menus.length > 0 ? menus : demoMenus;
  const flatItems = flattenMenus(source);
  return flatItems
    .filter((item) => item.route)
    .map((item) => {
      const Component = getComponent(item.componentName);
      return {
        path: item.route,
        element: Component ? <Component /> : <NotFoundPageContent />,
      } satisfies RouteObject;
    });
}
