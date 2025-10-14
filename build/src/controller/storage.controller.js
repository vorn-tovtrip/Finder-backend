"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageController = void 0;
const busboy_1 = __importDefault(require("busboy"));
const storage_1 = require("../lib/firebase/storage");
const utils_1 = require("../utils");
const helper_1 = require("../utils/helper");
class StorageController {
    constructor() {
        this.uploadFile = (req, res, next) => {
            const busboy = (0, busboy_1.default)({ headers: req.headers });
            let fileBuffer = null;
            let fileName = "";
            busboy.on("file", (_fieldname, file, info) => {
                const { filename } = info;
                fileName = filename;
                const chunks = [];
                file.on("data", (data) => chunks.push(data));
                file.on("end", () => {
                    fileBuffer = Buffer.concat(chunks);
                });
            });
            busboy.on("finish", async () => {
                try {
                    if (!fileBuffer) {
                        return res.status(400).json({ error: "No file uploaded" });
                    }
                    // Create a pseudo File object to match your StorageService signature
                    const fakeFile = {
                        arrayBuffer: async () => fileBuffer.buffer.slice(0),
                        name: fileName,
                    };
                    // Use the stream upload method
                    const fileUrl = await this.storageService.uploadFileStream(fakeFile, "images", fileName);
                    return (0, utils_1.SuccessResponse)({
                        statusCode: 201,
                        data: fileUrl,
                        res,
                    });
                }
                catch (error) {
                    next(error);
                }
            });
            req.pipe(busboy);
        };
        this.deleteFile = async (req, res, next) => {
            try {
                const { url } = req.body;
                if (!url) {
                    return res.status(400).json({ message: "Missing file path" });
                }
                const filePath = (0, helper_1.extractFilePathFromUrl)(url);
                console.log("Path is", filePath);
                await this.storageService.deleteFile(filePath);
                return (0, utils_1.SuccessResponse)({
                    statusCode: 201,
                    data: "File has been deleted successfully",
                    res: res,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.storageService = new storage_1.StorageService();
    }
}
exports.StorageController = StorageController;
