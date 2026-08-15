import { AppProviders } from "@/app/AppProviders";
import { lazy, Suspense } from "react";
import { Bootstrap } from "@/app/Bootstrap";
import { BrowserRouter, createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
// GlobalLoader no longer used directly in App.tsx — it was only the Suspense
// fallback here. Bootstrap (src/app/Bootstrap.tsx) renders GlobalLoader during
// app init/reload, and in-app lazy routing now uses PageLoader instead.
// import { GlobalLoader } from "@/components/common/global-loader";
import { PageLoader } from "@/components/common/page-loader";
import { HomePage } from "@/pages/home";
import { RegisterPage } from "@/pages/auth/register";
import { ProductsPage } from "@/pages/products/products";
import { ProtectedRoute } from "@/app/routes/ProtectedRoute";
import { PublicRoute } from "@/app/routes/public-route";
import { AppRoutes } from "@/app/router/app-router";
// import { generateRoutesFromMenus } from "@/app/router/route-generator";


const LoginPage = lazy(
  () => import("@/features/auth/pages/login-page")
);
const DashboardLayout = lazy(
  () => import("@/features/dashboard/layouts/dashboard-layout")
);
const UsersPage = lazy(
  () => import("@/features/users/pages/user.page")
);
const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/dashboard/dashboard-page")
);

export const router = createBrowserRouter([
  {
    element: <PublicRoute/>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
          {
            path: "/dashboard",
            element: <DashboardLayout />,
            // children: [
            //   {
            //     index: true,
            //     element: <DashboardPage />,
            //   },
            //   {
            //     path: "users",
            //     element: <UsersPage />,
            //   },
            // ],
            // children: [
            //         ...generateRoutesFromMenus(menus),
            //         { path: "*", element: <DashboardFallback /> },
            //       ],
          },

          {
            path: "/users",
            element: <UsersPage />,
          },

          {
            path: "/products",
            element: <ProductsPage />,
          },
        ],
      },
] as RouteObject[]);

export default function App() {
  return (
    <AppProviders>
      <Bootstrap>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Bootstrap>
    </AppProviders>
  );
}
