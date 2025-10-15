"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const uuid_1 = require("uuid");
const firebase_1 = require("../../config/firebase");
const helper_1 = require("../../utils/helper");
class StorageService {
    async uploadFileStream(file, folder = "images", originalName) {
        const fileName = `${folder}/${(0, uuid_1.v4)()}-${originalName}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileRef = firebase_1.bucket.file(fileName);
        // Create a stream for uploading
        await new Promise((resolve, reject) => {
            const writeStream = fileRef.createWriteStream({
                metadata: { contentType: (0, helper_1.getContentType)(file.name) },
                resumable: false,
                public: true,
            });
            writeStream.on("finish", () => resolve());
            writeStream.on("error", (err) => reject(err));
            writeStream.end(buffer);
        });
        return `https://storage.googleapis.com/${firebase_1.bucket.name}/${fileName}`;
    }
    async deleteFile(filePath) {
        try {
            console.log("File path to delete is", filePath);
            const fileRef = firebase_1.bucket.file(filePath);
            await fileRef.delete();
        }
        catch (error) {
            console.error("Error deleting file:", error);
            throw new Error("Failed to delete file from Firebase Storage");
        }
    }
}
exports.StorageService = StorageService;
