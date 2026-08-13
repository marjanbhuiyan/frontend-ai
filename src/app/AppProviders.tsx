import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { DEFAULTS } from "@/constants";

export function AppProviders({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: DEFAULTS.STALE_TIME,
            gcTime: DEFAULTS.GC_TIME,
            retry: 1,
            refetchOnMount: false,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}

      <Toaster
        richColors
        closeButton
        position="bottom-right"
      />
    </QueryClientProvider>
  );
}