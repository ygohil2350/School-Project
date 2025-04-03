import { Router } from "express";
import {
  createUser,
  getUserData,
  loginUser,
  verifyToken,
} from "../handlers/user";

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/", verifyToken, getUserData);

export default userRouter;
