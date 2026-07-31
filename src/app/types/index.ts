export interface Menu {
  id?: string;
  title: string;
  type: "group" | "item" | "collapse";
  route?: string;
  pathname?: string;
  icon?: string;
  children?: Menu[];
  component?: string;
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
