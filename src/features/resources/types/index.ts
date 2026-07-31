import type { FilterConfig } from "@/components/data-table";

/* -------------------------------------------------------------------------- */
/*                                   Field                                    */
/* -------------------------------------------------------------------------- */

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "select"
  | "multi-select"
  | "date"
  | "textarea"
  | "checkbox"
  | "file"
  | "phone"
  | "url";

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface ResourceField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
  defaultValue?: unknown;
  sortable?: boolean;
  searchable?: boolean;
  visible?: boolean;
  hidden?: boolean;
  width?: string;
  minWidth?: string;
  align?: "left" | "center" | "right";
  cell?: (value: unknown, row: unknown) => React.ReactNode;
  header?: string;
  enableHiding?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
}

/* -------------------------------------------------------------------------- */
/*                                Resource                                    */
/* -------------------------------------------------------------------------- */

export interface ResourcePermissions {
  create?: string[];
  read?: string[];
  update?: string[];
  delete?: string[];
}

export interface ResourceActions {
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  export?: boolean;
  bulkDelete?: boolean;
  view?: boolean;
}

export interface ResourceConfig {
  name: string;
  label: string;
  pluralLabel: string;
  endpoint: string;
  queryKey: string;
  icon?: string;
  fields: ResourceField[];
  permissions?: ResourcePermissions;
  actions?: ResourceActions;
  filters?: FilterConfig[];
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  permissions_key?: string;
}
