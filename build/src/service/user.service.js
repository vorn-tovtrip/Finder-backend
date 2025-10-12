"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    async findAndUpdateFcmToken({ fcmToken, userId, platform, }) {
        await this.prismaClient.deviceToken.upsert({
            where: { token: fcmToken },
            update: {
                userId,
                platform,
            },
            create: {
                token: fcmToken,
                user: { connect: { id: userId } },
                platform,
            },
        });
    }
    findAll() {
        return this.prismaClient.user.findMany({
            include: {
                images: {
                    select: {
                        url: true,
                    },
                },
            },
            omit: {
                password: true,
            },
        });
    }
    async findUserExist(email) {
        const user = await this.prismaClient.user.findFirst({
            where: {
                email: email,
            },
        });
        return user;
    }
    async findUserById(id) {
        const user = await this.prismaClient.user.findFirst({
            where: {
                id: id,
            },
        });
        return user;
    }
    async deleteById(id) {
        return await this.prismaClient.user.delete({
            where: {
                id: id,
            },
        });
    }
    async updateUser(id, payload) {
        return await this.prismaClient.user.update({
            where: {
                id: id,
            },
            data: {
                ...payload,
            },
        });
    }
    async registerUserEmail(params) {
        const user = await this.prismaClient.user.create({
            data: {
                name: params.username,
                email: params.email,
                password: params.password,
                platform: params?.method,
            },
        });
        if (params.avatar) {
            await this.prismaClient.image.create({
                data: {
                    url: params.avatar,
                    user: {
                        connect: { id: user.id },
                    },
                },
            });
        }
        return { ...user };
    }
    registerSocialAuth(params) {
        const user = this.prismaClient.user.findMany({});
    }
}
exports.UserService = UserService;
