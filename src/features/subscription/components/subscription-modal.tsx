import { useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePlans, useSubscribe } from "../hooks/use-subscription";
import type { Plan } from "../types";

/**
 * Price is stored in cents — format as a human-readable currency string.
 */
function formatPrice(price: number, currency: string, cycle: string): string {
  const value = price / 100;
  const formatted = Number.isInteger(value)
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency}${formatted}/${cycle === "yearly" ? "yr" : "mo"}`;
}

/**
 * Blocking subscription picker shown by the onboarding gate when the user has
 * no active plan. Lists plans from GET /plans and lets the user choose one.
 */
export function SubscriptionModal(): React.JSX.Element {
  const plansQuery = usePlans();
  const subscribe = useSubscribe();

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const plans: Plan[] = (plansQuery.data?.data ?? [])
    .filter((plan) => plan.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSubscribe = () => {
    if (selectedId == null) return;
    subscribe.mutate(selectedId);
  };

  return (
    <Dialog open onOpenChange={() => {}} disablePointerDismissal>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Choose your plan</DialogTitle>
          <DialogDescription>
            Pick a subscription to unlock your workspace. You can change plans at any time.
          </DialogDescription>
        </DialogHeader>

        {plansQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {plans.map((plan) => {
              const selected = plan.id === selectedId;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedId(plan.id)}
                  className={cn(
                    "flex flex-col rounded-lg border p-4 text-left transition-colors",
                    selected
                      ? "border-blue-600 ring-1 ring-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{plan.name}</span>
                    {selected && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {formatPrice(plan.price, plan.currency, plan.billingCycle)}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">{plan.description}</p>

                  <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-600">
                    {plan.limits.maxStores != null ? (
                      <p>Up to {plan.limits.maxStores} store{plan.limits.maxStores > 1 ? "s" : ""}</p>
                    ) : (
                      <p>Unlimited stores</p>
                    )}
                    {plan.limits.maxUsers != null ? (
                      <p>Up to {plan.limits.maxUsers} users</p>
                    ) : (
                      <p>Unlimited users</p>
                    )}
                    {plan.limits.maxProducts != null ? (
                      <p>Up to {plan.limits.maxProducts} products</p>
                    ) : (
                      <p>Unlimited products</p>
                    )}
                    <p className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-gray-400" />
                      {plan.features.analytics ? "Analytics" : "No analytics"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <Button
          className="w-full"
          disabled={selectedId == null || subscribe.isPending}
          onClick={handleSubscribe}
        >
          {subscribe.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : selectedId == null ? (
            "Select a plan to continue"
          ) : (
            "Continue"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
