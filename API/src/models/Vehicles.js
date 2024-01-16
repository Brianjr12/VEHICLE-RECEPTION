import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define(
    "Vehicle",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      vin: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      make: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      license_plate: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      license_plate_expiration: {
        type: DataTypes.ARRAY(DataTypes.DATEONLY),
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
