import { lazy, type LazyExoticComponent, type ComponentType } from "react";

const DashboardPage = lazy(() => import("@/features/dashboard/pages/dashboard/dashboard-page"));
const UserManagementPage = lazy(() => import("@/features/users/pages/UsersPage"));
const MenuManagementPage = lazy(() => import("@/features/dashboard/pages/menu-management"));
const RoleManagementPage = lazy(() => import("@/features/dashboard/pages/role-management"));
const CustomerManagementPage = lazy(() => import("@/features/dashboard/pages/customer-management"));
const StoreManagementPage = lazy(() => import("@/features/dashboard/pages/store-management"));
const AccessManagementPage = lazy(() => import("@/features/dashboard/pages/access-management"));
const SettingsPage = lazy(() => import("@/features/dashboard/pages/settings"));

const GenericDataTablePage = lazy(() => import("@/features/resources/components/GenericDataTablePage"));
const GenericFormPage = lazy(() => import("@/features/resources/components/GenericFormPage"));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentRegistry: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  dashboard: DashboardPage,
  UserManagement: UserManagementPage,
  MenuManagement: MenuManagementPage,
  RoleManagement: RoleManagementPage,
  CustomerManagement: CustomerManagementPage,
  StoreManagement: StoreManagementPage,
  AccessManagement: AccessManagementPage,
  settings: SettingsPage,
  datatable: GenericDataTablePage,
  FormPage: GenericFormPage,
};


