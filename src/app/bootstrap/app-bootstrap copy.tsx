import { Navigate, Outlet } from "react-router-dom";
import { useAppBootstrap } from "@/app/bootstrap/use-app-bootstrap";
import { useActiveStoreStore } from "@/platform/stores/active-store.store";
import { ROUTES } from "@/constants/routes";
import { AppLoading } from "@/shared/components/app-loading";
import { CreateStoreDialog } from "@/modules/core/stores/create-store-dialog";
import { StoreSelectorDialog } from "@/modules/core/stores/store-selector-dialog";

export function AppBootstrap() {
  const { data, isLoading, isError } = useAppBootstrap();

  const activeStoreId =
    useActiveStoreStore(
      (state) =>
        state.activeStoreId,
    );

  const setActiveStore =
    useActiveStoreStore(
      (state) =>
        state.setActiveStore,
    );

  if (isLoading) {
    return <AppLoading />;
  }

  if (isError || !data) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
      />
    );
  }

  /*
   * GLOBAL USER
   */
  if (
    data.accountType === "global"
  ) {
    return <Outlet />;
  }

  /*
   * STORE USER
   */
  if (
    data.accountType === "store"
  ) {
    /*
     * Subscription required
     */
    if (
      !data.subscription?.active
    ) {
      return (
        <Navigate
          to={ROUTES.SUBSCRIPTION}
          replace
        />
      );
    }

    /*
     * No stores
     */
    if (
      data.stores.length === 0
    ) {
      return (
        <>
          <CreateStoreDialog
            open
          />

          <AppLoading />
        </>
      );
    }

    /*
     * One store
     */
    if (
      data.stores.length === 1 &&
      !activeStoreId
    ) {
      setActiveStore(
        data.stores[0].id,
      );

      return <AppLoading />;
    }

    /*
     * Multiple stores
     */
    if (
      data.stores.length > 1 &&
      !activeStoreId
    ) {
      return (
        <>
          <StoreSelectorDialog
            open
            stores={data.stores}
          />

          <AppLoading />
        </>
      );
    }
  }

  /*
   * Store exists but bootstrap did not
   * have active store context.
   */
  if (
    data.accountType === "store" &&
    !data.activeStore
  ) {
    return <AppLoading />;
  }

  return <Outlet />;
}