/**
 * Shared / global TypeScript types used across multiple features.
 * Feature-specific types live inside their own feature's `types/` folder.
 */

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface SelectOption {
  label: string;
  value: string | number;
}
