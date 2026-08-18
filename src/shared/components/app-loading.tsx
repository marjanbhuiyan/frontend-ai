import {
  Loader2,
} from "lucide-react";

export function AppLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading application...
      </div>
    </div>
  );
}