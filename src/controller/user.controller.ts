import { ReportStatus, ReportType, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { TOKEN_EXPIRATION } from "../constant";
import { LoginUserDTO, RegisterUserDTO } from "../dto";
import { getRedisClient, PrismaClient } from "../lib";
import { StorageService } from "../lib/firebase/storage";
import { generateUniqueEmail } from "../utils/helper";
import {
  authenticationSchema,
  loginSchema,
  socialAuthSchema,
  updateProfileSchema,
  updateUserSchema,
} from "../schema";
import { ReportService, UploadService, UserService } from "../service";
import { ApiResponse, LoginMethod, RegisterPayload } from "../types";
import {
  BcryptHelper,
  ErrorResponse,
  generateJwtAndStore,
  signJwt,
  SuccessResponse,
} from "../utils";
import { BadgeService } from "../service/badge.service";

export class UserController {
  private userService: UserService;
  private storageService: StorageService;
  private uploadService: UploadService;
  private reportService: ReportService;
  private badgeService: BadgeService;

  constructor() {
    this.userService = new UserService(PrismaClient);
    this.storageService = new StorageService();
    this.badgeService = new BadgeService(PrismaClient);
    this.uploadService = new UploadService(PrismaClient);
    this.reportService = new ReportService(PrismaClient);
  }

  getUsers = async (req: Request, res: Response) => {
    const data = await this.userService.findAll();
    return SuccessResponse({
      res,
      data: data,
      statusCode: 200,
    });
  };
  showAllbadgesUser = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const userId = parseInt(id);
    const existingUser = await this.userService.findUserById(userId);

    if (!existingUser) {
      return ErrorResponse({
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

    return SuccessResponse({
      res,
      data: mutateBadges,
      statusCode: 200,
    });
  };
  getBadgeUsers = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const userId = parseInt(id);
    const existingUser = await this.userService.findUserById(userId);

    if (!existingUser) {
      return ErrorResponse({
        res,
        data: null,
        statusCode: 404,
        error: "User not found",
      });
    }
    const data = await this.userService.findUserBadges(userId);
    return SuccessResponse({
      res,
      data: data,
      statusCode: 200,
    });
  };

  loginUser = async (req: Request<{}, LoginUserDTO>, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (parsed.success) {
      const data = parsed.data;

      const user = await this.userService.findUserExist(data.email!);
      if (!user)
        return ErrorResponse({
          data: null,
          res: res,
          statusCode: 400,
          error: "User is not found",
        });

      console.log("User is ", user);
      const isMatch = await BcryptHelper.comparePassword(
        data.password!,
        user.password!
      );
      if (!isMatch)
        return ErrorResponse({
          res,
          error: "Incorrect password",
          data: null,
          statusCode: 401,
        });

      // Generate token
      const token = await generateJwtAndStore({
        userId: user?.id?.toString() ?? "",
        email: user?.email ?? "",
      });

      return SuccessResponse({
        res,
        data: {
          token,
          user: { id: user.id, email: user.email, username: user.name },
        },
        statusCode: 200,
      });
    }
  };
  logoutUser = async (req: Request, res: Response) => {
    const redisClient = await getRedisClient();
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token)
      return ErrorResponse({
        data: null,
        res: res,
        statusCode: 400,
        error: "Token is required",
      });
    // Mark token as blacklisted
    await redisClient.set(`blacklist_token:${token}`, "blacklisted", {
      EX: TOKEN_EXPIRATION,
    });

    return SuccessResponse({
      res,
      data: "Logged out successfully",
      statusCode: 200,
    });
  };

  patchUser = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;

    try {
      const userId = parseInt(id);
      const existingUser = await this.userService.findUserById(userId);

      if (!existingUser) {
        return ErrorResponse({
          res,
          data: null,
          statusCode: 404,
          error: "User not found",
        });
      }

      // Validate JSON body
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return ErrorResponse({
          res,
          data: null,
          statusCode: 400,
          error: parsed.error.format(),
        });
      }

      const { username, email, phone, avatar } = parsed.data;
      let finalAvatar = existingUser.images?.[0]?.url ?? "";
      let imageId = undefined;
      imageId = existingUser.images?.[0]?.id;
      if (typeof avatar === "string") {
        // Check if URL already exists in DB
        const matchedImage = existingUser.images?.find(
          (img) => img.url === avatar
        );
        if (matchedImage) {
          //This case we need to delete old image first
          await this.storageService.deleteFile(matchedImage.url);
          finalAvatar = matchedImage.url;
          imageId = matchedImage.id;
        }
      }

      // Update user
      const updatedUser = await this.userService.updateUser(userId, {
        name: username,
        email,
        phone,
        avatar: finalAvatar,
      });

      // Update image record if ID exists
      if (imageId) {
        await this.uploadService.updateById(imageId, finalAvatar);
      }

      return SuccessResponse({
        res,
        data: updatedUser,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return next(error);
    }
  };

  socialAuth = async (req: Request, res: Response) => {
    const redisClient = await getRedisClient();
    const parsed = socialAuthSchema.safeParse(req.body);
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
      email = generateUniqueEmail();
    }
    let user = await this.userService.findUserExist(email!);
    const isNewUser = !user;

    if (!user) {
      user = await this.userService.registerUserEmail({
        email: email!,
        username: data.username || email!.split("@")[0],
        avatar: data.avatar || "",
        password: "social-auth",
        method: data.method,
      });
    }

    // Generate JWT
    const token = signJwt({ userId: user.id, email: user.email });
    await redisClient.set(`access_token:${user.id}:${token}`, "active", {
      EX: TOKEN_EXPIRATION,
    });

    return SuccessResponse({
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
  deleteUser = async (
    req: Request<{ id: string }, {}, RegisterPayload, {}>,
    res: Response
  ) => {
    const { id } = req.params;
    const validId = parseInt(id);
    const user = await this.userService.findUserById(validId);
    if (!user) {
      throw new Error("User doesnt exist");
    }
    await this.userService.deleteById(validId);
    const redisClient = await getRedisClient();
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token)
      return ErrorResponse({
        data: null,
        res: res,
        statusCode: 400,
        error: "Token is required",
      });
    // Mark token as blacklisted
    await redisClient.set(`blacklist_token:${token}`, "blacklisted", {
      EX: TOKEN_EXPIRATION,
    });
    return SuccessResponse({
      res,
      data: user,
      statusCode: 200,
    });
  };
  registerUser = async (
    req: Request<{}, RegisterUserDTO>,
    res: Response<ApiResponse<User[]>>
  ) => {
    let user = null;
    const parsed = authenticationSchema.safeParse(req.body);
    const data = parsed.data;
    if (parsed.success && data) {
      const isExist = await this.userService.findUserExist(data.email!);
      if (isExist) {
        throw new Error("User with the same email has already exist");
      }

      if (data?.method == LoginMethod.email) {
        const hashedPassword = await BcryptHelper.hashPassword(
          data.password!,
          10
        );

        user = await this.userService.registerUserEmail({
          email: data.email!,
          password: hashedPassword,
          username: data.username!,
          method: data.method,
        });
      }

      // Sign Jwt logic
      const token = await generateJwtAndStore({
        userId: user?.id?.toString() ?? "",
        email: user?.email ?? "",
      });
      return SuccessResponse({
        res,
        data: {
          token,
          user: {
            id: user!.id,
            email: user!.email,
            username: user!.name,
          },
        },
        statusCode: 200,
      });
    }
  };

  updateFcmToken = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return ErrorResponse({
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
    return SuccessResponse({
      res,
      data: { message: "Token updated successfully" },
      statusCode: 200,
    });
  };

  getReportLostLatest = async (
    req: Request<{ userId: string }>,
    res: Response
  ) => {
    const { userId } = req.params;
    const id = parseInt(userId);

    const existingUser = await this.userService.findUserById(id);
    if (!existingUser) {
      return ErrorResponse({
        res,
        data: null,
        statusCode: 404,
        error: "User is not found",
      });
    }

    const data = await this.reportService.findLatestReportByUser({
      userId: id,
      type: ReportType.LOST,
    });
    return SuccessResponse({
      res,
      data: data,
      statusCode: 200,
    });
  };

  getReportHistoryUser = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const { id } = req.params;
    const filters = req.filters;
    const reportStatus = filters?.status;
    const mutateUserId = parseInt(id);
    const existingUser = await this.userService.findUserById(mutateUserId);
    if (!existingUser) {
      return ErrorResponse({
        res,
        data: null,
        statusCode: 404,
        error: "User is not found",
      });
    }
    const data = await this.reportService.findReportHistoryByUser({
      userId: mutateUserId,
      status: reportStatus as ReportStatus,
    });
    return SuccessResponse({
      res,
      data,
      statusCode: 200,
    });
  };
}
