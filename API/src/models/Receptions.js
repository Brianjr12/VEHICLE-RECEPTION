import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define(
    "Receptions",
    {
      id_reception: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      id_reception_public: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      vehicleID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Vehicles",
          key: "id_vehicle",
        },
      },
      contactId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Contacts",
          key: "id_contact",
        },
      },
    },
    {
      timestamps: false,
      hooks: {
        beforeCreate: (reception, options) => {
          reception.id_reception_public = generateRandomId();
        },
      },
    }
  );
};

function generateRandomId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let idReceptionPublic = "";
  for (let i = 0; i < 7; i++) {
    idReceptionPublic += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return idReceptionPublic;
}
