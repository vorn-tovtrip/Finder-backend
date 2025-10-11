import cors from "cors";
const corsMiddleware = cors({
  origin: ["*"],
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
});
export default corsMiddleware;
