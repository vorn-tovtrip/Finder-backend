import { AppEnv } from "./src/config/env";
import createAppServer from "./src/server";

const app = createAppServer();
const dbconnect = async () => {
  try {
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
const server = app.listen(AppEnv.PORT, async () => {
  console.log("Welcome to express is startings");
});
server.on("connect", (req) => {
  console.log("Express js server is up running");
});

export default server;
