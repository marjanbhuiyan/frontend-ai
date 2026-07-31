import { cn } from "@/lib/utils";
import type React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

function Alert({
  className,
  variant = "default",
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4 pl-10 text-sm",
        "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4",
        variant === "destructive" &&
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function AlertTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h5>
  );
}

function AlertDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Alert, AlertTitle, AlertDescription };
