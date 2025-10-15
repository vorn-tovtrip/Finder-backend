import { Request, Response } from "express";
import { Socket } from "socket.io";
import { PrismaClient } from "../lib";
import { MessageService } from "../service";
import { SuccessResponse } from "../utils";

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService(PrismaClient);
  }

  async getAllMessages(req: Request, res: Response) {
    const messages = await this.messageService.findAll();
    return SuccessResponse({ res, data: messages, statusCode: 200 });
  }
  async getUserConversations(req: Request, res: Response) {
    const currentUserId = parseInt(req.params.userId);
    // Fetch last message per conversation
    const conversations = await this.messageService.getConversations(
      currentUserId
    );

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  }
  async getMessageBetween(req: Request, res: Response) {
    try {
      const currentUser = parseInt(req.params.currentUser);
      const userId = parseInt(req.params.userId);

      const messages = await this.messageService.getMessagesBetween(
        currentUser,
        userId
      );

      return SuccessResponse({ res, data: messages, statusCode: 200 });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async handleSendMessage(
    socket: Socket,
    onlineUsers: Record<string, string>,
    data: { senderId: number; receiverId: number; content: string }
  ) {
    try {
      const { senderId, receiverId, content } = data;

      // Save message to database
      const message = await this.messageService.createMessage(
        senderId,
        receiverId,
        content
      );

      // Emit to receiver if online
      const receiverSocket = onlineUsers[receiverId.toString()];

      console.log("Receiver socket is", receiverSocket);
      if (receiverSocket) {
        //Emit to receiver with a specific receiverSocketId
        socket.to(receiverSocket).emit("receiveMessage", message);
      }

      // Emit to sender

      socket.emit("receiveMessage", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

// Client A ----sendMessage---> Server ----> Save DB
//                                  |
//                                  |---> Client B receiveMessage (if online)
//                                  |
//                                  |---> Client A receiveMessage
