import { Routes, Route, Navigate } from "react-router-dom";
import {
  PublicOnlyRoute,
} from "@/features/auth/components/protected-route";
import { AppInitializer } from "@/app/providers/app-initializer";
import { ROUTES } from "@/constants";
import { lazy, Suspense } from "react";
import { GlobalLoader } from "@/components/common/global-loader";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { generateRoutesFromMenus } from "@/app/router/route-generator";

import type React from "react";

const NotFoundPage = lazy(
  () => import("@/components/shared/not-found-page")
);
const UnauthorizedPage = lazy(
  () => import("@/features/auth/pages/unauthorized-page")
);
const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/dashboard/dashboard-page")
);
const RegisterPage = lazy(
  () => import("@/features/auth/pages/register-page")
);
const LoginPage = lazy(
  () => import("@/features/auth/pages/login-page")
);

function HomeRedirect(): React.JSX.Element {
  // const { user, isLoading } = useAuth();
  // if (isLoading) return <GlobalLoader message="Loading..." />;
  // return <Navigate to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />;
  return <Navigate to={ROUTES.LOGIN} replace />;
}

function AuthRoutes(): React.JSX.Element {
  const { menus} = useAuth();
  const dynamicRoutes = generateRoutesFromMenus(menus);

  console.log("dynamicRoutes", dynamicRoutes);
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* <Route element={<ProtectedLayout />}>
        {/* {dynamicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))} */}
        {/* <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} /> */}
        {/* <Route path={ROUTES.DASHBOARD} element={<DemoDashboardPage />} />
      // </Route> */} 

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <PublicOnlyRoute>
            <Route path={ROUTES.HOME} element={<DashboardPage />} />
          </PublicOnlyRoute>
        }
      />

      {/* <Route element={<ProtectedLayout />}> */}
        {/* <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} /> */}
      {/* </Route> */}

      <Route
        path={ROUTES.UNAUTHORIZED}
        element={<UnauthorizedPage />}
      />

      <Route
        path={ROUTES.HOME}
        element={<HomeRedirect />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function AppRouter(): React.JSX.Element {
  return (
    <AppInitializer>
        <Suspense fallback={<GlobalLoader message="Loading page..." />}>
        <AuthRoutes />
        </Suspense>
    </AppInitializer>
  );
}
