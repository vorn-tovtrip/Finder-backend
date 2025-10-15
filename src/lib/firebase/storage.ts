import { v4 as uuidv4 } from "uuid";
import { bucket } from "../../config/firebase";
import { getContentType } from "../../utils/helper";

export class StorageService {
  async uploadFileStream(file: File, folder = "images", originalName: string) {
    const fileName = `${folder}/${uuidv4()}-${originalName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileRef = bucket!.file(fileName);
    // Create a stream for uploading
    await new Promise<void>((resolve, reject) => {
      const writeStream = fileRef.createWriteStream({
        metadata: { contentType: getContentType(file.name) },
        resumable: false,
        public: true,
      });
      writeStream.on("finish", () => resolve());
      writeStream.on("error", (err) => reject(err));
      writeStream.end(buffer);
    });
    return `https://storage.googleapis.com/${bucket!.name}/${fileName}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      console.log("File path to delete is", filePath);
      const fileRef = bucket!.file(filePath);
      await fileRef.delete();
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file from Firebase Storage");
    }
  }
}
