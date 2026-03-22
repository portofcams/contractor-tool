import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET || "contractorcalc";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://files.probuildcalc.com

// Fall back to local storage if R2 is not configured
const useR2 = !!(R2_ACCOUNT_ID && R2_ACCESS_KEY && R2_SECRET_KEY);

let s3: S3Client | null = null;
if (useR2) {
  s3 = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY!,
      secretAccessKey: R2_SECRET_KEY!,
    },
  });
}

interface UploadResult {
  url: string;
  key: string;
}

/**
 * Upload a file buffer to R2 (or local fallback).
 * @param buffer - File contents
 * @param folder - Subfolder (e.g., "photos", "logos", "voice", "pdfs", "floorplans")
 * @param ext - File extension (e.g., "jpg", "png", "pdf")
 * @param contentType - MIME type
 */
export async function uploadFile(
  buffer: Buffer,
  folder: string,
  ext: string,
  contentType: string
): Promise<UploadResult> {
  const filename = `${randomUUID()}.${ext}`;
  const key = `${folder}/${filename}`;

  if (useR2 && s3) {
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const url = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${key}`
      : await getSignedUrl(s3, new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }), { expiresIn: 86400 });

    return { url, key };
  }

  // Local fallback: write to public/uploads/
  const { writeFile, mkdir } = await import("fs/promises");
  const path = await import("path");
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return { url: `/uploads/${folder}/${filename}`, key };
}

/**
 * Delete a file from R2 (or local).
 */
export async function deleteFile(keyOrUrl: string): Promise<void> {
  if (useR2 && s3) {
    // Extract key from full URL if needed
    const key = keyOrUrl.startsWith("http")
      ? keyOrUrl.replace(new RegExp(`^${R2_PUBLIC_URL}/`), "")
      : keyOrUrl.replace(/^\/uploads\//, "");

    await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return;
  }

  // Local fallback
  const { unlink } = await import("fs/promises");
  const path = await import("path");
  const localPath = keyOrUrl.startsWith("/uploads/")
    ? path.join(process.cwd(), "public", keyOrUrl)
    : path.join(process.cwd(), "public", "uploads", keyOrUrl);

  try {
    await unlink(localPath);
  } catch {
    // File may not exist
  }
}

/**
 * Read a file from R2 or local filesystem. Returns Buffer.
 */
export async function readFile(keyOrUrl: string): Promise<Buffer> {
  if (useR2 && s3) {
    const key = keyOrUrl.startsWith("http")
      ? keyOrUrl.replace(new RegExp(`^${R2_PUBLIC_URL}/`), "")
      : keyOrUrl.replace(/^\/uploads\//, "");

    const res = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    const bytes = await res.Body?.transformToByteArray();
    if (!bytes) throw new Error("Empty file");
    return Buffer.from(bytes);
  }

  const { readFile: fsRead } = await import("fs/promises");
  const path = await import("path");
  const localPath = keyOrUrl.startsWith("/")
    ? path.join(process.cwd(), "public", keyOrUrl)
    : path.join(process.cwd(), "public", "uploads", keyOrUrl);

  return fsRead(localPath);
}

export { useR2 };
