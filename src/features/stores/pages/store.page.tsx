import { DataTable } from "@/components/data-table";
import { storesTableConfig } from "@/features/stores/stores.table";
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

export default function StorePage(): React.JSX.Element {

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            Store List
          </h1>

          {/* Breadcrumb sits at the very top, above the page title */}
          <Breadcrumb className="mb-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={ROUTES.HOME}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Store</BreadcrumbLink>
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
          Add Store
        </Button>
      </div>

      <DataTable config={storesTableConfig} />
    </div>
  );
}
