// Utility to get the absolute API URL for production/local
export function getApiUrl(path) {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  // Handles missing/extra slashes
  if (!path.startsWith("/")) path = "/" + path;
  return base.replace(/\/$/, "") + path;
}
