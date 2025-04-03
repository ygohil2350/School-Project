import { DataTypes, Sequelize } from "sequelize";

export const createSchoolSchema = async (sequelize: Sequelize) => {
  const School = sequelize.define("schools", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return School;
};
