import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
}

/**
 * Lightweight in-app loading indicator.
 *
 * Unlike `GlobalLoader` (a full-screen, fixed overlay reserved for app
 * initialization / reload / bootstrap), this is an inline page-level loader
 * used while routing inside the app — i.e. when the route tree re-resolves
 * after a store change, or while a lazy page chunk is loading via Suspense.
 *
 * Styling mirrors `GlobalLoader` (same spinner + muted ring + progress dots)
 * but is not `fixed`/full-screen, so it does not cover the whole viewport.
 */
export function PageLoader({ message = "Loading page..." }: PageLoaderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-4 border-muted" />
        <Loader2 className="absolute inset-0 h-10 w-10 animate-spin text-primary" />
      </div>

      <p className="text-sm font-medium text-foreground">{message}</p>

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}