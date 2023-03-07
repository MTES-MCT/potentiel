import { DataTypes, Sequelize } from 'sequelize';
import { UserProjectClaims, userProjectClaimsTableName } from './userProjectClaims.model';
import { User } from '../users/users.model';

export const initializeUserProjectClaimsModel = (sequelize: Sequelize) => {
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
      sequelize,
      tableName: userProjectClaimsTableName,
      timestamps: true,
      freezeTableName: true,
    },
  );
};

export const initializeUserProjectClaimsModelAssociations = () => {
  UserProjectClaims.belongsTo(User, { foreignKey: 'userId' });
};
