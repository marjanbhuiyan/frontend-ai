import { lazy } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type React from "react";

const NotFoundPage = lazy(
  () => import("@/components/shared/not-found-page")
);
const UnauthorizedPage = lazy(
  () => import("@/features/auth/pages/unauthorized-page")
);

/**
 * Catch-all route inside the dashboard layout. Because routes are generated
 * only from the backend-filtered menu tree, a direct link to a permission-gated
 * URL never matches a route. If the URL is in the session's `forbiddenRoutes`
 * (known-but-denied) we render the Unauthorized page; otherwise it's a URL that
 * doesn't exist at all, so we render the NotFound page.
 */
export function DashboardFallback(): React.JSX.Element {
  const { pathname } = useLocation();
  const forbiddenRoutes = useAuthStore((state) => state.forbiddenRoutes);

  const isForbidden = forbiddenRoutes.some((route) => {
    if (pathname === route) return true;
    const normalized = route.replace(/\/+$/, "");
    return pathname.startsWith(normalized + "/");
  });

  return isForbidden ? <UnauthorizedPage /> : <NotFoundPage />;
}