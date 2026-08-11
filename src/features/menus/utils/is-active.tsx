export function isActive(url: string | undefined, pathname: string): boolean {
  console.log("Checking active:", url, "pathname:", pathname);
  if (!url) return false;
  if (url === "/") return pathname === "/";
  return pathname === url || pathname.startsWith(url + "/");
}