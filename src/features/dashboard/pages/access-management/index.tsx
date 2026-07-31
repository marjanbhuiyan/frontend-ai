import { useState } from "react";
import { Search, Save, ChevronDown, ChevronRight, User, Shield, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PermissionNode {
  id: string;
  name: string;
  children?: PermissionNode[];
}

const permissionTree: PermissionNode[] = [
  {
    id: "user-management",
    name: "User Management",
    children: [
      { id: "users-view", name: "View Users" },
      { id: "users-create", name: "Create Users" },
      { id: "users-update", name: "Update Users" },
      { id: "users-delete", name: "Delete Users" },
    ],
  },
  {
    id: "menu-management",
    name: "Menu Management",
    children: [
      { id: "menus-view", name: "View Menus" },
      { id: "menus-create", name: "Create Menus" },
      { id: "menus-update", name: "Update Menus" },
      { id: "menus-delete", name: "Delete Menus" },
    ],
  },
  {
    id: "role-management",
    name: "Roles & Permissions",
    children: [
      { id: "roles-view", name: "View Roles" },
      { id: "roles-create", name: "Create Roles" },
      { id: "roles-update", name: "Update Roles" },
      { id: "roles-delete", name: "Delete Roles" },
      { id: "roles-assign", name: "Assign Permissions" },
    ],
  },
  {
    id: "customer-management",
    name: "Customer Management",
    children: [
      { id: "customers-view", name: "View Customers" },
      { id: "customers-create", name: "Create Customers" },
      { id: "customers-update", name: "Update Customers" },
      { id: "customers-delete", name: "Delete Customers" },
    ],
  },
  {
    id: "store-management",
    name: "Store Management",
    children: [
      { id: "stores-view", name: "View Stores" },
      { id: "stores-create", name: "Create Stores" },
      { id: "stores-update", name: "Update Stores" },
      { id: "stores-delete", name: "Delete Stores" },
    ],
  },
  {
    id: "access-management",
    name: "Access Management",
    children: [
      { id: "access-view", name: "View Permissions" },
      { id: "access-manage", name: "Manage Permissions" },
    ],
  },
];

function getAllLeafIds(nodes: PermissionNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.children) {
      ids.push(...getAllLeafIds(node.children));
    } else {
      ids.push(node.id);
    }
  }
  return ids;
}

const allLeafIds = getAllLeafIds(permissionTree);

function areAllChildrenChecked(node: PermissionNode, checked: Set<string>): boolean {
  const leafIds = getAllLeafIds(node.children || []);
  return leafIds.length > 0 && leafIds.every((id) => checked.has(id));
}

function areSomeChildrenChecked(node: PermissionNode, checked: Set<string>): boolean {
  const leafIds = getAllLeafIds(node.children || []);
  return leafIds.some((id) => checked.has(id));
}

function toggleNode(node: PermissionNode, checked: Set<string>): Set<string> {
  const next = new Set(checked);
  const leafIds = getAllLeafIds(node.children || []);
  const allChecked = areAllChildrenChecked(node, checked);
  for (const id of leafIds) {
    if (allChecked) {
      next.delete(id);
    } else {
      next.add(id);
    }
  }
  return next;
}

interface RoleData {
  id: string;
  name: string;
  color: string;
  permissions: string[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roleId: string;
}

const initialRoles: RoleData[] = [
  { id: "1", name: "Super Admin", color: "bg-purple-500", permissions: [...allLeafIds] },
  { id: "2", name: "Admin", color: "bg-blue-500", permissions: ["users-view", "users-create", "users-update", "menus-view", "menus-create", "roles-view", "customers-view", "customers-create"] },
  { id: "3", name: "Editor", color: "bg-green-500", permissions: ["users-view", "menus-view", "menus-create", "menus-update", "customers-view"] },
  { id: "4", name: "Viewer", color: "bg-gray-500", permissions: ["users-view", "menus-view", "roles-view", "customers-view", "stores-view"] },
];

const initialUsers: UserData[] = [
  { id: "1", name: "John Smith", email: "john@example.com", roleId: "1" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", roleId: "2" },
  { id: "3", name: "Michael Brown", email: "michael@example.com", roleId: "3" },
  { id: "4", name: "Emily Davis", email: "emily@example.com", roleId: "4" },
  { id: "5", name: "David Wilson", email: "david@example.com", roleId: "2" },
  { id: "6", name: "Lisa Anderson", email: "lisa@example.com", roleId: "3" },
];

const avatarColors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500"];

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}

function PermissionTreeNode({
  node,
  checked,
  onToggle,
  level = 0,
}: {
  node: PermissionNode;
  checked: Set<string>;
  onToggle: (id: string, isParent: boolean) => void;
  level?: number;
}): React.JSX.Element {
  const [expanded, setExpanded] = useState(true);
  const isLeaf = !node.children;
  const isChecked = isLeaf ? checked.has(node.id) : areAllChildrenChecked(node, checked);
  const isIndeterminate = !isLeaf && !isChecked && areSomeChildrenChecked(node, checked);

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
          isLeaf
            ? "hover:bg-gray-100"
            : "cursor-pointer font-medium text-gray-700 hover:bg-gray-100"
        }`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => {
          if (!isLeaf) setExpanded(!expanded);
        }}
      >
        {!isLeaf && (
          <ChevronRight
            className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
          />
        )}
        {isLeaf && <div className="w-4" />}
        <Checkbox
          checked={isIndeterminate ? "indeterminate" : isChecked}
          onCheckedChange={() => onToggle(node.id, !isLeaf)}
        />
        <span className={isLeaf ? "text-gray-600" : "text-gray-800"}>{node.name}</span>
        {!isLeaf && (
          <span className="ml-auto text-xs text-gray-400">
            {getAllLeafIds(node.children || []).filter((id) => checked.has(id)).length}/
            {getAllLeafIds(node.children || []).length}
          </span>
        )}
      </div>
      {expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <PermissionTreeNode
              key={child.id}
              node={child}
              checked={checked}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccessManagementPage(): React.JSX.Element {
  const [roles, setRoles] = useState<RoleData[]>(initialRoles);
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState<string>("1");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("1");
  const [checked, setChecked] = useState<Set<string>>(new Set(initialRoles[0].permissions));
  const [userSearch, setUserSearch] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const handleUserSelect = (userId: string) => {
    if (hasChanges) {
      if (!confirm("You have unsaved changes. Do you want to discard them?")) return;
    }
    setSelectedUserId(userId);
    const user = users.find((u) => u.id === userId);
    if (user) {
      const role = roles.find((r) => r.id === user.roleId);
      if (role) {
        setSelectedRoleId(role.id);
        setChecked(new Set(role.permissions));
      }
    }
    setHasChanges(false);
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      setChecked(new Set(role.permissions));
    }
    setHasChanges(false);
  };

  const handleToggle = (id: string, isParent: boolean) => {
    if (isParent) {
      const node = permissionTree.find((n) => n.id === id);
      if (node) {
        setChecked(toggleNode(node, checked));
      }
    } else {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }
    setHasChanges(true);
  };

  const handleSave = () => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRoleId
          ? { ...r, permissions: Array.from(checked) }
          : r,
      ),
    );
    setHasChanges(false);
  };

  const handleAssignRole = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUserId
          ? { ...u, roleId: selectedRoleId }
          : u,
      ),
    );
    setHasChanges(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Access Management</h1>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            Save Permissions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_1fr_300px]">
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <User className="h-4 w-4 text-gray-500" />
              Users
            </h2>
          </div>
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-[500px] divide-y divide-gray-50 overflow-y-auto">
            {filteredUsers.map((user, index) => {
              const role = roles.find((r) => r.id === user.roleId);
              return (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                    selectedUserId === user.id ? "bg-blue-50" : ""
                  }`}
                >
                  <Avatar size="sm">
                    <AvatarFallback className={`${avatarColors[index % avatarColors.length]} text-white text-xs`}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${selectedUserId === user.id ? "text-blue-700" : "text-gray-800"}`}>
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                  </div>
                  {selectedUserId === user.id && (
                    <Check className="h-4 w-4 shrink-0 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Shield className="h-4 w-4 text-gray-500" />
              Permissions
            </h2>
            {selectedUser && (
              <p className="mt-1 text-xs text-gray-400">
                Configuring permissions for <span className="font-medium text-gray-600">{selectedUser.name}</span>
              </p>
            )}
          </div>
          <div className="p-4">
            <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Current Role</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedRole?.name}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {checked.size} / {allLeafIds.length} permissions
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {permissionTree.map((node) => (
                <PermissionTreeNode
                  key={node.id}
                  node={node}
                  checked={checked}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Shield className="h-4 w-4 text-gray-500" />
              Assign Role
            </h2>
            {selectedUser && (
              <p className="mt-1 text-xs text-gray-400">
                Select a role for <span className="font-medium text-gray-600">{selectedUser.name}</span>
              </p>
            )}
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {roles.map((role) => {
                const permCount = role.permissions.length;
                const isSelected = selectedRoleId === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? "border-blue-200 bg-blue-50 ring-1 ring-blue-200"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${role.color} text-white text-sm font-semibold`}>
                      {role.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-gray-800"}`}>
                        {role.name}
                      </p>
                      <p className="text-xs text-gray-400">{permCount} permissions</p>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleAssignRole}
              disabled={!hasChanges && selectedUser?.roleId === selectedRoleId}
              className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Role to User
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
    </div>
  );
}
