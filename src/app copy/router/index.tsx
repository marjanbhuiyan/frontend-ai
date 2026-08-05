import { Navigate, useRoutes, BrowserRouter } from "react-router-dom";
import {
  PublicOnlyRoute,
} from "@/features/auth/providers/protected-route";
import { AppInitializer } from "@/app/providers/app-initializer";
import { ROUTES } from "@/constants";
import { lazy, Suspense } from "react";
import { GlobalLoader } from "@/components/common/global-loader";
import { generateRoutesFromMenus } from "@/app/router/route-generator";
import DashboardLayout from "@/features/dashboard/layouts/dashboard-layout";
import { useAuth } from "@/features/auth/hooks/auth-context";

import type React from "react";

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

function AppRoutes() {
  const { menus } = useAuth();

  const routes = [
    {
      path: ROUTES.HOME,
      element: <HomeRedirect />,
      errorElement: <ErrorPage />,
    },
    {
      path: ROUTES.LOGIN,
      element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>,
      errorElement: <ErrorPage />,
    },
    {
      path: ROUTES.REGISTER,
      element: <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>,
      errorElement: <ErrorPage />,
    },
    {
      path: ROUTES.DASHBOARD,
      element: <DashboardLayout />,
      errorElement: <ErrorPage />,
      children: [
        ...generateRoutesFromMenus(menus),
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
  return (
    <AppInitializer>
      <BrowserRouter>
        <Suspense fallback={<GlobalLoader message="Loading page..." />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </AppInitializer>
  );
}
