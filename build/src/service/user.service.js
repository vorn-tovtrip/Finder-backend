"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const helper_1 = require("../utils/helper");
const utils_1 = require("../utils");
class UserService {
    constructor(prismaClient, storageService, uploadService) {
        this.storageService = storageService;
        this.uploadService = uploadService;
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
                profileImages: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
            omit: {
                password: true,
            },
            orderBy: {
                createdAt: "desc",
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
    async findUserWithPasswordExist(email) {
        const user = await this.prismaClient.user.findFirst({
            where: {
                email: email,
            },
            include: {
                profileImages: {
                    select: { url: true },
                },
            },
        });
        return user;
    }
    async findUserExist(email) {
        const user = await this.prismaClient.user.findFirst({
            where: {
                email: email,
            },
            include: {
                profileImages: {
                    select: { url: true },
                },
            },
            omit: {
                password: true,
            },
        });
        return user;
    }
    async findNameById(id) {
        const user = await this.prismaClient.user.findFirst({
            where: { id },
            select: {
                name: true,
            },
        });
        return user?.name ?? null;
    }
    async findUserById(id) {
        const user = await this.prismaClient.user.findFirst({
            where: {
                id: id,
            },
            include: {
                profileImages: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
            omit: { password: true },
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
        const dataToUpdate = Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== null && value !== undefined && value !== ""));
        // Hash password if present
        if (dataToUpdate.password) {
            dataToUpdate.password = await utils_1.BcryptHelper.hashPassword(dataToUpdate.password, 10);
        }
        // Handle avatar upload if provided
        if (payload.avatar) {
            // Check if user already has a profile image
            const existingImages = await this.prismaClient.userProfileImage.findMany({
                where: { userId: id },
            });
            if (existingImages.length > 0) {
                // Update the first image record (or handle multiple if you allow more)
                await this.uploadService.updateProfileImageById(existingImages[0]?.id, payload.avatar);
            }
            else {
                // Create new profile image
                await this.uploadService.createProfileImage(payload.avatar, id);
            }
        }
        // Prevent avatar field from updating the user table directly
        delete dataToUpdate.avatar;
        // Perform user data update
        const updatedUser = await this.prismaClient.user.update({
            where: { id },
            include: {
                profileImages: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
            data: dataToUpdate,
        });
        // Remove password before returning
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async registerUserEmail(params) {
        const user = await this.prismaClient.user.upsert({
            where: { email: params.email },
            update: {
                name: params.username,
                platform: params.method,
            },
            create: {
                name: params.username,
                email: params.email,
                password: params.password,
                platform: params.method,
            },
            include: {
                profileImages: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
        });
        // Handle avatar upsert (create or update existing)
        if (params.avatar) {
            const existingAvatar = await this.prismaClient.userProfileImage.findFirst({
                where: { userId: user.id },
            });
            if (existingAvatar) {
                const path = (0, helper_1.extractFilePathFromUrl)(existingAvatar?.url);
                await this.storageService.deleteFile(path);
                await this.prismaClient.userProfileImage.update({
                    where: { id: existingAvatar.id },
                    data: { url: params.avatar },
                });
            }
            else {
                await this.prismaClient.userProfileImage.create({
                    data: {
                        url: params.avatar,
                        user: { connect: { id: user.id } },
                    },
                });
            }
        }
        // Return safe user object (omit password manually)
        const { password, ...safeUser } = user;
        return safeUser;
    }
}
exports.UserService = UserService;
