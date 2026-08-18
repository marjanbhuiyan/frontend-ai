export interface ApiErrorResponse {
  success?: boolean;
  message: string;
  data?: null;
  errors?: Record<
    string,
    string[]
  >;
}