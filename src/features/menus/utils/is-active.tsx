export function isActive(url: string | undefined, pathname: string): boolean {
  console.log("Checking active:", url, "pathname:", pathname);
  if (!url) return false;
  if (url === "/") return pathname === "/";
  // Exact match only. A prefix match makes a parent path like `/dashboard`
  // (Overview) stay highlighted on every child route (`/dashboard/users`),
  // which is wrong — only the exact page should be active. Parent menus
  // (collapses) are highlighted separately by `anyChildActive` which checks
  // each child's own path.
  return pathname === url;
}