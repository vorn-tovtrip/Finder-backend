import Busboy from "busboy";
import { NextFunction, Request, Response } from "express";
import { StorageService } from "../lib/firebase/storage";
import { SuccessResponse } from "../utils";
import { extractFilePathFromUrl } from "../utils/helper";

export class StorageController {
  private readonly storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  uploadFile = (req: Request, res: Response, next: NextFunction): void => {
    const busboy = Busboy({ headers: req.headers });
    let fileBuffer: Buffer | null = null;
    let fileName = "";

    busboy.on("file", (_fieldname, file, info) => {
      const { filename } = info;
      fileName = filename;

      const chunks: Buffer[] = [];
      file.on("data", (data: Buffer) => chunks.push(data));
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
        const fakeFile: File = {
          arrayBuffer: async () => fileBuffer!.buffer.slice(0),
          name: fileName,
        } as unknown as File;

        // Use the stream upload method
        const fileUrl = await this.storageService.uploadFileStream(
          fakeFile,
          "data",
          fileName
        );

        return SuccessResponse({
          statusCode: 201,
          data: fileUrl,
          res,
        });
      } catch (error) {
        next(error);
      }
    });

    req.pipe(busboy);
  };

  deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { url } = req.body as { url?: string };
      if (!url) {
        return res.status(400).json({ message: "Missing file path" });
      }

      const filePath = extractFilePathFromUrl(url);
      console.log("Path is", filePath);
      await this.storageService.deleteFile(filePath);
      return SuccessResponse({
        statusCode: 201,
        data: "File has been deleted successfully",
        res: res,
      });
    } catch (error) {
      next(error);
    }
  };
}
