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
    async findByUrl(url) {
        const img = await this.prismaClient.image.findFirst({
            where: {
                url: url,
            },
        });
        return img?.url;
    }
    async updateById(id, newUrl) {
        return await this.prismaClient.image.update({
            where: {
                id: id,
            },
            data: {
                url: newUrl,
            },
        });
    }
}
exports.UploadService = UploadService;
