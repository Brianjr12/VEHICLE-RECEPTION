import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define(
    "Years",
    {
      id_year: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      year_number: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
