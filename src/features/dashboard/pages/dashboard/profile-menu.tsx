import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Settings as SettingsIcon,
  Pencil,
  IdCard,
  Receipt,
  LogOut,
  Bell,
  Shield,
} from "lucide-react";
import type { User } from "@/features/auth/types";
import type React from "react";

function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "U";
}

type TabKey = "profile" | "setting";

const TAB_ITEMS: Record<TabKey, { icon: React.ComponentType<{ className?: string }>; label: string }[]> = {
  profile: [
    { icon: Pencil, label: "Edit Profile" },
    { icon: UserIcon, label: "View Profile" },
    { icon: IdCard, label: "Social Profile" },
    { icon: Receipt, label: "Billing" },
  ],
  setting: [
    { icon: Bell, label: "Notification Settings" },
    { icon: Shield, label: "Privacy & Security" },
  ],
};

function ProfileMenu({
  user,
  onLogout,
}: {
  user: User | null;
  onLogout: () => void;
}): React.JSX.Element {
  const [tab, setTab] = useState<TabKey>("profile");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            title="Account"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"
          >
            {getInitials(user?.name)}
          </button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-0">
        <div className="flex items-center justify-between p-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">
                {user?.name ?? "Guest User"}
              </p>
              <p className="truncate text-xs text-gray-400">
                {user?.roles?.[0] ?? "UI/UX Designer"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onLogout}
            title="Sign out"
            className="flex-shrink-0 text-gray-400 hover:text-gray-700"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 border-b border-gray-100 px-3">
          <button
            type="button"
            onClick={() => setTab("profile")}
            className={`flex items-center gap-1.5 border-b-2 px-0.5 pb-2 text-sm font-medium transition-colors ${
              tab === "profile"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <UserIcon className="h-4 w-4" />
            Profile
          </button>
          <button
            type="button"
            onClick={() => setTab("setting")}
            className={`flex items-center gap-1.5 border-b-2 px-0.5 pb-2 text-sm font-medium transition-colors ${
              tab === "setting"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
            Setting
          </button>
        </div>

        <DropdownMenuGroup className="flex flex-col p-1.5">
          {TAB_ITEMS[tab].map((item) => (
            <DropdownMenuItem key={item.label}>
              <item.icon className="text-gray-400" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="p-1.5">
          <DropdownMenuItem variant="destructive" onClick={onLogout}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileMenu;
