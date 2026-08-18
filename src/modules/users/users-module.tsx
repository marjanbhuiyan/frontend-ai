import {
  lazy,
} from "react";

import {
  AppModule,
} from "@/platform/modules/module-types";

import {
  USERS_PERMISSIONS,
} from "./permissions";

const UsersPage =
  lazy(() =>
    import("./pages/users-page"),
  );

export const usersModule:
  AppModule = {
    id: "users",

    name: "Users",

    scope: "store",

    permissions: [
      USERS_PERMISSIONS.VIEW,
      USERS_PERMISSIONS.CREATE,
      USERS_PERMISSIONS.UPDATE,
      USERS_PERMISSIONS.DELETE,
    ],

    navigation: [
      {
        id: "users",
        title: "Users",
        path: "/users",
        permission:
          USERS_PERMISSIONS.VIEW,
      },
    ],

    routes: [
      {
        path: "/users",
        permission:
          USERS_PERMISSIONS.VIEW,
        component:
          UsersPage,
      },
    ],
  };