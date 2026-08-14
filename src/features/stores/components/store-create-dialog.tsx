import { Store as StoreIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStoreSchema, type CreateStoreForm as CreateStoreFormData } from "@/features/store/types";
import { CreateStoreForm } from "@/features/store/components/create-store-form";
import { Button } from "@/components/ui/button";
import { useCreateStore } from "@/features/store/hooks/use-store";

export function StoreCreateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }): React.JSX.Element {
  const createStore = useCreateStore();

  const form = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  const createStoreHandler = async (data: CreateStoreFormData) => {
    console.log(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 overflow-y-auto p-0 sm:max-w-[600px] lg:max-w-[766px] rounded-sm"
      >
        {/* ── Dialog header ── */}
        <div className="border-b border-gray-100 px-6 py-4">
          <DialogTitle className="text-base font-medium text-gray-900">
            New Store
          </DialogTitle>
        </div>

        {/* ── Dialog body — two columns: left info panel + right form ── */}
        <div className="px-20 py-5">
          <div className="flex gap-20">
            {/* Left column — store intro (replaces the old "hello" placeholder).
                OLD (inline placeholder kept for reference):
                <div className="flex-shrink-0 py-12">hello</div> */}
            <div className="flex-shrink-0 py-12">
              <StoreIcon className="h-12 w-12 text-indigo-600" />
              <p className="mt-4 text-sm font-medium text-gray-800">Create your store</p>
              <p className="mt-1 max-w-[180px] text-xs text-gray-400">
                Add a new store to start managing your business.
              </p>
            </div>

            {/* Right column — the modular store creation form */}
            <div className="min-w-0 flex-1">
              <CreateStoreForm form={form} onSubmit={createStoreHandler} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <Button
              onClick={() => {
                onOpenChange(false)
                form.reset()
              }}
              variant="outline"

            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="form-rhf-demo"
              disabled={createStore.isPending}
            >
              {createStore.isPending ? "Saving..." : "Add"}
            </Button>
          </div>
      </DialogContent>
    </Dialog>
  );
}

export default StoreCreateDialog;
