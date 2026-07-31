import { useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Menu } from "@/features/auth/types";

type MenuType = "group" | "item" | "collapse";

interface MenuItemData {
  id: string;
  title: string;
  type: MenuType;
  icon?: string;
  route?: string;
  url?: string;
  componentName?: string;
  parentTitle?: string;
  children?: MenuItemData[];
}

const initialMenus: MenuItemData[] = [
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
        url: "/dashboard",
        componentName: "Dashboard",
        parentTitle: "Dashboard",
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
        parentTitle: "Management",
        children: [
          {
            id: "2-1-1",
            title: "User List",
            type: "item",
            icon: "User",
            route: "/dashboard/users",
            url: "/dashboard/users",
            componentName: "UserManagement",
            parentTitle: "Users",
          },
        ],
      },
      {
        id: "2-2",
        title: "Settings",
        type: "item",
        icon: "Settings",
        route: "/dashboard/settings",
        url: "/dashboard/settings",
        componentName: "Settings",
        parentTitle: "Management",
      },
    ],
  },
];

const typeBadgeStyles: Record<MenuType, string> = {
  group: "bg-blue-50 text-blue-600 border-blue-200",
  item: "bg-green-50 text-green-600 border-green-200",
  collapse: "bg-amber-50 text-amber-600 border-amber-200",
};

function flattenMenuItems(menus: MenuItemData[]): MenuItemData[] {
  const result: MenuItemData[] = [];
  function walk(items: MenuItemData[]) {
    for (const item of items) {
      if (item.type === "item") {
        result.push(item);
      }
      if (item.children) {
        walk(item.children);
      }
    }
  }
  walk(menus);
  return result;
}

export default function MenuManagementPage(): React.JSX.Element {
  const [menus, setMenus] = useState<MenuItemData[]>(initialMenus);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItemData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "item" as MenuType,
    icon: "",
    route: "",
    url: "",
    componentName: "",
  });
  const rowsPerPage = 10;

  const flatItems = flattenMenuItems(menus);
  const filteredItems = flatItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.route && item.route.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.componentName && item.componentName.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);
  const pageStart = (currentPage - 1) * rowsPerPage;
  const paginatedItems = filteredItems.slice(pageStart, pageStart + rowsPerPage);

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredItems.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredItems.map((item) => item.id)));
    }
  };

  const openAddDialog = () => {
    setEditingMenu(null);
    setFormData({
      title: "",
      type: "item",
      icon: "",
      route: "",
      url: "",
      componentName: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: MenuItemData) => {
    setEditingMenu(item);
    setFormData({
      title: item.title,
      type: item.type,
      icon: item.icon || "",
      route: item.route || "",
      url: item.url || "",
      componentName: item.componentName || "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingMenu) {
      setMenus((prev) =>
        prev.map((group) => {
          if (group.children) {
            return {
              ...group,
              children: group.children.map((child) => {
                if (child.id === editingMenu.id) {
                  return {
                    ...child,
                    title: formData.title,
                    type: formData.type,
                    icon: formData.icon || undefined,
                    route: formData.route || undefined,
                    url: formData.url || undefined,
                    componentName: formData.componentName || undefined,
                  };
                }
                if (child.children) {
                  return {
                    ...child,
                    children: child.children.map((subChild) =>
                      subChild.id === editingMenu.id
                        ? {
                            ...subChild,
                            title: formData.title,
                            type: formData.type,
                            icon: formData.icon || undefined,
                            route: formData.route || undefined,
                            url: formData.url || undefined,
                            componentName: formData.componentName || undefined,
                          }
                        : subChild,
                    ),
                  };
                }
                return child;
              }),
            };
          }
          return group;
        }),
      );
    } else {
      const newItem: MenuItemData = {
        id: `new-${Date.now()}`,
        title: formData.title,
        type: formData.type,
        icon: formData.icon || undefined,
        route: formData.route || undefined,
        url: formData.url || undefined,
        componentName: formData.componentName || undefined,
        parentTitle: "Management",
      };
      setMenus((prev) => {
        const updated = [...prev];
        const managementGroup = updated.find((g) => g.title === "Management");
        if (managementGroup && managementGroup.children) {
          managementGroup.children = [...managementGroup.children, newItem];
        }
        return updated;
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setMenus((prev) =>
      prev.map((group) => {
        if (group.children) {
          return {
            ...group,
            children: group.children
              .filter((child) => child.id !== id)
              .map((child) => {
                if (child.children) {
                  return {
                    ...child,
                    children: child.children.filter((subChild) => subChild.id !== id),
                  };
                }
                return child;
              }),
          };
        }
        return group;
      }),
    );
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Menu Management</h1>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${flatItems.length} records...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openAddDialog}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Menu
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleAllRows}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="w-16 px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    #
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    TITLE
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    TYPE
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    ICON
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    ROUTE
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  PARENT
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 last:border-0"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(item.id)}
                      onChange={() => toggleRowSelection(item.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{pageStart + index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.type === "collapse" && (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-800">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeBadgeStyles[item.type]}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.icon || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{item.route || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{item.parentTitle || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditDialog(item)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-4 py-3 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Row per page</span>
            <div className="relative">
              <select className="h-8 appearance-none rounded-md border border-gray-200 bg-white pl-2 pr-7 text-sm text-gray-600 focus:border-blue-500 focus:outline-none">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            </div>
            <span>Go to</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= totalPages) setCurrentPage(val);
              }}
              className="h-8 w-14 rounded-md border border-gray-200 bg-white px-2 text-center text-sm text-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-gray-400 sm:flex-row">
        <span>
          &copy; All rights reserved <span className="text-blue-500">CodedThemes</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="cursor-pointer hover:text-gray-600">Hire us</span>
          <span className="cursor-pointer hover:text-gray-600">License</span>
          <span className="cursor-pointer hover:text-gray-600">Terms</span>
          <span className="cursor-pointer hover:text-gray-600">Figma Design System</span>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent showCloseButton={false} className="max-w-lg gap-0 p-0">
          <div className="px-6 pt-6 pb-0">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {editingMenu ? "Edit Menu" : "New Menu"}
            </DialogTitle>
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Title</Label>
                <Input
                  placeholder="Enter menu title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Type</Label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as MenuType }))}
                    className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="item">Item</option>
                    <option value="group">Group</option>
                    <option value="collapse">Collapse</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Icon</Label>
                <Input
                  placeholder="Enter icon name (e.g. LayoutDashboard)"
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Route</Label>
                  <Input
                    placeholder="e.g. /dashboard/menu"
                    value={formData.route}
                    onChange={(e) => setFormData((prev) => ({ ...prev, route: e.target.value }))}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">URL</Label>
                  <Input
                    placeholder="e.g. /dashboard/menu"
                    value={formData.url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Component Name</Label>
                <Input
                  placeholder="e.g. MenuManagement"
                  value={formData.componentName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, componentName: e.target.value }))}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.title}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {editingMenu ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
