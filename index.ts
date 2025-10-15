import http from "http";
import { Server } from "socket.io";
import { AppEnv } from "./src/config/env";
import { getRedisClient } from "./src/lib";
import { setupChatSocket } from "./src/lib/socket/io";
import createAppServer from "./src/server";

const startServer = async () => {
  const app = createAppServer();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // allow all origins
      methods: ["GET", "POST"],
      credentials: true, // allow cookies
    },
  });

  // 2. Connect to Redis
  await getRedisClient();
  console.log("Redis has been established successfully.");

  // Setup socket.io events
  setupChatSocket(io);
  // Start server
  httpServer.listen(AppEnv.PORT, () => {
    console.log(`Express + Socket.IO running on port ${AppEnv.PORT}`);
  });
};

startServer();

export default startServer;
