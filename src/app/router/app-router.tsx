import { Navigate, useRoutes, BrowserRouter } from "react-router-dom";
import {
  PublicOnlyRoute,
} from "@/features/auth/providers/protected-route";
import { ROUTES } from "@/constants";
import { lazy, Suspense } from "react";
import { GlobalLoader } from "@/components/common/global-loader";
import { generateRoutesFromMenus } from "@/app/router/route-generator";
import DashboardLayout from "@/features/dashboard/layouts/dashboard-layout";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { useBootstrap } from "@/hooks/useBootstrap";


import type React from "react";
import { ProtectedRoute } from "@/features/auth/providers/protected-route";

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
      element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
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
