import server from "../../..";

export const closeServer = () => {
  if (server.listening) {
    server.close((err) => {
      if (err) {
        console.error("Error during server shutdown:", err);
      } else {
        console.log("Server force shutdown");
      }
      process.exit(0);
    });
  } else {
    console.error("Server is not running, cannot shut it down.");
    process.exit(1);
  }
};
