import { Navigate } from "react-router-dom";
import { useAppBootstrap } from "@/app/bootstrap/use-app-bootstrap";
import { AppLoading } from "@/shared/components/app-loading";

interface PermissionRouteProps {
  permission: string;
  children: React.ReactNode;
}

export function PermissionRoute({
  permission,
  children,
}: PermissionRouteProps) {
  const {
    data,
    isLoading,
  } = useAppBootstrap();

  if (isLoading) {
    return <AppLoading />;
  }

  if (!data) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !data.permissions.includes(
      permission,
    )
  ) {
    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return <>{children}</>;
}