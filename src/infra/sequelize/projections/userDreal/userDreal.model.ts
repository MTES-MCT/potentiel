import { DataTypes } from 'sequelize'

export const MakeUserDrealModel = (sequelize) => {
  const Model = sequelize.define(
    'userDreal',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      dreal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  )

  Model.associate = (models) => {
    // Add belongsTo etc. statements here
  }

  return Model
}
