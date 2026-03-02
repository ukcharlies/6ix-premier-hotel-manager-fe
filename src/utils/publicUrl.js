function stripTrailingSlash(value) {
  return value?.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizeLegacyApiUploadUrl(value) {
  if (!value || typeof value !== "string") return value;
  return value.replace("/api/uploads/", "/uploads/");
}

function stripApiSuffix(value) {
  if (!value) return value;
  const trimmed = stripTrailingSlash(value);
  return trimmed.endsWith("/api") ? trimmed.slice(0, -4) : trimmed;
}

export function getApiOrigin() {
  const fromApiBase = stripApiSuffix(import.meta.env.VITE_API_BASE_URL);
  const fromApiUrl = stripApiSuffix(import.meta.env.VITE_API_URL);
  return fromApiBase || fromApiUrl || "http://localhost:5000";
}

export function buildPublicUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (typeof pathOrUrl !== "string") return "";
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return normalizeLegacyApiUploadUrl(pathOrUrl);
  }
  const origin = stripTrailingSlash(getApiOrigin());
  const normalizedPath = normalizeLegacyApiUploadUrl(pathOrUrl);
  const path = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
  return `${origin}${path}`;
}

export function buildUploadImageUrl(upload) {
  if (!upload) return "";
  if (typeof upload === "string") return buildPublicUrl(upload);

  const path = upload.path || upload.url || "";
  if (path) return buildPublicUrl(path);

  if (upload.filename) {
    const type = upload.type || "general";
    return buildPublicUrl(`/uploads/${type}/${upload.filename}`);
  }

  return "";
}

/**
 * Get the base path for the application (e.g., /6ix-premier-hotel-manager-fe/)
 * This is used for static assets in GitHub Pages deployments
 */
export function getBasePath() {
  return import.meta.env.BASE_URL || '/';
}

/**
 * Build a URL for static assets (images in /public folder)
 * Handles GitHub Pages base path automatically
 * @param {string} path - Path to the asset (e.g., '/king.jpg')
 * @returns {string} Full path with base URL
 */
export function getStaticAssetUrl(path) {
  if (!path) return '';
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}${cleanPath}`;
}

/**
 * Get the default fallback room image URL
 * Used for error handling when room images fail to load
 */
export const FALLBACK_ROOM_IMAGE = getStaticAssetUrl('/room.jpg');
