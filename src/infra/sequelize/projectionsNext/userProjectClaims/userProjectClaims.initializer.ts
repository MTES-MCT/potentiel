import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { UserProjectClaims, userProjectClaimsTableName } from './userProjectClaims.model';
import { User } from '../users/users.model';

export const initializeUserProjectClaimsModel = () => {
  UserProjectClaims.init(
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
      sequelize: sequelizeInstance,
      tableName: userProjectClaimsTableName,
      timestamps: true,
      freezeTableName: true,
    },
  );
};

export const initializeUserProjectClaimsModelAssociations = () => {
  UserProjectClaims.belongsTo(User, { foreignKey: 'userId' });
};
