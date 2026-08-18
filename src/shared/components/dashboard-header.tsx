import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppBootstrap } from "@/app/bootstrap/use-app-bootstrap";
import { useActiveStoreStore } from "@/platform/stores/active-store.store";
import { useLogout } from "@/platform/auth/auth.hooks";

export function DashboardHeader() {
  const { data } = useAppBootstrap();

  const logout = useLogout();

  const setActiveStore = useActiveStoreStore(
      (state) =>
        state.setActiveStore,
    );

  const user = data?.user;

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div>
        {data?.accountType ===
          "store" && (
          <select
            value={
              data.activeStore?.id ??
              ""
            }
            onChange={(event) => {
              setActiveStore(
                Number(
                  event.target
                    .value,
                ),
              );
            }}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            {data.stores.map(
              (store) => (
                <option
                  key={store.id}
                  value={store.id}
                >
                  {store.name}
                </option>
              ),
            )}
          </select>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>
            {user?.firstName?.[0]}
          </AvatarFallback>
        </Avatar>

        <span className="hidden text-sm md:block">
          {user?.firstName}{" "}
          {user?.lastName}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            logout.mutate()
          }
        >
          Logout
        </Button>
      </div>
    </header>
  );
}