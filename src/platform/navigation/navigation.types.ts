import type { NavigationItem } from "@/types/app.types";

export interface ResolvedNavigationItem
  extends NavigationItem {
  children?: ResolvedNavigationItem[];
}