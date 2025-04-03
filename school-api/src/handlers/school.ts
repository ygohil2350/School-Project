import { Request, Response } from "express-serve-static-core";
import { SchoolModel } from "../Server/database/postgres";
import { handleErrors } from "../utils";

export const getSchools = async (_: Request, res: Response) => {
  try {
    const schoolList = await SchoolModel.findAll();
    if (schoolList?.length == 0) {
      res.status(204).send([]);
    } else {
      res.send(schoolList);
    }
  } catch (err) {
    handleErrors(err, res);
  }
};

export const createSchool = async (req: Request, res: Response) => {
  try {
    const { name, description, phone } = req.body;
    const school = await SchoolModel.create({ name, description, phone });
    if (school) {
      res.status(201).send(school);
    } else {
      res.status(406).json({ message: "School not created" });
    }
  } catch (err) {
    handleErrors(err, res);
  }
};

export const getSchoolById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const school = await SchoolModel.findByPk(req.params.id);
    if (school) {
      res.send(school);
    } else {
      res.status(406).json({ message: "School not found" });
    }
  } catch (err) {
    handleErrors(err, res);
  }
};

export const deleteSchoolById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const school = await SchoolModel.findByPk(req.params.id);
    if (school) {
      await school.destroy();
      res.json({ message: "School deleted successfully" });
    } else {
      res.status(406).json({ message: "School not found" });
    }
  } catch (err) {
    handleErrors(err, res);
  }
};

export const updateSchool = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const school = await SchoolModel.update(req.body, {
      where: { id: req.body.id },
    });
    if (school) {
      res.json({ message: "School updated successfully" });
    } else {
      res.status(406).json({ message: "School not found" });
    }
  } catch (err) {
    handleErrors(err, res);
  }
};
