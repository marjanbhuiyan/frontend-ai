import { Link, useLocation} from "react-router-dom";
import { useAppBootstrap } from "@/app/bootstrap/use-app-bootstrap";
import { resolveNavigation} from "@/platform/navigation/navigation-resolver";
import { cn} from "@/lib/utils";

export function AppSidebar() {
  const location =
    useLocation();

  const { data } =
    useAppBootstrap();

  if (!data) {
    return null;
  }

  const navigation = resolveNavigation( data.navigation, data.permissions, data.features );

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-6 font-semibold">
        Admin
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigation.map(
          (item) => {
            const active =
              location.pathname ===
                item.path ||
              location.pathname.startsWith(
                `${item.path}/`,
              );

            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                {item.title}
              </Link>
            );
          },
        )}
      </nav>
    </aside>
  );
}