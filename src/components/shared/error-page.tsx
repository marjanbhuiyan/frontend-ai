import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { ROUTES } from "@/constants";
import type React from "react";

export function ErrorPageContent(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-7xl font-bold text-destructive">500</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        An unexpected error occurred. Please try again later.
      </p>
    </div>
  );
}

export default function ErrorPage(): React.JSX.Element {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-7xl font-bold text-destructive">
        {isRouteError ? error.status : "500"}
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        {isRouteError
          ? error.statusText ?? "Something went wrong"
          : "Something went wrong"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isRouteError
          ? error.data?.message ?? "An unexpected error occurred."
          : "An unexpected error occurred. Please try again later."}
      </p>

      <div className="mt-8 flex gap-4">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Link to={ROUTES.HOME}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
