import { useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationFirst, PaginationLast } from "@/components/ui/pagination";

type Status = "Complete" | "Pending" | "Canceled";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  contact: string;
  age: number;
  country: string;
  status: Status;
}

const mockUsers: User[] = [
  { id: 100, name: "Earl Parrini", email: "sah@gmail.com", contact: "+1 (965) 886-4355", age: 55, country: "Russia", status: "Complete" },
  { id: 99, name: "Nora Willis", email: "ket@gmail.com", contact: "+1 (382) 858-5995", age: 63, country: "Kenya", status: "Pending" },
  { id: 98, name: "Lelia Bianchi", email: "ulusozit@gmail.com", contact: "+1 (877) 405-2202", age: 55, country: "Nigeria", status: "Canceled" },
  { id: 94, name: "Jeffrey Sanchez", email: "zu@gmail.com", contact: "+1 (976) 570-4442", age: 34, country: "Malta", status: "Complete" },
  { id: 93, name: "Miguel Franceschi", email: "hawog@gmail.com", contact: "+1 (324) 919-4507", age: 52, country: "Switzerland", status: "Complete" },
  { id: 92, name: "Victor Battaglini", email: "coemet@gmail.com", contact: "+1 (853) 820-6601", age: 19, country: "Thailand", status: "Canceled" },
  { id: 91, name: "Gavin Panichi", email: "tacevmi@gmail.com", contact: "+1 (528) 422-1481", age: 43, country: "Chile", status: "Pending" },
  { id: 90, name: "Julian Schipper", email: "pelcecov@gmail.com", contact: "+1 (653) 953-7893", age: 23, country: "Thailand", status: "Pending" },
  { id: 89, name: "Norman Slater", email: "woefsoz@gmail.com", contact: "+1 (313) 960-3849", age: 44, country: "United Arab Emirates", status: "Canceled" },
  { id: 88, name: "Rosie Chiarugi", email: "sinulan@gmail.com", contact: "+1 (305) 691-7595", age: 20, country: "Venezuela", status: "Pending" },
];

const statusStyles: Record<Status, string> = {
  Complete: "bg-green-50 text-green-600 border-green-200",
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
  Canceled: "bg-red-50 text-red-500 border-red-200",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UserManagementPage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: 18,
    fatherName: "",
    customerRole: "",
    gender: "Female" as "Female" | "Male",
    status: "Pending" as Status,
    contact: "",
    country: "",
    location: "",
    aboutCustomer: "",
    skills: "",
    makeContactPublic: true,
    availableToHire: false,
  });
  const rowsPerPage = 10;

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.contact.includes(searchQuery);
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const toggleRowSelection = (id: number) => {
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
    if (selectedRows.size === filteredUsers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const pageStart = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(pageStart, pageStart + rowsPerPage);

  const updateFormField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">LIST</h1>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${mockUsers.length} records...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | "All")}
              className="h-9 w-auto min-w-[130px]"
            >
              <option value="All">All Status</option>
              <option value="Complete">Complete</option>
              <option value="Pending">Pending</option>
              <option value="Canceled">Canceled</option>
            </Select>

            <Select className="h-9 w-auto min-w-[130px]">
              <option>Sort by (#)</option>
              <option>Sort by Name</option>
              <option>Sort by Status</option>
            </Select>

            <Button onClick={() => setAddDialogOpen(true)} className="inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-sm bg-blue-500 px-3 sm:px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-blue-600 cursor-pointer">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Add Customer
            </Button>

           
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleAllRows}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </TableHead>
                <TableHead className="w-16">#</TableHead>
                <TableHead>USER INFO</TableHead>
                <TableHead>CONTACT</TableHead>
                <TableHead>AGE</TableHead>
                <TableHead>COUNTRY</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => {
                const avatarColors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-pink-500", "bg-purple-500"];
                const colorClass = avatarColors[user.id % avatarColors.length];

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(user.id)}
                        onChange={() => toggleRowSelection(user.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableCell>
                    <TableCell className="text-gray-500">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                          <AvatarFallback className={`${colorClass} text-white text-xs`}>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.contact}</TableCell>
                    <TableCell className="text-gray-600">{user.age}</TableCell>
                    <TableCell className="text-gray-600">{user.country}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-4 py-3 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Row per page</span>
            <Select className="h-8 w-auto min-w-[60px]">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </Select>
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

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst onClick={() => setCurrentPage(1)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
              </PaginationItem>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink isActive={currentPage === page} onClick={() => setCurrentPage(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast onClick={() => setCurrentPage(totalPages)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent showCloseButton={false} className="max-w-2xl gap-0 p-0">
          <div className="px-6 pt-6 pb-0">
            <DialogTitle className="text-lg font-semibold text-gray-800">New Customer</DialogTitle>
          </div>

          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-blue-300 bg-blue-50">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-100">
                      <Avatar size="lg">
                        <AvatarFallback className="bg-blue-200 text-blue-700 text-lg">EP</AvatarFallback>
                      </Avatar>
                    </div>
                    <button className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">First Name</Label>
                      <Input
                        placeholder="Enter First Name"
                        value={formData.firstName}
                        onChange={(e) => updateFormField("firstName", e.target.value)}
                        className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                      <Input
                        placeholder="Enter Last Name"
                        value={formData.lastName}
                        onChange={(e) => updateFormField("lastName", e.target.value)}
                        className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter Customer Email"
                        value={formData.email}
                        onChange={(e) => updateFormField("email", e.target.value)}
                        className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                      />
                    </div>
                    <div className="w-24 space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">Age</Label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateFormField("age", Number(e.target.value))}
                        className="h-10 border-gray-200 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Father Name</Label>
                  <Input
                    placeholder="Enter Father Name"
                    value={formData.fatherName}
                    onChange={(e) => updateFormField("fatherName", e.target.value)}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Customer Role</Label>
                  <Input
                    placeholder="Enter Role"
                    value={formData.customerRole}
                    onChange={(e) => updateFormField("customerRole", e.target.value)}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Gender</Label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={() => updateFormField("gender", "Female")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Female
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={() => updateFormField("gender", "Male")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Male
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <Select
                  value={formData.status}
                  onChange={(e) => updateFormField("status", e.target.value as Status)}
                  className="h-10"
                >
                  <option value="Pending">Pending</option>
                  <option value="Complete">Complete</option>
                  <option value="Canceled">Canceled</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Contact</Label>
                  <Input
                    placeholder="Enter Contact"
                    value={formData.contact}
                    onChange={(e) => updateFormField("contact", e.target.value)}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Country</Label>
                  <Input
                    placeholder="Enter Country"
                    value={formData.country}
                    onChange={(e) => updateFormField("country", e.target.value)}
                    className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <Textarea
                  placeholder="Enter Location"
                  value={formData.location}
                  onChange={(e) => updateFormField("location", e.target.value)}
                  className="min-h-[80px] border-gray-200 text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">About Customer</Label>
                <Textarea
                  placeholder="Enter Customer Information"
                  value={formData.aboutCustomer}
                  onChange={(e) => updateFormField("aboutCustomer", e.target.value)}
                  className="min-h-[80px] border-gray-200 text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Skills</Label>
                <Select
                  value={formData.skills}
                  onChange={(e) => updateFormField("skills", e.target.value)}
                  className="h-10"
                >
                  <option value="">Add Skills</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="marketing">Marketing</option>
                </Select>
              </div>

              <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Make Contact Info Public</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Means that anyone viewing your profile will be able to see your contacts details
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateFormField("makeContactPublic", !formData.makeContactPublic)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.makeContactPublic ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.makeContactPublic ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Available to hire</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Toggling this will let your teammates know that you are available for acquiring new projects
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateFormField("availableToHire", !formData.availableToHire)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.availableToHire ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.availableToHire ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              onClick={() => setAddDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
            >
              Cancel
            </button>
            <button
              onClick={() => setAddDialogOpen(false)}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
