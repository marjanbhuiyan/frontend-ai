import {
  AppModule,
} from "./module-types";

import {
  usersModule,
} from "@/modules/users/users-module";

import {
  dashboardModule,
} from "@/modules/dashboard/dashboard-module";

export const appModules:
  AppModule[] = [
    dashboardModule,
    usersModule,
];