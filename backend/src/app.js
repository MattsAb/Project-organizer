import "dotenv/config";
import express from "express";
import cors from "cors"
import userRouter from "./routes/userRoutes.js"
import projectRouter from "./routes/projectRoutes.js"
import inviteRouter from "./routes/inviteRoutes.js"
import assignmentRouter from "./routes/assignmentRoutes.js"
import authMiddleware from "./middleware/auth.js"
import messageRouter from "./routes/messageRoutes.js"

const app = express();
export const PORT = process.env.PORT || 5000;

app.use(cors())

app.use(express.json());

app.use("/api/auth", userRouter);

app.use("/api/assignment", authMiddleware,assignmentRouter)

app.use("/api/invite",authMiddleware, inviteRouter)

app.use("/api/message",authMiddleware, messageRouter)

app.use("/api", projectRouter);

export default app