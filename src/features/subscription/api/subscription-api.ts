import { apiClient } from "@/services/api-client";
import type { PlansResponse, SubscriptionResponse } from "../types";

/**
 * Returns the list of available subscription plans (Starter / Pro / Enterprise).
 * Public catalog route — used to render the plan cards in the subscription modal.
 */
export async function getPlansApi(): Promise<PlansResponse> {
  const { data } = await apiClient.get<PlansResponse>("/plans");
  return data;
}

/**
 * Returns the current user's active subscription. Same shape as the
 * `subscription` field on the auth responses. Used by the onboarding gate so a
 * hard refresh still knows whether a plan is active.
 */
export async function getCurrentSubscriptionApi(): Promise<SubscriptionResponse> {
  const { data } = await apiClient.get<SubscriptionResponse>("/subscriptions/me");
  return data;
}

/**
 * Subscribes the current user to a plan. Sends the selected `planId` to
 * POST /subscriptions/me/subscribe. Returns the new subscription plus the plan.
 */
export async function subscribeApi(planId: number) {
  const { data } = await apiClient.post("/subscriptions/me/subscribe", { planId });
  return data;
}
