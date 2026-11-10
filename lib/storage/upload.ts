/**
 * Client-side helper to upload files directly to Cloudflare R2 via presigned URLs.
 * Ensures credentials remain secure on server while client streams data straight to R2.
 */

export interface UploadProgressCallback {
  (percentage: number): void;
}

export async function uploadFileToR2(
  file: File,
  prefix: 'assignments' | 'projects' | 'avatars' | 'resumes' | 'media' = 'assignments',
  onProgress?: UploadProgressCallback
): Promise<{ key: string; publicUrl?: string }> {
  // 1. Generate clean sanitized key
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const key = `${prefix}/${timestamp}-${randomSuffix}-${sanitizedName}`;

  // 2. Request presigned upload URL from our API
  const presignRes = await fetch('/api/storage/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'upload',
      key,
      contentType: file.type || 'application/octet-stream',
      fileSizeBytes: file.size,
    }),
  });

  if (!presignRes.ok) {
    const errorData = await presignRes.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to acquire upload credentials');
  }

  const { url } = await presignRes.json();

  // 3. Upload binary to R2 via PUT (or mock-upload endpoint if local demo)
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        reject(new Error(`Upload failed with HTTP status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error occurred during file upload'));
    xhr.send(file);
  });

  return { key };
}

export async function getFileDownloadUrl(key: string): Promise<string> {
  const res = await fetch('/api/storage/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'read',
      key,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate secure streaming URL');
  }

  const data = await res.json();
  return data.url;
}
