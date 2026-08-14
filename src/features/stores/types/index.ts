import type { StoreInfo } from "@/features/auth/types";

/* Store list page reuses the `StoreInfo` shape from the auth session.
   Re-export it here so the feature is self-contained and columns/table
   config can import from `@/features/stores/types` instead of reaching
   across feature boundaries into auth types directly. */
export type { StoreInfo };

/* The store list table works with the same StoreInfo shape.
   We define a local alias so column defs read cleanly. */
export type StoreRow = StoreInfo;
