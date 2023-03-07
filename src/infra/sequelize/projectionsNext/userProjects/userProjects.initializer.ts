import { DataTypes, Sequelize } from 'sequelize';
import { UserProjects } from './userProjects.model';
import { User } from '../users/users.model';

export const initializeUserProjectsModel = (sequelize: Sequelize) => {
  UserProjects.init(
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
      sequelize,
      tableName: 'UserProjects',
      freezeTableName: true,
    },
  );
};

export const initializeUserProjectsModelAssociations = () => {
  UserProjects.belongsTo(User, { as: 'user', foreignKey: 'userId' });
};
