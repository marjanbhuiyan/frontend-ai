import type { RouteObject } from "react-router-dom";
import type { Menu } from "@/features/auth/types";
import { getComponent } from "@/app/router/component-registry";
import { NotFoundPageContent } from "@/components/shared/not-found-page";
import { ErrorPageContent } from "@/components/shared/error-page";

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
            title: "List",
            type: "item",
            route: "/dashboard/users",
            url: "/dashboard/users",
            icon: "User",
            componentName: "DataTable",
            resourceName: "users",
          },
        ],
      },
      {
        id: "2-2",
        title: "Roles & Permissions",
        type: "collapse",
        icon: "Shield",
        children: [
          {
            id: "2-2-1",
            title: "List",
            type: "item",
            route: "/dashboard/roles",
            url: "/dashboard/roles",
            icon: "List",
            componentName: "RoleManagement",
          },
        ],
      },
      {
        id: "2-3",
        title: "Menu Management",
        type: "collapse",
        icon: "Menu",
        children: [
          {
            id: "2-3-1",
            title: "List",
            type: "item",
            route: "/dashboard/menu-management",
            url: "/dashboard/menu-management",
            icon: "List",
            componentName: "MenuManagement",
          },
        ],
      },
      {
        id: "2-4",
        title: "Customers",
        type: "collapse",
        icon: "Contact",
        children: [
          {
            id: "2-4-1",
            title: "List",
            type: "item",
            route: "/dashboard/customers",
            url: "/dashboard/customers",
            icon: "List",
            componentName: "DataTable",
            resourceName: "customers",
          },
        ],
      },
      {
        id: "2-5",
        title: "Products",
        type: "collapse",
        icon: "Package",
        children: [
          {
            id: "2-5-1",
            title: "List",
            type: "item",
            route: "/dashboard/products",
            url: "/dashboard/products",
            icon: "List",
            componentName: "DataTable",
            resourceName: "products",
          },
        ],
      },
      {
        id: "2-6",
        title: "Orders",
        type: "collapse",
        icon: "ShoppingCart",
        children: [
          {
            id: "2-6-1",
            title: "List",
            type: "item",
            route: "/dashboard/orders",
            url: "/dashboard/orders",
            icon: "List",
            componentName: "DataTable",
            resourceName: "orders",
          },
        ],
      },
      {
        id: "2-7",
        title: "Suppliers",
        type: "collapse",
        icon: "Truck",
        children: [
          {
            id: "2-7-1",
            title: "List",
            type: "item",
            route: "/dashboard/suppliers",
            url: "/dashboard/suppliers",
            icon: "List",
            componentName: "DataTable",
            resourceName: "suppliers",
          },
        ],
      },
      {
        id: "2-8",
        title: "Invoices",
        type: "collapse",
        icon: "FileText",
        children: [
          {
            id: "2-8-1",
            title: "List",
            type: "item",
            route: "/dashboard/invoices",
            url: "/dashboard/invoices",
            icon: "List",
            componentName: "DataTable",
            resourceName: "invoices",
          },
        ],
      },
      {
        id: "2-9",
        title: "Stores",
        type: "collapse",
        icon: "Store",
        children: [
          {
            id: "2-9-1",
            title: "List",
            type: "item",
            route: "/dashboard/stores",
            url: "/dashboard/stores",
            icon: "List",
            componentName: "StoreManagement",
          },
        ],
      },
      {
        id: "2-10",
        title: "Access Management",
        type: "collapse",
        icon: "Lock",
        children: [
          {
            id: "2-10-1",
            title: "Permissions",
            type: "item",
            route: "/dashboard/access",
            url: "/dashboard/access",
            icon: "ShieldCheck",
            componentName: "AccessManagement",
          },
        ],
      },
      {
        id: "2-11",
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
  // const source = menus.length > 0 ? menus : demoMenus;
  const flatItems = flattenMenus(menus);

  console.log("flatItems", flatItems);
  return flatItems
    .filter((item) => item.route)
    .map((item) => {
      const Component = getComponent(item.componentName);
      const resourceName = item.resourceName;
      return {
        path: item.route,
        element: Component ? <Component resourceName={resourceName} /> : <NotFoundPageContent />,
        errorElement: <ErrorPageContent />,
      } satisfies RouteObject;
    });
}
