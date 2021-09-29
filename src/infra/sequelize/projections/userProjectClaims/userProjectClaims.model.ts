import { DataTypes } from 'sequelize'

export const MakeUserProjectClaimsModel = (sequelize) => {
  const UserProjectClaims = sequelize.define(
    'userProjectClaims',
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      failedAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  )

  UserProjectClaims.associate = (models) => {
    const { User } = models

    UserProjectClaims.belongsTo(User, { foreignKey: 'userId' })
  }

  return UserProjectClaims
}
