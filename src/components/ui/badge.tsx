import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: "text-foreground",
        success: "border-transparent bg-green-50 text-green-700 border-green-200",
        warning: "border-transparent bg-yellow-50 text-yellow-700 border-yellow-200",
        info: "border-transparent bg-blue-50 text-blue-700 border-blue-200",
        error: "border-transparent bg-red-50 text-red-500 border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
