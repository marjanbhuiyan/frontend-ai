import type { NavigationItem, FeatureFlags } from "@/types/app.types";

export function resolveNavigation(
  items: NavigationItem[],
  permissions: string[],
  features: FeatureFlags,
): NavigationItem[] {
  return items
    .filter((item) => {
      if (
        item.feature &&
        !features[item.feature]
      ) {
        return false;
      }

      if (
        item.permission &&
        !permissions.includes(
          item.permission,
        )
      ) {
        return false;
      }

      return true;
    })
    .map((item) => {
      if (!item.children) {
        return item;
      }

      return {
        ...item,

        children:
          resolveNavigation(
            item.children,
            permissions,
            features,
          ),
      };
    })
    .filter((item) => {
      if (
        item.children &&
        item.children.length === 0
      ) {
        return false;
      }

      return true;
    });
}