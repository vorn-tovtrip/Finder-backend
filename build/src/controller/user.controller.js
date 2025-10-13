"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const constant_1 = require("../constant");
const lib_1 = require("../lib");
const storage_1 = require("../lib/firebase/storage");
const schema_1 = require("../schema");
const service_1 = require("../service");
const types_1 = require("../types");
const utils_1 = require("../utils");
class UserController {
    constructor() {
        this.getUsers = async (req, res) => {
            const data = await this.userService.findAll();
            return res.status(200).json({
                code: 200,
                message: "success",
                data: data,
            });
        };
        this.loginUser = async (req, res) => {
            const parsed = schema_1.loginSchema.safeParse(req.body);
            if (parsed.success) {
                const data = parsed.data;
                const user = await this.userService.findUserExist(data.email);
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
                return (0, utils_1.SuccessResponse)({
                    res,
                    data: {
                        token,
                        user: { id: user.id, email: user.email, username: user.name },
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
        this.patchUser = async (req, res, next) => {
            const { id } = req.params;
            try {
                const validId = parseInt(id);
                const user = await this.userService.findUserById(validId);
                if (!user)
                    return (0, utils_1.ErrorResponse)({
                        data: null,
                        res: res,
                        statusCode: 400,
                        error: "User is not found",
                    });
                const rawUser = req.body.user;
                if (!rawUser)
                    return (0, utils_1.ErrorResponse)({
                        data: null,
                        res: res,
                        statusCode: 400,
                        error: "Missing user field in form data",
                    });
                const parsed = schema_1.updateUserSchema.safeParse(JSON.parse(rawUser));
                if (parsed.data && parsed.success) {
                    const { username, email, phone } = parsed.data;
                    // Upload image if provided
                    let avatar = user?.images?.at(0)?.url;
                    const imageId = user?.images?.at(0)?.id;
                    const file = req.file;
                    if (file) {
                        avatar = await this.storageService.createFileUpload(file, file.name);
                        //Delete old  from database image and firebase
                        if (imageId) {
                            await this.uploadService.deleteById(imageId);
                            await this.storageService.deleteFile(avatar);
                        }
                    }
                    const updatedUser = await this.userService.updateUser(validId, {
                        name: username,
                        email,
                        phone,
                        avatar,
                    });
                    return (0, utils_1.SuccessResponse)({
                        res,
                        data: updatedUser,
                        statusCode: 200,
                    });
                }
            }
            catch (error) {
                console.error("Error updating user:", error);
                return next(error);
            }
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
            let user = await this.userService.findUserExist(data.email);
            const isNewUser = !user;
            if (!user) {
                user = await this.userService.registerUserEmail({
                    email: data.email,
                    username: data.username || data.email.split("@")[0],
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
                        isNewUser,
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
        this.userService = new service_1.UserService(lib_1.PrismaClient);
        this.storageService = new storage_1.StorageService();
        this.uploadService = new service_1.UploadService(lib_1.PrismaClient);
    }
}
exports.UserController = UserController;
