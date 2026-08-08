import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { usePublicRouteRefresh } from "@/app/hooks/usePublicRouteRefresh";

export function PublicRoute() {
  usePublicRouteRefresh();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const location = useLocation();

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
