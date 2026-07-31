const STORE_ID_KEY = "current_store_id";

export function getStoredStoreId(): number | null {
  const val = localStorage.getItem(STORE_ID_KEY);
  if (!val) return null;
  const id = Number(val);
  return Number.isNaN(id) ? null : id;
}

export function setStoredStoreId(id: number): void {
  localStorage.setItem(STORE_ID_KEY, String(id));
}

export function clearStoredStoreId(): void {
  localStorage.removeItem(STORE_ID_KEY);
}
