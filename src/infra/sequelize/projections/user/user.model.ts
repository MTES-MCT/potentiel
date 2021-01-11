import { DataTypes } from 'sequelize'

export const MakeUserModel = (sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectAdmissionKey: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  )

  User.associate = (models) => {
    // Add belongsTo etc. statements here
  }

  return User
}
