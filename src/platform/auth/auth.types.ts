import {z} from "zod";
import {loginSchema, registerSchema} from "@/platform/auth/auth.schema";

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
}

export interface LoginResponse {
  accessToken: string;
}



export type MeResponse = ApiResponse<User>;
export type AuthResponse = ApiResponse<LoginResponse>;
export type LoginCredentials = z.input<typeof loginSchema>;
export type RegisterCredentials = z.input<typeof registerSchema>;
