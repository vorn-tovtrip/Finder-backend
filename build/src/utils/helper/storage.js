"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentType = getContentType;
exports.extractFilePathFromUrl = extractFilePathFromUrl;
function getContentType(filename) {
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
function extractFilePathFromUrl(url) {
    // https://storage.googleapis.com/finder-896b2.firebasestorage.app/images/a414ac95-cfc3-41dd-898d-80914a8e1221-avatar-3d.webp
    const match = url.match(/firebasestorage\.app\/(.*)$/);
    return match ? match[1] : "";
}
