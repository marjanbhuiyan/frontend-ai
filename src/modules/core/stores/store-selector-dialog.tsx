import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Store } from "@/types/app.types";
import { useActiveStoreStore } from "@/platform/stores/active-store.store";

interface Props {
  open: boolean;
  stores: Store[];
}

export function StoreSelectorDialog({
  open,
  stores,
}: Props) {
  const setActiveStore =
    useActiveStoreStore(
      (state) =>
        state.setActiveStore,
    );

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Select Store
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {stores.map(
            (store) => (
              <Button
                key={store.id}
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  setActiveStore(
                    store.id,
                  )
                }
              >
                {store.name}
              </Button>
            ),
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}