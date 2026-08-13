import { DataTable } from "@/components/data-table";
import { usersTableConfig } from "@/features/users/users.table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/constants";

export default function UsersPage(): React.JSX.Element {
  return (
    <div className="p-6">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.HOME}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Customer</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>List</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">List</h1>
      {/* Removed the static `data` override so the DataTable runs in server
          mode: it now fires the GET /users request (with page/limit/search/
          sort params) as soon as this page is visited. */}
      <DataTable config={usersTableConfig} />
    </div>
  );
}
