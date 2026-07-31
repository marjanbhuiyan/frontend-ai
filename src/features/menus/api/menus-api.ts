import { apiClient } from "@/services/api-client";
import type { MenuResponse, Menu } from "@/features/menus/types";

/**
 * Helper: true when no real backend is configured.
 */
function isMockMode(): boolean {
  return (
    import.meta.env.VITE_USE_MOCK === "true" ||
    !import.meta.env.VITE_API_BASE_URL
  );
}

function demoMenus(): Menu[] {
  const resources: Array<{ title: string; icon: string; resource: string; path: string }> = [
    { title: "Users", icon: "Users", resource: "users", path: "/dashboard/users" },
    { title: "Products", icon: "Package", resource: "products", path: "/dashboard/products" },
    { title: "Customers", icon: "Users", resource: "customers", path: "/dashboard/customers" },
    { title: "Orders", icon: "ShoppingCart", resource: "orders", path: "/dashboard/orders" },
    { title: "Suppliers", icon: "Truck", resource: "suppliers", path: "/dashboard/suppliers" },
    { title: "Invoices", icon: "FileText", resource: "invoices", path: "/dashboard/invoices" },
  ];

  return [
    {
      id: "1",
      title: "Dashboard",
      type: "group",
      children: [
        {
          id: "1-1",
          title: "Overview",
          type: "item",
          icon: "LayoutDashboard",
          route: "/dashboard",
          pathname: "/dashboard",
          component: "dashboard",
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
          title: "Resources",
          type: "collapse",
          icon: "Database",
          children: resources.map((r) => ({
            id: `2-1-${r.resource}`,
            title: r.title,
            type: "item" as const,
            icon: r.icon,
            route: r.path,
            pathname: r.path,
            component: "datatable",
            resource: r.resource,
          })),
        },
        {
          id: "2-2",
          title: "Settings",
          type: "item",
          icon: "Settings",
          route: "/dashboard/settings",
          pathname: "/dashboard/settings",
          component: "settings",
        },
      ],
    },
  ];
}

export async function getMenus(): Promise<MenuResponse> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      data: demoMenus(),
      statusCode: 200,
      message: "ok",
    };
  }

  const { data } = await apiClient.get<MenuResponse>("/menus");
  return data;
}
