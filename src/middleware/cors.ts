import cors from "cors";
const corsMiddleware = cors({
  origin: ["*"],
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed HTTP methods
  credentials: true,
});
export default corsMiddleware;
