import { AppProviders } from "@/app/AppProviders";
import { lazy, Suspense } from "react";
import { Bootstrap } from "@/app/Bootstrap";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { GlobalLoader } from "@/components/common/global-loader";
import { HomePage } from "@/pages/home";
import { RegisterPage } from "@/pages/auth/register";
import { DashboardPage } from "@/pages/dashboard/dashboard";
import { UsersPage } from "@/pages/users/users";
import { ProductsPage } from "@/pages/products/products";
import { ProtectedRoute } from "@/app/routes/ProtectedRoute";
import { PublicRoute } from "@/app/routes/public-route";

const LoginPage = lazy(
  () => import("@/features/auth/pages/login-page")
);
const DashboardLayout = lazy(
  () => import("@/features/dashboard/layouts/dashboard-layout")
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
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
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
    ],
  },
] as RouteObject[]);
export default function App() {
  return (
    <AppProviders>
      <Bootstrap>
        <Suspense fallback={<GlobalLoader message="Loading page..." />}>
          <RouterProvider router={router} />
        </Suspense>
      </Bootstrap>
    </AppProviders>
  );
}
