import { Server, Socket } from "socket.io";
import { MessageController } from "../../controller/message.controller";
export let ioInstance: Server;
export const onlineUsers: Record<string, string> = {};
export const setupChatSocket = (io: Server) => {
  ioInstance = io; // save io instance globally
  const messageController = new MessageController();
  io.on("connection", (socket: Socket) => {
    console.log("🟢 User connected:", socket.id);
    // Join event
    socket.on("join", (userId: string) => {
      onlineUsers[userId] = socket.id;
      //This everyone gonna emit join socket id is a unique id for each device
      console.log("Online users:", onlineUsers);
    });

    // Send message
    socket.on(
      "sendMessage",
      async (data: {
        senderId: number;
        receiverId: number;
        content: string;
      }) => {
        const { senderId, receiverId } = data;

        // Save message to DB
        const message = await messageController.handleSendMessage(
          socket,
          onlineUsers,
          data
        );
        // Send last message to both sender & receiver for chat list update
        [senderId, receiverId].forEach((id) => {
          const userSocket = onlineUsers[id.toString()];
          if (userSocket) {
            io.to(userSocket).emit("updateLastMessage", message);
          }
        });
      }
    );

    // Disconnect
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
      for (const [userId, sId] of Object.entries(onlineUsers)) {
        if (sId === socket.id) delete onlineUsers[userId];
      }
    });
  });
};
