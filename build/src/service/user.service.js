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
                    where: {
                        reportId: null,
                    },
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
    findByNotification(userId) {
        return this.prismaClient.notification.findMany({
            where: {
                userId: userId,
            },
        });
    }
    async findUserBadges(userId) {
        const userBadges = await this.prismaClient.userBadge.findMany({
            where: { userId },
            include: {
                badge: {
                    select: {
                        id: true,
                        name: true,
                        iconUrl: true,
                        requiredScore: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return userBadges.map((ub) => ub.badge);
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
            include: {
                images: {
                    where: {
                        reportId: null,
                    },
                    select: {
                        url: true,
                        id: true,
                    },
                },
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
        // Filter out null, undefined, or empty string fields
        const dataToUpdate = Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== null && value !== undefined && value !== ""));
        return await this.prismaClient.user.update({
            where: { id },
            omit: { password: true },
            data: dataToUpdate,
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
