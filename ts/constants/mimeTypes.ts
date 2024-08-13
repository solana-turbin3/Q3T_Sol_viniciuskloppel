export const COMMON_MIME_TYPES = {
  ".json": "application/json",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".weba": "audio/webm",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mpeg": "video/mpeg",
  ".txt": "text/plain",
  ".webm": "video/webm",
} as const;

type FileExtension = keyof typeof COMMON_MIME_TYPES;

/**
 *
 * @param extension The file extension prefixed with a period (e.g. `.jpeg`, `.png`)
 * @returns
 */
export function getMimeTypeFromExtension(extension: string) {
  if (!Object.keys(COMMON_MIME_TYPES).includes(extension as FileExtension)) {
    throw new Error("Unknown file extension");
  }

  return COMMON_MIME_TYPES[extension as FileExtension];
}
