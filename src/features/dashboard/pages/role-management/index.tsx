import { useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, ChevronDown, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RoleData {
  id: string;
  name: string;
  description: string;
  permissionCount: number;
  userCount: number;
  status: "Active" | "Inactive";
}

const initialRoles: RoleData[] = [
  { id: "1", name: "Super Admin", description: "Full system access with all permissions", permissionCount: 45, userCount: 2, status: "Active" },
  { id: "2", name: "Admin", description: "Administrative access to manage users and settings", permissionCount: 32, userCount: 5, status: "Active" },
  { id: "3", name: "Editor", description: "Can edit content and manage pages", permissionCount: 18, userCount: 12, status: "Active" },
  { id: "4", name: "Viewer", description: "Read-only access to view content", permissionCount: 8, userCount: 25, status: "Active" },
  { id: "5", name: "Moderator", description: "Can moderate user comments and content", permissionCount: 15, userCount: 8, status: "Inactive" },
];

const statusBadgeStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-600 border-green-200",
  Inactive: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function RoleManagementPage(): React.JSX.Element {
  const [roles, setRoles] = useState<RoleData[]>(initialRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });
  const rowsPerPage = 10;

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);
  const pageStart = (currentPage - 1) * rowsPerPage;
  const paginatedRoles = filteredRoles.slice(pageStart, pageStart + rowsPerPage);

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
    if (selectedRows.size === filteredRoles.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredRoles.map((r) => r.id)));
    }
  };

  const openAddDialog = () => {
    setEditingRole(null);
    setFormData({ name: "", description: "", status: "Active" });
    setDialogOpen(true);
  };

  const openEditDialog = (role: RoleData) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      status: role.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? { ...r, name: formData.name, description: formData.description, status: formData.status }
            : r,
        ),
      );
    } else {
      const newRole: RoleData = {
        id: `new-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        permissionCount: 0,
        userCount: 0,
        status: formData.status,
      };
      setRoles((prev) => [...prev, newRole]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Role & Permissions</h1>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${roles.length} records...`}
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
              Add Role
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
                    checked={selectedRows.size === filteredRoles.length && filteredRoles.length > 0}
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
                    NAME
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  DESCRIPTION
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    PERMISSIONS
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    USERS
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  STATUS
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRoles.map((role, index) => (
                <tr
                  key={role.id}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 last:border-0"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(role.id)}
                      onChange={() => toggleRowSelection(role.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{pageStart + index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-800">{role.name}</span>
                    </div>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-600">{role.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                      {role.permissionCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{role.userCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeStyles[role.status]}`}
                    >
                      {role.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditDialog(role)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
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
              {editingRole ? "Edit Role" : "New Role"}
            </DialogTitle>
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Role Name</Label>
                <Input
                  placeholder="Enter role name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <textarea
                  placeholder="Enter role description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as "Active" | "Inactive" }))}
                    className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
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
              disabled={!formData.name}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {editingRole ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
