export function apiBaseUrl(url = "") {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const cleanBase = BASE_URL.replace(/\/$/, "");
  const cleanUrl = url.replace(/^\//, "");
  return url ? `${cleanBase}/${cleanUrl}` : cleanBase;
}
