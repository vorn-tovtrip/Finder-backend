"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
class UploadService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    async deleteById(id) {
        return await this.prismaClient.image.delete({
            where: {
                id: id,
            },
        });
    }
}
exports.UploadService = UploadService;
