import type { User } from "@/features/auth/types";

/**
 * Some endpoints (e.g. `/app/init`) only return a partial user object
 * (just `id` and `name`). Normalize it here so the rest of the app can
 * safely rely on `User`'s required fields (`email`, `roles`, `permissions`)
 * always being present, defaulting to sensible empty values when missing.
 */
export function normalizeUser(
  partial: Partial<User> & { id: User["id"]; name: User["name"] },
  permissions: string[] = [],
): User {
  return {
    id: partial.id,
    name: partial.name,
    email: partial.email ?? "",
    roles: partial.roles ?? [],
    permissions: partial.permissions ?? permissions,
    avatar: partial.avatar,
    tenant: partial.tenant,
    settings: partial.settings,
  };
}
