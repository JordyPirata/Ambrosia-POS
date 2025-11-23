export function storedAssetUrl(url) {
  if (!url) return null;
  if (url.startsWith("/uploads")) return url;
  if (url.startsWith("/api/uploads")) return url.replace("/api", "");
  try {
    const parsed = new URL(url);
    const idx = parsed.pathname.indexOf("/uploads");
    if (idx !== -1) return parsed.pathname.slice(idx);
  } catch (_) { }
  return url;
}
