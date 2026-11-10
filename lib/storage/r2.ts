import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const isMockStorage = !process.env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID === 'mock-r2-key';

let s3ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!s3ClientInstance) {
    const accountId = process.env.R2_ACCOUNT_ID || 'mock-account';
    const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`;

    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || 'mock-key',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'mock-secret',
      },
    });
  }
  return s3ClientInstance;
}

export interface PresignedUrlResult {
  url: string;
  key: string;
  expiresInSeconds: number;
}

/**
 * Generate a time-limited signed URL to stream or download a protected object from Cloudflare R2
 */
export async function getProtectedReadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  if (isMockStorage) {
    // Return sample media or placeholder URL for seamless dev & testing
    if (key.endsWith('.mp4') || key.includes('video')) {
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    }
    return `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80`;
  }

  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'tejas-storage',
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Generate a time-limited signed URL for a student or trainer to upload a file directly to R2
 */
export async function getProtectedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 900
): Promise<PresignedUrlResult> {
  if (isMockStorage) {
    return {
      url: `/api/mock-upload?key=${encodeURIComponent(key)}`,
      key,
      expiresInSeconds,
    };
  }

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'tejas-storage',
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  return { url, key, expiresInSeconds };
}

/**
 * Validates file size and content type before generating upload tokens
 */
export function validateUploadParameters(fileSizeBytes: number, contentType: string, maxMb = 50): { valid: boolean; error?: string } {
  const maxBytes = maxMb * 1024 * 1024;
  if (fileSizeBytes > maxBytes) {
    return { valid: false, error: `File size exceeds the maximum permitted limit of ${maxMb}MB.` };
  }

  const allowedPrefixes = ['image/', 'video/', 'application/pdf', 'application/zip', 'text/'];
  const isAllowed = allowedPrefixes.some(prefix => contentType.startsWith(prefix));
  if (!isAllowed) {
    return { valid: false, error: `File type '${contentType}' is not permitted.` };
  }

  return { valid: true };
}
