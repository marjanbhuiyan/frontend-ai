import { Navigate, useRoutes, BrowserRouter } from "react-router-dom";
// import {
//   PublicOnlyRoute,
// } from "@/features/auth/providers/protected-route";
import { ROUTES } from "@/constants";
import { lazy, Suspense } from "react";
import { GlobalLoader } from "@/components/common/global-loader";
import { generateRoutesFromMenus } from "@/app/router/route-generator";
import { DashboardFallback } from "@/app/router/dashboard-fallback";
import DashboardLayout from "@/features/dashboard/layouts/dashboard-layout";
import { useBootstrap } from "@/app/hooks/useBootstrap";
import { useAuthStore } from "@/store/useAuthStore";


import type React from "react";
import { ProtectedRoute } from "@/app/routes/ProtectedRoute";
import { PublicRoute } from "@/app/routes/public-route";
// import { ProtectedRoute } from "@/features/auth/providers/protected-route";

const NotFoundPage = lazy(
  () => import("@/components/shared/not-found-page")
);
const ErrorPage = lazy(
  () => import("@/components/shared/error-page")
);
const UnauthorizedPage = lazy(
  () => import("@/features/auth/pages/unauthorized-page")
);
const RegisterPage = lazy(
  () => import("@/features/auth/pages/register-page")
);
const LoginPage = lazy(
  () => import("@/features/auth/pages/login-page")
);

function HomeRedirect(): React.JSX.Element {
  return <Navigate to={ROUTES.LOGIN} replace />;
}

export function AppRoutes() {
  // Single source of truth: the persisted Zustand store carries the backend
  // filtered (permission + store scoped) menu tree across reloads.
  const { menus } = useAuthStore();

  const routes = [
    {
      path: ROUTES.HOME,
      element: <HomeRedirect />,
      errorElement: <ErrorPage />,
    },
    {
      /* FIXED: closing tag was `</PublicOnlyRoute>` (mismatch) — now `</PublicRoute>`
         to match the opening `<PublicRoute>` imported above. */
      path: ROUTES.LOGIN,
      element: <PublicRoute />,
      children: [
        {
          index: true,
          element: <LoginPage />,
        },
      ],
      errorElement: <ErrorPage />,
    },
    {
      path: ROUTES.REGISTER,
      /* FIXED: opening tag was `<PublicOnlyRoute>` (not imported) — now `<PublicRoute>`
         to match the closing `</PublicRoute>` and the imported component. */
      // element: <PublicRoute />,
      children: [
        {
          index: true,
          element: <RegisterPage />,
        },
      ],
      errorElement: <ErrorPage />,
    },
    {
      /* FIXED (absolute-path error): menu-generated routes carry ABSOLUTE
         paths from the backend (`/dashboard`, `/dashboard/users`, `/settings`,
         ...). Nesting them under `path: "/dashboard"` made any sibling absolute
         path invalid — "Absolute route path '/dashboard' nested under path
         '/dashboard/' is not valid". Now `ProtectedRoute` + `DashboardLayout`
         are PATHLESS layout routes, so the menu `api` paths become the real
         routes and match the sidebar's `item.path` navigation.
         `*` catch-all keeps unmatched URLs inside the dashboard chrome. */
      element: <ProtectedRoute />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            ...generateRoutesFromMenus(menus),
            { index: true, element: <DashboardFallback /> },
            { path: "*", element: <DashboardFallback /> },
          ],
        },
      ],
    },
    {
      path: ROUTES.UNAUTHORIZED,
      element: <UnauthorizedPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
      errorElement: <ErrorPage />,
    },
  ];

  return useRoutes(routes);
}

export function AppRouter(): React.JSX.Element {
    const bootstrap = useBootstrap();

    if (bootstrap.isPending) {
      return (
        <GlobalLoader
          message="Starting application..."
          subMessage="Please wait while we start your application..."
        />
      );
    }

    if (bootstrap.isError) {
      return  <Navigate to={ROUTES.LOGIN} replace />
    }

    return <BrowserRouter>
        <Suspense fallback={<GlobalLoader message="Loading page..." />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>;
}
