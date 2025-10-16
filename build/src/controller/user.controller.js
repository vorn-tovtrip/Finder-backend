"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const constant_1 = require("../constant");
const lib_1 = require("../lib");
const storage_1 = require("../lib/firebase/storage");
const schema_1 = require("../schema");
const service_1 = require("../service");
const badge_service_1 = require("../service/badge.service");
const types_1 = require("../types");
const utils_1 = require("../utils");
const helper_1 = require("../utils/helper");
class UserController {
    constructor() {
        this.getUsers = async (_, res) => {
            const data = await this.userService.findAll();
            return (0, utils_1.SuccessResponse)({
                res,
                data: data,
                statusCode: 200,
            });
        };
        this.getUserById = async (req, res) => {
            const { id } = req.params;
            const userId = parseInt(id);
            const existingUser = await this.userService.findUserById(userId);
            if (!existingUser) {
                return (0, utils_1.ErrorResponse)({
                    res,
                    data: null,
                    statusCode: 404,
                    error: "User is not found",
                });
            }
            return (0, utils_1.SuccessResponse)({
                res,
                data: existingUser,
                statusCode: 200,
            });
        };
        this.showAllbadgesUser = async (req, res) => {
            const { id } = req.params;
            const userId = parseInt(id);
            const existingUser = await this.userService.findUserById(userId);
            if (!existingUser) {
                return (0, utils_1.ErrorResponse)({
                    res,
                    data: null,
                    statusCode: 404,
                    error: "User not found",
                });
            }
            const allBadges = await this.badgeService.findAllBadges();
            const currBadges = await this.userService.findUserBadges(userId);
            const userBadgeIds = new Set(currBadges.map((b) => b.id));
            const mutateBadges = allBadges?.map((item) => {
                if (userBadgeIds.has(item.id)) {
                    return { ...item, owned: true };
                }
                return { ...item, owned: false };
            });
            console.log(mutateBadges);
            return (0, utils_1.SuccessResponse)({
                res,
                data: mutateBadges,
                statusCode: 200,
            });
        };
        this.getBadgeUsers = async (req, res) => {
            const { id } = req.params;
            const userId = parseInt(id);
            const existingUser = await this.userService.findUserById(userId);
            if (!existingUser) {
                return (0, utils_1.ErrorResponse)({
                    res,
                    data: null,
                    statusCode: 404,
                    error: "User not found",
                });
            }
            const data = await this.userService.findUserBadges(userId);
            return (0, utils_1.SuccessResponse)({
                res,
                data: data,
                statusCode: 200,
            });
        };
        this.loginUser = async (req, res) => {
            const parsed = schema_1.loginSchema.safeParse(req.body);
            if (parsed.success) {
                const data = parsed.data;
                const user = await this.userService.findUserWithPasswordExist(data.email);
                if (!user)
                    return (0, utils_1.ErrorResponse)({
                        data: null,
                        res: res,
                        statusCode: 400,
                        error: "User is not found",
                    });
                console.log("User is ", user);
                const isMatch = await utils_1.BcryptHelper.comparePassword(data.password, user.password);
                if (!isMatch)
                    return (0, utils_1.ErrorResponse)({
                        res,
                        error: "Incorrect password",
                        data: null,
                        statusCode: 401,
                    });
                // Generate token
                const token = await (0, utils_1.generateJwtAndStore)({
                    userId: user?.id?.toString() ?? "",
                    email: user?.email ?? "",
                });
                const { password, ...safeUser } = user;
                return (0, utils_1.SuccessResponse)({
                    res,
                    data: {
                        token,
                        ...safeUser,
                    },
                    statusCode: 200,
                });
            }
        };
        this.logoutUser = async (req, res) => {
            const redisClient = await (0, lib_1.getRedisClient)();
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(" ")[1];
            if (!token)
                return (0, utils_1.ErrorResponse)({
                    data: null,
                    res: res,
                    statusCode: 400,
                    error: "Token is required",
                });
            // Mark token as blacklisted
            await redisClient.set(`blacklist_token:${token}`, "blacklisted", {
                EX: constant_1.TOKEN_EXPIRATION,
            });
            return (0, utils_1.SuccessResponse)({
                res,
                data: "Logged out successfully",
                statusCode: 200,
            });
        };
        this.updateUser = async (req, res) => {
            const { id } = req.params;
            const userId = parseInt(id);
            const existingUser = await this.userService.findUserById(userId);
            if (!existingUser) {
                return (0, utils_1.ErrorResponse)({
                    res,
                    data: null,
                    statusCode: 404,
                    error: "User is not found",
                });
            }
            // Validate JSON body
            const parsed = schema_1.updateProfileSchema.safeParse(req.body);
            if (parsed.success) {
                const { username, email, phone, avatar, address } = parsed.data;
                let image;
                let finalAvatar = existingUser.profileImages?.[0]?.url ?? "";
                let imageId = undefined;
                imageId = existingUser.profileImages?.[0]?.id;
                image = existingUser.profileImages?.[0];
                console.log("image id is", imageId);
                if (typeof avatar === "string" && avatar != "") {
                    // Check if URL already exists in DB
                    if (imageId) {
                        //This case we need to delete old image first
                        const path = (0, helper_1.extractFilePathFromUrl)(image?.url);
                        finalAvatar = image?.url;
                        imageId = imageId;
                        console.log("Path is", path);
                        console.log("avatar is", finalAvatar);
                        await this.storageService.deleteFile(path);
                        await this.uploadService.deleteProfileImageById(imageId);
                        await this.uploadService.createProfileImage(avatar, userId);
                    }
                    else {
                        // Create the  new image
                        const newImage = await this.uploadService.createProfileImage(avatar, userId);
                        finalAvatar = newImage.url;
                        imageId = newImage.id;
                    }
                }
                // Update user
                const updatedUser = await this.userService.updateUser(userId, {
                    name: username,
                    email,
                    phone,
                    address,
                    avatar: finalAvatar,
                });
                return (0, utils_1.SuccessResponse)({
                    res,
                    data: updatedUser,
                    statusCode: 200,
                });
            }
            return (0, utils_1.SuccessResponse)({
                res,
                data: null,
                statusCode: 200,
            });
        };
        this.socialAuth = async (req, res) => {
            const redisClient = await (0, lib_1.getRedisClient)();
            const parsed = schema_1.socialAuthSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    code: 400,
                    message: "Invalid payload",
                    errors: parsed.error.format(),
                });
            }
            const data = parsed.data;
            let email = data.email;
            if (!data.email) {
                email = (0, helper_1.generateUniqueEmail)();
            }
            let user = await this.userService.findUserExist(email);
            if (!user) {
                user = await this.userService.registerUserEmail({
                    email: email,
                    username: data.username || email.split("@")[0],
                    avatar: data.avatar || "",
                    password: "social-auth",
                    method: data.method,
                });
            }
            // Generate JWT
            const token = (0, utils_1.signJwt)({ userId: user.id, email: user.email });
            await redisClient.set(`access_token:${user.id}:${token}`, "active", {
                EX: constant_1.TOKEN_EXPIRATION,
            });
            return (0, utils_1.SuccessResponse)({
                res,
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.name,
                        avatar: data?.avatar ?? "",
                    },
                },
                statusCode: 200,
            });
        };
        this.deleteUser = async (req, res) => {
            const { id } = req.params;
            const validId = parseInt(id);
            const user = await this.userService.findUserById(validId);
            if (!user) {
                throw new Error("User doesnt exist");
            }
            await this.userService.deleteById(validId);
            const redisClient = await (0, lib_1.getRedisClient)();
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(" ")[1];
            if (!token)
                return (0, utils_1.ErrorResponse)({
                    data: null,
                    res: res,
                    statusCode: 400,
                    error: "Token is required",
                });
            // Mark token as blacklisted
            await redisClient.set(`blacklist_token:${token}`, "blacklisted", {
                EX: constant_1.TOKEN_EXPIRATION,
            });
            return (0, utils_1.SuccessResponse)({
                res,
                data: user,
                statusCode: 200,
            });
        };
        this.registerUser = async (req, res) => {
            let user = null;
            const parsed = schema_1.authenticationSchema.safeParse(req.body);
            const data = parsed.data;
            if (parsed.success && data) {
                const isExist = await this.userService.findUserExist(data.email);
                if (isExist) {
                    throw new Error("User with the same email has already exist");
                }
                if (data?.method == types_1.LoginMethod.email) {
                    const hashedPassword = await utils_1.BcryptHelper.hashPassword(data.password, 10);
                    user = await this.userService.registerUserEmail({
                        email: data.email,
                        password: hashedPassword,
                        username: data.username,
                        method: data.method,
                    });
                }
                // Sign Jwt logic
                const token = await (0, utils_1.generateJwtAndStore)({
                    userId: user?.id?.toString() ?? "",
                    email: user?.email ?? "",
                });
                return (0, utils_1.SuccessResponse)({
                    res,
                    data: {
                        token,
                        user: {
                            id: user.id,
                            email: user.email,
                            username: user.name,
                        },
                    },
                    statusCode: 200,
                });
            }
        };
        this.updateFcmToken = async (req, res) => {
            const userId = req.user?.userId;
            const { fcmToken } = req.body;
            if (!fcmToken) {
                return (0, utils_1.ErrorResponse)({
                    res,
                    data: null,
                    statusCode: 400,
                    error: "Missing FCM token",
                });
            }
            // Check if token already exists for user
            await this.userService.findAndUpdateFcmToken({
                fcmToken,
                userId: parseInt(userId),
                platform: "android",
            });
            return (0, utils_1.SuccessResponse)({
                res,
                data: { message: "Token updated successfully" },
                statusCode: 200,
            });
        };
        this.getReportLostLatest = async (req, res) => {
            const { userId } = req.params;
            const id = parseInt(userId);
            const existingUser = await this.userService.findUserById(id);
            if (!existingUser) {
                return (0, utils_1.ErrorResponse)({
                    res,
                    data: null,
                    statusCode: 404,
                    error: "User is not found",
                });
            }
            const data = await this.reportService.findLatestReportByUser({
                userId: id,
                type: client_1.ReportType.FOUND,
            });
            return (0, utils_1.SuccessResponse)({
                res,
                data: data,
                statusCode: 200,
            });
        };
        this.getReportHistoryUser = async (req, res) => {
            const { id } = req.params;
            const filters = req.filters;
            const reportStatus = filters?.status;
            const mutateUserId = parseInt(id);
            const existingUser = await this.userService.findUserById(mutateUserId);
            if (!existingUser) {
                return (0, utils_1.ErrorResponse)({
                    res,
                    data: null,
                    statusCode: 404,
                    error: "User is not found",
                });
            }
            const data = await this.reportService.findReportHistoryByUser({
                userId: mutateUserId,
                status: reportStatus,
            });
            return (0, utils_1.SuccessResponse)({
                res,
                data,
                statusCode: 200,
            });
        };
        this.storageService = new storage_1.StorageService();
        this.userService = new service_1.UserService(lib_1.PrismaClient, this.storageService);
        this.badgeService = new badge_service_1.BadgeService(lib_1.PrismaClient);
        this.uploadService = new service_1.UploadService(lib_1.PrismaClient);
        this.reportService = new service_1.ReportService(lib_1.PrismaClient);
    }
}
exports.UserController = UserController;
