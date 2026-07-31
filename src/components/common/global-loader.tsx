import { Loader2 } from "lucide-react";

interface GlobalLoaderProps {
  message?: string;
  subMessage?: string;
}

export function GlobalLoader({
  message = "Loading application...",
  subMessage,
}: GlobalLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Animated logo / spinner */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="h-16 w-16 rounded-full border-4 border-muted" />
          {/* Spinning arc */}
          <Loader2 className="absolute inset-0 h-16 w-16 animate-spin text-primary" />
        </div>
      </div>

      {/* Primary message */}
      <p className="text-lg font-semibold text-foreground">{message}</p>

      {/* Optional sub-message (step indicator) */}
      {subMessage && (
        <p className="mt-2 text-sm text-muted-foreground">{subMessage}</p>
      )}

      {/* Progress dots animation */}
      <div className="mt-6 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
