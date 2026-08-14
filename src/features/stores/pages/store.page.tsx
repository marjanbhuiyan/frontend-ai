import { DataTable } from "@/components/data-table";
import { storesTableConfig } from "@/features/stores/stores.table";
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
import { useState } from "react";
import { StoreCreateDialog } from "@/features/stores/components/store-create-dialog";
import { PageHeader } from "@/components/shared/page-header";

export default function StorePage(): React.JSX.Element {
  const [addStoreDialogOpen, setAddStoreDialogOpen] = useState(false);

  return (
    <>
     <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Reusable page header: breadcrumb (Home → Store → List) + title + action.
          OLD (inline header kept for reference):
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-800">Store List</h1>
              <Breadcrumb className="mb-1">
                <BreadcrumbList>
                  <BreadcrumbItem><BreadcrumbLink href={ROUTES.HOME}>Home</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbLink>Store</BreadcrumbLink></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage>List</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button onClick={() => setAddStoreDialogOpen(true)} className="h-9 gap-1.5 self-start bg-indigo-600 text-white hover:bg-indigo-700 sm:self-auto rounded-xs cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Store
            </Button>
          </div> */}
      <PageHeader
        title="Store List"
        breadcrumb={[{ label: "Store" }, { label: "List" }]}
        actionLabel="Add Store"
        onAction={() => setAddStoreDialogOpen(true)}
      />

      <DataTable config={storesTableConfig} />
    </div>

    {/* Modular "New Store" dialog — shell + form split across files.
        OLD (inline dialog kept for reference):
        <Dialog open={addStoreDialogOpen} onOpenChange={setAddStoreDialogOpen}>
          <DialogContent showCloseButton={false} className="flex max-h-[90vh] flex-col gap-0 overflow-y-auto p-0 sm:max-w-[600px] lg:max-w-[766px] rounded-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <DialogTitle className="text-base font-medium text-gray-900">New Store</DialogTitle>
            </div>
            <div className="px-20 py-5">
              <div className="flex gap-20">
                <div className="flex-shrink-0 py-12">hello</div>
              </div>
            </div>
          </DialogContent>
        </Dialog> */}
    <StoreCreateDialog
      open={addStoreDialogOpen}
      onOpenChange={setAddStoreDialogOpen}
    />
  </>
  
);
}
