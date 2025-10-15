"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatSocket = exports.onlineUsers = exports.ioInstance = void 0;
const message_controller_1 = require("../../controller/message.controller");
exports.onlineUsers = {};
const setupChatSocket = (io) => {
    /*  Pattern
    onlineUsers= {
    userId:socketId,
    userIdB:sockerIdB
    }
  
    onlineUsers = {
    7: asdas-342sads-e,
    8:be88asdd-asdsdd0
    }
  
    */
    exports.ioInstance = io; // save io instance globally
    const messageController = new message_controller_1.MessageController();
    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);
        // Join event
        socket.on("join", (userId) => {
            exports.onlineUsers[userId] = socket.id;
            //This everyone gonna emit join socket id is a unique id for each device
            console.log("Online users:", exports.onlineUsers);
        });
        // Send message
        // socket.on(
        //   "sendMessage",
        //   (data: { senderId: number; receiverId: number; content: string }) => {
        //     messageController.handleSendMessage(socket, onlineUsers, data);
        //   }
        // );
        // Send message
        socket.on("sendMessage", async (data) => {
            const { senderId, receiverId } = data;
            // Save message to DB
            const message = await messageController.handleSendMessage(socket, exports.onlineUsers, data);
            // Send last message to both sender & receiver for chat list update
            [senderId, receiverId].forEach((id) => {
                const userSocket = exports.onlineUsers[id.toString()];
                if (userSocket) {
                    io.to(userSocket).emit("updateLastMessage", message);
                }
            });
        });
        // Disconnect
        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
            for (const [userId, sId] of Object.entries(exports.onlineUsers)) {
                if (sId === socket.id)
                    delete exports.onlineUsers[userId];
            }
        });
    });
};
exports.setupChatSocket = setupChatSocket;
// socket.on("updateLastMessage", (message) => {
//   // update your chat list state
// });
