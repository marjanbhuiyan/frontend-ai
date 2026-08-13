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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

/* UI polish + spacing pass for the Users list page.
   Kept all existing components/flows — only the layout/order and spacing
   were improved so the page matches the customer-list reference design:
   breadcrumb on top, then a title + subtitle header row, then the table. */
export default function UsersPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">

          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            User List
          </h1>

          {/* Breadcrumb sits at the very top, above the page title */}
          <Breadcrumb className="mb-1">
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
        </div>

        <Button
          onClick={() => { }}
          className="h-9 gap-1.5 self-start bg-indigo-600 text-white hover:bg-indigo-700 sm:self-auto rounded-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>


      {/* Data table */}
      <DataTable config={usersTableConfig} />
    </div>
  );
}