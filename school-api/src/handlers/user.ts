import { Request, Response } from "express";
import { UserModel } from "../Server/database/postgres";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { handleErrors } from "../utils";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ where: { email } });
  if (!user) {
    res.status(204).json({ message: "User not found" });
    return;
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    String(user.get("password"))
  );
  if (!isPasswordCorrect) {
    res.status(204).json({ message: "Password is incorrect" });
    return;
  }
  console.log(process.env.JWT_SECRET);
  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT secret is not defined" });
    return;
  }

  const token = jwt.sign(
    { email: email },
    process.env.JWT_SECRET as jwt.Secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } as jwt.SignOptions
  );

  if (user) {
    res.json({ token, userId: user.get("id") });
  } else {
    res.status(204).json({ message: "User not found" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;
    const user = await UserModel.findOne({ where: { email: rest.email } });
    if (user?.dataValues?.id) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    await UserModel.create(req.body);
    res.json({ message: "User created successfully" });
  } catch (err) {
    handleErrors(err, res);
  }
};

export const verifyToken = (req: Request, res: Response, next: any) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT secret is not defined" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.user = decoded;
    next();
  } catch (err) {
    handleErrors(err, res, 401, "Invalid Token");
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const { email } = req.body.user;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      res.status(204).json({ message: "User not found" });
      return;
    }
    const { password, ...rest } = user.get();
    res.json({ user: rest });
  } catch (err) {
    handleErrors(err, res);
  }
};
