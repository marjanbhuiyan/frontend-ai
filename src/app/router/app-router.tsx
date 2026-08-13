import { Navigate, useRoutes, BrowserRouter } from "react-router-dom";
import React from "react";
import { ROUTES } from "@/constants";
import { lazy, Suspense, useMemo, useRef, useEffect, useState } from "react";
import { GlobalLoader } from "@/components/common/global-loader";
import { PageLoader } from "@/components/common/page-loader";
import { generateRoutesFromMenus } from "@/app/router/route-generator";
import { DashboardFallback } from "@/app/router/dashboard-fallback";
import DashboardLayout from "@/features/dashboard/layouts/dashboard-layout";
import { useBootstrap } from "@/app/hooks/useBootstrap";
import { useAuthStore } from "@/store/useAuthStore";



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

export const AppRoutes = React.memo(function AppRoutes(): React.JSX.Element {
  /* Narrow selector — only re-render when `menus` actually changes */
  const menus = useAuthStore((state) => state.menus);

  /* Detect when menus change so we can show a loader during re-resolve */
  const [isResolving, setIsResolving] = useState(false);
  const prevMenusRef = useRef(menus);

  useEffect(() => {
    if (prevMenusRef.current !== menus) {
      prevMenusRef.current = menus;
      setIsResolving(true);
      queueMicrotask(() => {
        queueMicrotask(() => setIsResolving(false));
      });
    }
  }, [menus]);

  /* Memoize the entire route tree — only recalculated when menus change */
  const routes = useMemo(
    () => [
      {
        path: ROUTES.HOME,
        element: <HomeRedirect />,
        errorElement: <ErrorPage />,
      },
      {
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
              /* FIXED: removed the redundant `index: true` fallback.
                 It served no purpose (the `*` catch-all already handles
                 unmatched paths) and created ambiguity with pathless
                 layout route resolution — contributing to the NotFound
                 flash during re-render. */
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
    ],
    [menus],
  );

  const element = useRoutes(routes);

  return (
    <>
      {/* Show a loader overlay while the route tree re-resolves after a
          store change (e.g. login, store-switch, session refresh).
          This prevents the user from seeing a flash of the NotFound page
          while React Router re-ranks the new route tree. */}
      {isResolving && (
        <PageLoader message="Loading page..." />
      )}
      {element}
    </>
  );
})

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
        {/* In-app lazy route loading -> lightweight PageLoader.
            GlobalLoader stays reserved for bootstrap (init/reload) above. */}
        <Suspense fallback={<PageLoader message="Loading page..." />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>;
}
