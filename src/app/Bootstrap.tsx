import type { ReactNode } from "react";
import { useBootstrap } from "@/hooks/useBootstrap";
import { GlobalLoader } from "@/components/common/global-loader";

export function Bootstrap({
  children,
}: {
  children: ReactNode;
}) {
  const { isPending, isError } = useBootstrap();

  if (isPending) {
    return <GlobalLoader />;
  }

  if (isError) {
    return <div>Error during bootstrap</div>;
  }

  return <>{children}</>;
}