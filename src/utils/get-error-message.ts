import type{ ApiError } from "@/types";

export const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as ApiError;
  const errors = err.response?.data?.errors;
  const message = err.response?.data?.message;
  if (errors && errors.length > 0) {
    const first = errors[0];
    if (typeof first === "string") return errors.join(", ");
    if (typeof first === "object" && "message" in first) return first.message;
  }
  if (message) return message;
  return fallback;
};
