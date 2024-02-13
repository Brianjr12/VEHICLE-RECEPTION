import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define(
    "Makes",
    {
      id_make: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      make: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
