import express, { Request, Response, NextFunction } from "express";
import schoolRouter from "./Routes/school";
import { connection } from "./Server/database/postgres";
import cors from "cors";
import userRouter from "./Routes/user";
import { verifyToken } from "./handlers/user";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware to parse JSON request bodies
app.use(express.json(), cors());
connection();

// Middleware to log requests
app.use((req: Request, _: Response, next: NextFunction) => {
  console.log(process.env);
  console.log(`${req.method} ${req.path}`);
  console.log(req.body);
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use("/school", schoolRouter);
app.use("/user", userRouter);
