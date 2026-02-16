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
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
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
