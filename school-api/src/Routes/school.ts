import { Router } from "express";
import {
  createSchool,
  deleteSchoolById,
  getSchoolById,
  getSchools,
  updateSchool,
} from "../handlers/school";
import { verifyToken } from "../handlers/user";

const schoolRouter = Router();

schoolRouter
  .get("/", getSchools)
  .post("/", createSchool)
  .put("/", verifyToken, updateSchool);

schoolRouter
  .get("/:id", getSchoolById)
  .delete("/:id", verifyToken, deleteSchoolById);

export default schoolRouter;
