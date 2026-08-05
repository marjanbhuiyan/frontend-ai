import { AxiosError } from "axios";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type FieldError = { field: string; message: string };

export type ApiError = AxiosError<{
  success: boolean;
  message: string;
  errors?: string[] | FieldError[];
  data: null;
}>;

export interface SelectOption {
  label: string;
  value: string | number;
}
