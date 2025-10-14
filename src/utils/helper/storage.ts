export function getContentType(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

export function extractFilePathFromUrl(url: string): string {
  const match = url.match(/\/images\/.+$/);
  if (!match) throw new Error("Invalid file URL");
  return match[0].substring(1); // remove leading slash
}
