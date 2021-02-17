import { DataTypes } from 'sequelize'

export const MakeUserProjectsModel = (sequelize) => {
  const UserProjects = sequelize.define(
    'UserProjects',
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  )

  UserProjects.associate = (models) => {
    const { User } = models

    UserProjects.belongsTo(User, { foreignKey: 'userId' })
  }

  return UserProjects
}
