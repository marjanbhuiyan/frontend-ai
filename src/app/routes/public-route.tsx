import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export function PublicRoute() {
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