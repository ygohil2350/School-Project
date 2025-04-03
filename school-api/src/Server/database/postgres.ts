import { Model, ModelCtor, Sequelize } from "sequelize";
import { createSchoolSchema } from "../models/schoolSchema";
import { createUserSchema } from "../models/userSchema";

const sequelize = new Sequelize("school_database", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});

let UserModel: ModelCtor<Model<any, any>>;
let SchoolModel: ModelCtor<Model<any, any>>;
const connection = async () => {
  try {
    await sequelize.authenticate();
    SchoolModel = await createSchoolSchema(sequelize);
    UserModel = await createUserSchema(sequelize);
    await sequelize.sync();
  } catch (err) {
    console.error("Failed to connect to PostgreSQL", err);
  }
};

export { connection, UserModel, SchoolModel };
