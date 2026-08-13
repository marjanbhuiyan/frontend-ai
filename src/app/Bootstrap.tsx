import type { ReactNode } from "react";
import { useBootstrap } from "@/app/hooks/useBootstrap";
import { GlobalLoader } from "@/components/common/global-loader";

export function Bootstrap({ children }: { children: ReactNode }) {
  const { isPending } = useBootstrap();

  if (isPending) {
    return <GlobalLoader />;
  }

  return <>{children}</>;
}