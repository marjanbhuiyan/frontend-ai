import { useState, type ReactNode } from "react";
// import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/hooks/auth-context";
import { DEFAULTS } from "@/constants";
import type React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


export function AppProviders({ children }: { children: ReactNode }): React.JSX.Element {
  // Create QueryClient inside component to ensure proper lifecycle
  // and avoid issues with hot-reloading or SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 2,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
            staleTime: DEFAULTS.STALE_TIME,
            gcTime: DEFAULTS.GC_TIME,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* <BrowserRouter> */}
        <AuthProvider>{children}</AuthProvider>
      {/* </BrowserRouter> */}
       {/* Devtools only in development  */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )} 
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        toastOptions={{
          duration: 4000,
        }}
      />
    </QueryClientProvider>
  );
}
