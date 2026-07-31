import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants";
import type React from "react";

export default function UnauthorizedPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <ShieldX className="h-16 w-16 text-destructive" />
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        Access denied
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You don't have the required permissions to view this page.
      </p>

      <Link to={ROUTES.DASHBOARD} className="mt-8">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Button>
      </Link>
    </div>
  );
}
