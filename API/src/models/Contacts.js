import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define(
    "Contacts",
    {
      id_contact: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      receptionsCant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNotGreaterThanThree(value) {
            if (value > 3)
              throw new Error(
                "The number of receptions should not be more than 3"
              );
          },
        },
      },
      client: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
