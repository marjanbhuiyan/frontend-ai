import { Fragment, type ReactNode } from "react";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

/* One crumb in the breadcrumb trail (excluding the auto-prepended "Home"). */
interface PageBreadcrumbItem {
  label: string;
  href?: string;
}

/* Reusable page header used across the list pages (Users, Stores, ...).
   Encapsulates the repeated pattern of:
     breadcrumb (Home → … → last page) + <h1> title on the left,
     and an optional action button (e.g. "Add Store") on the right.

   Props:
   - title       → the <h1> heading text.
   - breadcrumb  → trail after "Home". The last entry renders as the current
                   BreadcrumbPage; earlier ones render as BreadcrumbLink (use
                   `href` when they should navigate somewhere).
   - actionLabel → optional action button label (button hidden when omitted).
   - actionIcon  → optional icon for the action button (defaults to Plus).
   - onAction    → optional click handler for the action button. */
export function PageHeader({
  title,
  breadcrumb = [],
  actionLabel,
  actionIcon,
  onAction,
}: {
  title: string;
  breadcrumb?: PageBreadcrumbItem[];
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">{title}</h1>

        {/* Breadcrumb sits at the very top, above the page title.
            NOTE: BreadcrumbSeparator renders a <li>, so each separator must be
            a SIBLING of BreadcrumbItem (both direct children of the <ol>),
            never nested inside one — otherwise React throws a hydration error
            ("<li> cannot be a descendant of <li>"). We map with a Fragment so
            each separator + item are emitted as separate <li> siblings. */}
        <Breadcrumb className="mb-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.HOME}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : item.href ? (
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbLink>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {actionLabel && (
        <Button
          onClick={onAction}
          className="h-9 gap-1.5 self-start bg-indigo-600 text-white hover:bg-indigo-700 sm:self-auto rounded-xs cursor-pointer"
        >
          {actionIcon ?? <Plus className="h-4 w-4" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default PageHeader;
