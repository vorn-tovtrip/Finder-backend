"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const lib_1 = require("../lib");
const service_1 = require("../service");
const utils_1 = require("../utils");
class MessageController {
    constructor() {
        this.messageService = new service_1.MessageService(lib_1.PrismaClient);
    }
    async getAllMessages(req, res) {
        const messages = await this.messageService.findAll();
        return (0, utils_1.SuccessResponse)({ res, data: messages, statusCode: 200 });
    }
    async getUserConversations(req, res) {
        const currentUserId = parseInt(req.params.userId);
        // Fetch last message per conversation
        const conversations = await this.messageService.getConversations(currentUserId);
        return res.status(200).json({
            success: true,
            data: conversations,
        });
    }
    async getMessageBetween(req, res) {
        try {
            const currentUser = parseInt(req.params.currentUser);
            const userId = parseInt(req.params.userId);
            const messages = await this.messageService.getMessagesBetween(currentUser, userId);
            return (0, utils_1.SuccessResponse)({ res, data: messages, statusCode: 200 });
        }
        catch (error) {
            console.error("Error fetching messages:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async deleteAllMessage(req, res, next) {
        try {
            const messages = await this.messageService.deleteAll();
            return (0, utils_1.SuccessResponse)({ res, data: messages, statusCode: 201 });
        }
        catch (error) {
            next(error);
        }
    }
    async handleSendMessage(socket, onlineUsers, data) {
        try {
            const { senderId, receiverId, content } = data;
            // Save message to database
            const message = await this.messageService.createMessage(senderId, receiverId, content);
            // Emit to receiver if online
            const receiverSocket = onlineUsers[receiverId.toString()];
            console.log("Receiver socket is", receiverSocket);
            if (receiverSocket) {
                //Emit to receiver with a specific receiverSocketId
                socket.to(receiverSocket).emit("receiveMessage", message);
            }
            // Emit to sender
            socket.emit("receiveMessage", message);
        }
        catch (error) {
            console.error("Error sending message:", error);
        }
    }
}
exports.MessageController = MessageController;
