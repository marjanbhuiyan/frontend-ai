import type { ApiResponse, Subscription } from "@/features/auth/types";

/* Plan shapes returned by GET /plans. `price` is in the smallest currency unit
   (cents), `limits` are nullable for unlimited plans, `features` are booleans. */
export interface PlanLimits {
  maxUsers: number | null;
  maxStores: number | null;
  maxProducts: number | null;
  maxUploadsGB: number | null;
}

export interface PlanFeatures {
  sla: boolean;
  analytics: boolean;
  apiAccess: boolean;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  currency: string;
  limits: PlanLimits;
  features: PlanFeatures;
  permissions: string[];
  durationDays: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type PlansResponse = ApiResponse<Plan[]>;
export type SubscriptionResponse = ApiResponse<Subscription>;
