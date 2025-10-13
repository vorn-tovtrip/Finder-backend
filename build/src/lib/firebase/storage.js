"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const uuid_1 = require("uuid");
const firebase_1 = require("../../config/firebase");
const helper_1 = require("../../utils/helper");
class StorageService {
    constructor() {
        this.createFileUpload = async (file, originalName) => {
            const fileName = `images/${(0, uuid_1.v4)()}-${originalName}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileRef = firebase_1.bucket.file(fileName);
            await fileRef.save(buffer, {
                contentType: (0, helper_1.getContentType)(fileName),
                public: true,
            });
            const url = `https://storage.googleapis.com/${firebase_1.bucket.name}/${fileName}`;
            return url;
        };
        this.deleteFile = async (filePath) => {
            const fileRef = firebase_1.bucket.file(filePath);
            return await fileRef.delete();
        };
        //This stream upload is quicker
        this.uploadFileStream = async (file, folder = "images", originalName) => {
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
        };
    }
}
exports.StorageService = StorageService;
