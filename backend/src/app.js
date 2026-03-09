import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url'
import cors from "cors"
import userRouter from "./routes/userRoutes.js"
import projectRouter from "./routes/projectRoutes.js"
import inviteRouter from "./routes/inviteRoutes.js"
import assignmentRouter from "./routes/assignmentRoutes.js"
import authMiddleware from "./middleware/auth.js"
import messageRouter from "./routes/messageRoutes.js"

const app = express();
export const PORT = process.env.PORT || 5000;


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frontendPath = path.join(__dirname, '../dist')
app.use(express.static(frontendPath));

app.use(cors())

app.use(express.json());

app.use("/api/auth", userRouter);

app.use("/api/assignment", authMiddleware,assignmentRouter)

app.use("/api/invite",authMiddleware, inviteRouter)

app.use("/api/message",authMiddleware, messageRouter)

app.use("/api", projectRouter);

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app