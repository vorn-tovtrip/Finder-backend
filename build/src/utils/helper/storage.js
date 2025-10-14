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
    const match = url.match(/\/images\/.+$/);
    if (!match)
        throw new Error("Invalid file URL");
    return match[0].substring(1); // remove leading slash
}
