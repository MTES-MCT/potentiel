import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { UserProjects, userProjectsTableName } from './userProjects.model';

export const initUserProjects = () => {
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
      sequelize: sequelizeInstance,
      tableName: userProjectsTableName,
      freezeTableName: true,
    },
  );
};
