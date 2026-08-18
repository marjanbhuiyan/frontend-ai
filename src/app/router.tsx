import { lazy } from "react";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { useAuthStore } from "@/platform/auth/auth.store";
import { AppBootstrap } from "@/app/bootstrap/app-bootstrap";
import { DashboardLayout } from "@/app/layouts/dashboard-layout";

import {
  LoginPage,
} from "@/modules/core/auth/login-page";

import {
  RegisterPage,
} from "@/modules/core/auth/register-page";

import { DashboardPage } from "@/modules/dashboard/dashboard-page";

import {
  SubscriptionPage,
} from "@/modules/core/subscription/subscription-page";

import {
  ForbiddenPage,
} from "@/modules/core/errors/forbidden-page";

import { PermissionRoute } from "@/platform/authorization/permission-route";
const UsersPage = lazy( () => import("@/modules/users/pages/users-page"));

const ProductsPage = lazy(() =>import("@/modules/products/pages/products-page"));

function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  console.log("access token in protected route", accessToken);

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const accessToken = useAuthStore( (state) => state.accessToken);

  console.log("access token in public only route", accessToken);

  if (accessToken) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

export const router = createBrowserRouter([{
      element: (
        <PublicOnlyRoute />
      ),

      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },

        {
          path: "/register",
          element: (
            <RegisterPage />
          ),
        },
      ],
    },

    {
      element: (
        <ProtectedRoute />
      ),

      children: [
        {
          element: (
            <AppBootstrap />
          ),

          children: [
            {
              element: (
                <DashboardLayout />
              ),

              children: [
                {
                  path: "/dashboard",
                  element: (
                    <DashboardPage />
                  ),
                },

    //             // {
    //             //   path: "/users",
    //             //   element: (
    //             //     <PermissionRoute
    //             //       permission="users.view"
    //             //     >
    //             //       <UsersPage />
    //             //     </PermissionRoute>
    //             //   ),
    //             // },

    //             // {
    //             //   path: "/products",
    //             //   element: (
    //             //     <PermissionRoute
    //             //       permission="products.view"
    //             //     >
    //             //       <ProductsPage />
    //             //     </PermissionRoute>
    //             //   ),
    //             // },
              ],
            },
          ],
        },
      ],
    },

    {
      path: "/subscription",
      element: (
        <SubscriptionPage />
      ),
    },

    {
      path: "/403",
      element: <ForbiddenPage />,
    },

    {
      path: "*",
      element: (
        <Navigate
          to="/dashboard"
          replace
        />
      ),
    },
  ]);