import { useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, ChevronDown, Store } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StoreData {
  id: string;
  name: string;
  owner: string;
  email: string;
  location: string;
  status: "Active" | "Inactive" | "Pending";
}

const initialStores: StoreData[] = [
  { id: "1", name: "Tech Hub Store", owner: "John Smith", email: "techhub@example.com", location: "New York, USA", status: "Active" },
  { id: "2", name: "Fashion World", owner: "Sarah Johnson", email: "fashion@example.com", location: "London, UK", status: "Active" },
  { id: "3", name: "Gadget Galaxy", owner: "Michael Brown", email: "gadget@example.com", location: "Tokyo, Japan", status: "Pending" },
  { id: "4", name: "Home Essentials", owner: "Emily Davis", email: "home@example.com", location: "Sydney, Australia", status: "Active" },
  { id: "5", name: "Sports Zone", owner: "David Wilson", email: "sports@example.com", location: "Toronto, Canada", status: "Inactive" },
  { id: "6", name: "Book Barn", owner: "Lisa Anderson", email: "books@example.com", location: "Berlin, Germany", status: "Active" },
];

const statusBadgeStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-600 border-green-200",
  Inactive: "bg-gray-50 text-gray-500 border-gray-200",
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
};

export default function StoreManagementPage(): React.JSX.Element {
  const [stores, setStores] = useState<StoreData[]>(initialStores);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    email: "",
    location: "",
    status: "Active" as "Active" | "Inactive" | "Pending",
  });
  const rowsPerPage = 10;

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredStores.length / rowsPerPage);
  const pageStart = (currentPage - 1) * rowsPerPage;
  const paginatedStores = filteredStores.slice(pageStart, pageStart + rowsPerPage);

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
    if (selectedRows.size === filteredStores.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredStores.map((s) => s.id)));
    }
  };

  const openAddDialog = () => {
    setEditingStore(null);
    setFormData({ name: "", owner: "", email: "", location: "", status: "Active" });
    setDialogOpen(true);
  };

  const openEditDialog = (store: StoreData) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      owner: store.owner,
      email: store.email,
      location: store.location,
      status: store.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingStore) {
      setStores((prev) =>
        prev.map((s) =>
          s.id === editingStore.id
            ? { ...s, name: formData.name, owner: formData.owner, email: formData.email, location: formData.location, status: formData.status }
            : s,
        ),
      );
    } else {
      const newStore: StoreData = {
        id: `new-${Date.now()}`,
        name: formData.name,
        owner: formData.owner,
        email: formData.email,
        location: formData.location,
        status: formData.status,
      };
      setStores((prev) => [...prev, newStore]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Store Management</h1>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${stores.length} records...`}
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
              Add Store
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
                    checked={selectedRows.size === filteredStores.length && filteredStores.length > 0}
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
                    STORE
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    OWNER
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    EMAIL
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    LOCATION
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
              {paginatedStores.map((store, index) => (
                <tr
                  key={store.id}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 last:border-0"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(store.id)}
                      onChange={() => toggleRowSelection(store.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{pageStart + index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                        <Store className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-800">{store.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{store.owner}</td>
                  <td className="px-4 py-3 text-gray-600">{store.email}</td>
                  <td className="px-4 py-3 text-gray-600">{store.location}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeStyles[store.status]}`}
                    >
                      {store.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditDialog(store)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(store.id)}
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
              {editingStore ? "Edit Store" : "New Store"}
            </DialogTitle>
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Store Name</Label>
                <Input
                  placeholder="Enter store name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Owner</Label>
                  <Input
                    placeholder="Enter owner name"
                    value={formData.owner}
                    onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <Input
                  placeholder="Enter store location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as "Active" | "Inactive" | "Pending" }))}
                    className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
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
              disabled={!formData.name || !formData.owner}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {editingStore ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
