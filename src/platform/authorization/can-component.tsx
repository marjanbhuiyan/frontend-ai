import type{ ReactNode } from "react";
import { useAppBootstrap } from "@/app/bootstrap/use-app-bootstrap";

interface CanProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({
  permission,
  children,
  fallback = null,
}: CanProps) {
  const { data } = useAppBootstrap();

  const allowed = data?.permissions.includes( permission);

  if (!allowed) {
    return fallback;
  }

  return <>{children}</>;
}