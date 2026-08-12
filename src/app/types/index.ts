export interface Menu {
  id?: string;
  title: string;
  type: "group" | "item" | "collapse";
  route?: string;
  pathname?: string;
  icon?: string;
  children?: Menu[];
  component?: string;
  /* Backend also sends the page identifier under `componentName` (see the
     menu-management form + features/auth/types). Declared here so the route
     generator can fall back to it when `component` is absent. */
  componentName?: string;
  resource?: string;
  api?: string;
  badge?: {
    title: string;
    variant: "teal" | "red" | "blue" | "green" | "default";
  };
}

export interface MenuResponse {
  data: Menu[];
  statusCode: number;
  message: string;
}
