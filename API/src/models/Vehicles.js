import { Sequelize, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  sequelize.define(
    "Vehicles",
    {
      id_vehicle: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      reception: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      licensePlateId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      license_plate_expedition: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      license_plate_expiration_next_year: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_DATE + INTERVAL '1 year'"),
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      vin: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      makeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Makes",
          key: "id_make",
        },
      },
      yearId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Years",
          key: "id_year",
        },
      },
    },
    {
      timestamps: false,
      hooks: {
        beforeCreate: (vehicle, options) => {
          vehicle.licensePlateId = generateRandomLicensePlateId();
          vehicle.vin = generateRandomVin();
        },
      },
    }
  );
};

function generateRandomLicensePlateId() {
  return uuidv4().replace(/-/g, "").substring(0, 7);
}

function generateRandomVin() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let vin = "";
  for (let i = 0; i < 7; i++) {
    vin += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return vin;
}
