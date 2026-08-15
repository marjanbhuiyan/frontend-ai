import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlansApi, getCurrentSubscriptionApi, subscribeApi } from "../api/subscription-api";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@/utils/get-error-message";
import { toast } from "@/lib/toast";

export const SUBSCRIPTION_QUERY_KEY = ["subscriptions", "me"] as const;
export const PLANS_QUERY_KEY = ["plans"] as const;

/** Available plans for the subscription modal. */
export function usePlans() {
  return useQuery({
    queryKey: PLANS_QUERY_KEY,
    queryFn: getPlansApi,
    staleTime: 30 * 60 * 1000,
  });
}

/** Current user's active subscription (fresh source of truth for the gate). */
export function useCurrentSubscription() {
  return useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: getCurrentSubscriptionApi,
    retry: false,
  });
}

/**
 * Subscribes the user to a plan. On success the persisted subscription is
 * updated optimistically and the subscription query is invalidated so the
 * onboarding gate can advance to the store step.
 */
export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: number) => subscribeApi(planId),
    onSuccess: (res) => {
      // POST /subscriptions/me/subscribe returns `data.subscription` (the DB
      // row, with `status`/`expiresAt`/`currentPeriodEnd`) and `data.plan`.
      // Map it into the store's Subscription shape (which the onboarding gate
      // reads via `hasSubscription`).
      const sub = res?.data?.subscription;
      const plan = res?.data?.plan;
      useAuthStore.getState().setSubscription({
        hasSubscription: true,
        plan: plan?.name ?? null,
        status: sub?.status ?? "active",
        expiresAt: sub?.expiresAt ?? null,
        currentPeriodEnd: sub?.currentPeriodEnd ?? null,
      });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
      toast.success(res?.message ?? "Subscribed successfully.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to subscribe. Please try again."));
    },
  });
}
