import { RedisClientType } from "redis";
import { AppEnv } from "./src/config/env";
import { getRedisClient } from "./src/lib";
import createAppServer from "./src/server";

const app = createAppServer();
let redisClient: RedisClientType | null;
const redisConnect = async () => {
  try {
    await getRedisClient();
    console.log("Redis has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
redisConnect();
const server = app.listen(AppEnv.PORT, async () => {
  console.log("Welcome to express is startings");
});
server.on("connect", (req) => {
  console.log("Express js server is up running");
});

export default server;
