import { useState, useCallback } from "react";

export function useUpload() {
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(async (files) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      return data.uploads; // [{ path, url }]
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, isUploading, error };
}
