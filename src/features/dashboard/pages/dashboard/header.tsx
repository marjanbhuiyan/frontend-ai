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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import RegisterForm from "@/features/users/components/register-form";
import ImageUpload from "@/utils/image-upload";
import { useRegister } from "@/features/auth/hooks/use-auth";

import type { RegisterInput } from "@/features/auth/types";
import { registertSchema } from "@/features/auth/schemas";




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
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const userRegister = useRegister();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registertSchema),
    mode: "onChange",
    defaultValues: {
      // firstName: "",
      // lastName: "",
      // email: "",
      // phone: "",
      // password: "",
      // confirmPassword: "",
      // city: "",
      // country: "",
      // address: "",
      // storeLocation: "",
      // storeName: "",
      // status: "active",
    }
  });

  const onSubmit = (data: RegisterInput) => {
    const formData = new FormData();
    if (avatarFile){
      formData.append("avatar", avatarFile as File);
    };
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("status", data.status);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("city", data.city );
    formData.append("state", data.state );
    formData.append("country", data.country );
    formData.append("address", data.address);
    formData.append("phone", data.phone);
    formData.append("storeLocation", data.storeLocation);
    formData.append("storeName", data.storeName);
    formData.append("roleName", data.roleName);
    formData.append("gender", data.gender);

    userRegister.mutate(formData, {
      onSuccess: () => {
        setAddDialogOpen(false);
        setAvatarFile(null);
        form.reset();
      },
    });
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
    setAvatarFile(null);
    console.log("Add button clicked");
  };

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4">

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent showCloseButton={false} className="flex max-h-[90vh] flex-col gap-0 overflow-y-auto p-0 sm:max-w-[600px] lg:max-w-[766px] rounded-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <DialogTitle className="text-base font-medium text-gray-900">New Customer</DialogTitle>
          </div>
          <div className="px-20 py-5">
            <div className="flex gap-20">
              <div className="flex-shrink-0 py-12">
                <ImageUpload
                  value={avatarFile}
                  onChange={(value) => {
                    if (value instanceof File) setAvatarFile(value);
                    else setAvatarFile(null);
                  }}
                >
                  {({ preview, openFileDialog, dragging }) => (
                    <div
                      className={`relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed bg-blue-50 transition-colors ${dragging ? "border-blue-500" : "border-blue-300"}`}
                      onClick={openFileDialog}
                    >
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-100">
                        {preview ? (
                          <img src={preview} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <Avatar size="lg">
                            <AvatarFallback className="bg-blue-200 text-blue-700 text-lg">EP</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (preview) {
                            setAvatarFile(null);
                          } else {
                            openFileDialog();
                          }
                        }}
                      >
                        <Camera className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </ImageUpload>
              </div>
              <div className="flex-1 space-y-4">
                <RegisterForm form={form} id="form-rhf-demo" onSubmit={onSubmit} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <Button
              onClick={() => {
                setAddDialogOpen(false)
                form.reset()
                setAvatarFile(null)
              }}
              variant="outline"

            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="form-rhf-demo"
              disabled={userRegister.isPending}
            >
              {userRegister.isPending ? "Saving..." : "Add"}
            </Button>
          </div>
        </DialogContent>

      </Dialog>
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
        <Button onClick={handleAddClick} variant="outline" className="hidden h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 sm:inline-flex">

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
        <div className="ml-1.5">
          <ProfileMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}

export default Header;
