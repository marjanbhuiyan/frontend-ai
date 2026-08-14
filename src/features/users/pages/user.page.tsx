import { DataTable } from "@/components/data-table";
import { usersTableConfig } from "@/features/users/users.table";
// OLD (inline header): breadcrumb + title + action button were written inline.
// Now extracted into the reusable <PageHeader> shared component.
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { ROUTES } from "@/constants";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

/* UI polish + spacing pass for the Users list page.
   Kept all existing components/flows — only the layout/order and spacing
   were improved so the page matches the customer-list reference design:
   breadcrumb on top, then a title + subtitle header row, then the table.
   The header (breadcrumb + title + action) now uses the shared <PageHeader>. */
export default function UsersPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="User List"
        breadcrumb={[{ label: "Customer" }, { label: "List" }]}
        actionLabel="Add Customer"
        onAction={() => { }}
      />

      {/* Data table */}
      <DataTable config={usersTableConfig} />
    </div>
  );
}