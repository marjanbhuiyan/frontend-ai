import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { GlobalLoader } from "@/components/common/global-loader";
import { ROUTES } from "@/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <GlobalLoader message="Verifying session..." />;
  }

  if (!user) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  if (requiredRoles?.length) {
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }
  }

  return <>{children}</>;
}


interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}


export function PublicOnlyRoute({
  children,
  redirectTo = ROUTES.DASHBOARD,
}: PublicOnlyRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <GlobalLoader message="Loading..." />;
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
