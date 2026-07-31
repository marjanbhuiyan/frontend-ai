import {
  Search,
  LayoutGrid,
  Share2,
  Bell,
  MessageSquare,
  Maximize2,
  Settings,
  Plus,
  Camera,
} from "lucide-react";
import StoreSwitcher from "@/features/dashboard/pages/dashboard/store-switcher";
import ProfileMenu from "@/features/dashboard/pages/dashboard/profile-menu";
import type { User, StoreInfo } from "@/features/auth/types";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";


function MenuUnfoldIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="menu-unfold"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 000-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0014.4 7z" />
    </svg>
  );
}

function MenuFoldIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="menu-fold"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 000 13.8z" />
    </svg>
  );
}

function HeaderIconButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element {
  return (
    <button
      type="button"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

type Status = "Complete" | "Pending" | "Canceled";

function Header({
  sidebarOpen,
  onToggleSidebar,
  user,
  stores,
  currentStore,
  onSwitchStore,
  isSwitchingStore,
  onLogout,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  user: User | null;
  stores: StoreInfo[];
  currentStore: StoreInfo | null;
  onSwitchStore: (store: StoreInfo) => void;
  isSwitchingStore?: boolean;
  onLogout: () => void;
}): React.JSX.Element {
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
      password: "",
      confirmPassword: "",
      storeName: "",
      roleName: "",
    });
     const updateFormField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 md:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M12 2L4 8.5L12 15L20 8.5L12 2Z" fill="#2563eb" />
            <path d="M4 8.5L12 22L20 8.5L12 15L4 8.5Z" fill="#93c5fd" />
          </svg>
        </div>

        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          {sidebarOpen ? (
            <MenuFoldIcon className="h-4 w-4" />
          ) : (
            <MenuUnfoldIcon className="h-4 w-4" />
          )}
        </button>

        <div className="hidden sm:block">
          <StoreSwitcher
            stores={stores}
            currentStore={currentStore}
            onChange={onSwitchStore}
            isLoading={isSwitchingStore}
          />
        </div>

        <button
          type="button"
          aria-label="Search"
          className="hidden h-8 items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 sm:flex"
        >
          <Search className="h-4 w-4" />
          <span className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 text-[0.6rem] font-medium text-gray-400">
            ⌘K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <Button onClick={() => setAddDialogOpen(true)} variant="outline" className="hidden h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 sm:inline-flex">
        
          <Plus className="h-[18px] w-[18px]" />
        </Button>
        <HeaderIconButton aria-label="Apps" className="hidden md:inline-flex">
          <LayoutGrid className="h-[18px] w-[18px]" />
        </HeaderIconButton>
        <HeaderIconButton aria-label="Share" className="hidden md:inline-flex">
          <Share2 className="h-[18px] w-[18px]" />
        </HeaderIconButton>
        <div className="relative">
          <HeaderIconButton aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
          </HeaderIconButton>
          <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[0.55rem] font-semibold text-white">
            1
          </span>
        </div>
        <HeaderIconButton aria-label="Messages" className="hidden sm:inline-flex">
          <MessageSquare className="h-[18px] w-[18px]" />
        </HeaderIconButton>
        <HeaderIconButton aria-label="Fullscreen" className="hidden sm:inline-flex">
          <Maximize2 className="h-[18px] w-[18px]" />
        </HeaderIconButton>
        <HeaderIconButton aria-label="Settings" className="hidden sm:inline-flex">
          <Settings className="h-[18px] w-[18px]" />
        </HeaderIconButton>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent showCloseButton={false} className="flex max-h-[90vh] flex-col gap-0 overflow-y-auto p-0 sm:max-w-[600px] lg:max-w-[766px] rounded-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <DialogTitle className="text-base font-medium text-gray-900">New Customer</DialogTitle>
          </div>

          <div className="px-20 py-5">
            <div className="flex gap-20">
              <div className="flex-shrink-0 py-12">
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

                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Age</Label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateFormField("age", Number(e.target.value))}
                      className="h-10 border-gray-200 text-sm"
                    />
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

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-800">Login Credentials</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={(e) => updateFormField("password", e.target.value)}
                        className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormField("confirmPassword", e.target.value)}
                        className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-800">Store Access</h3>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Store Name</Label>
                    <Input
                      placeholder="Enter Store Name"
                      value={formData.storeName}
                      onChange={(e) => updateFormField("storeName", e.target.value)}
                      className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-800">Store Role</h3>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Role Name</Label>
                    <Input
                      placeholder="Enter Role Name"
                      value={formData.roleName}
                      onChange={(e) => updateFormField("roleName", e.target.value)}
                      className="h-10 border-gray-200 text-sm placeholder:text-gray-400"
                    />
                  </div>
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

        <div className="ml-1.5">
          <ProfileMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}

export default Header;
