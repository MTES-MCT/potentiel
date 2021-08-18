import { DataTypes } from 'sequelize'

export const MakeCredentialsModel = (sequelize) => {
  const Credentials = sequelize.define(
    'credential',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hash: {
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

  Credentials.associate = (models) => {
    // Add belongsTo etc. statements here
  }

  return Credentials
}
