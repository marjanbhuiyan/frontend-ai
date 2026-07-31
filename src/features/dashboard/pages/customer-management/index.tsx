import { useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "Active" | "Inactive" | "Pending";
}

const initialCustomers: CustomerData[] = [
  { id: "1", name: "John Smith", email: "john.smith@example.com", phone: "+1 (555) 123-4567", company: "Acme Corp", status: "Active" },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@example.com", phone: "+1 (555) 234-5678", company: "Tech Solutions", status: "Active" },
  { id: "3", name: "Michael Brown", email: "mbrown@example.com", phone: "+1 (555) 345-6789", company: "Global Industries", status: "Pending" },
  { id: "4", name: "Emily Davis", email: "emily.d@example.com", phone: "+1 (555) 456-7890", company: "StartUp Inc", status: "Active" },
  { id: "5", name: "David Wilson", email: "dwilson@example.com", phone: "+1 (555) 567-8901", company: "Enterprise Ltd", status: "Inactive" },
  { id: "6", name: "Lisa Anderson", email: "l.anderson@example.com", phone: "+1 (555) 678-9012", company: "Creative Agency", status: "Active" },
  { id: "7", name: "James Taylor", email: "j.taylor@example.com", phone: "+1 (555) 789-0123", company: "Digital Works", status: "Pending" },
  { id: "8", name: "Jennifer Martinez", email: "jmartinez@example.com", phone: "+1 (555) 890-1234", company: "Innovative Co", status: "Active" },
];

const statusBadgeStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-600 border-green-200",
  Inactive: "bg-gray-50 text-gray-500 border-gray-200",
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
};

const avatarColors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500"];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function CustomerManagementPage(): React.JSX.Element {
  const [customers, setCustomers] = useState<CustomerData[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active" as "Active" | "Inactive" | "Pending",
  });
  const rowsPerPage = 10;

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const pageStart = (currentPage - 1) * rowsPerPage;
  const paginatedCustomers = filteredCustomers.slice(pageStart, pageStart + rowsPerPage);

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
    if (selectedRows.size === filteredCustomers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredCustomers.map((c) => c.id)));
    }
  };

  const openAddDialog = () => {
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "", company: "", status: "Active" });
    setDialogOpen(true);
  };

  const openEditDialog = (customer: CustomerData) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      status: customer.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, name: formData.name, email: formData.email, phone: formData.phone, company: formData.company, status: formData.status }
            : c,
        ),
      );
    } else {
      const newCustomer: CustomerData = {
        id: `new-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        status: formData.status,
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Customer Management</h1>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${customers.length} records...`}
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
              Add Customer
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
                    checked={selectedRows.size === filteredCustomers.length && filteredCustomers.length > 0}
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
                    CUSTOMER
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
                    PHONE
                    <ChevronDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">
                  <span className="flex items-center gap-1">
                    COMPANY
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
              {paginatedCustomers.map((customer, index) => {
                const colorClass = avatarColors[Number(customer.id) % avatarColors.length];
                return (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(customer.id)}
                        onChange={() => toggleRowSelection(customer.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500">{pageStart + index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback className={`${colorClass} text-white text-xs`}>
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-800">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.company}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeStyles[customer.status]}`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditDialog(customer)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
              {editingCustomer ? "Edit Customer" : "New Customer"}
            </DialogTitle>
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  placeholder="Enter customer name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <Input
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Company</Label>
                  <Input
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
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
              disabled={!formData.name || !formData.email}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {editingCustomer ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
