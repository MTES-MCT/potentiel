import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { UserProjectClaims, userProjectClaimsTableName } from './userProjectClaims.model';

export const initUserProjectClaimsModel = () => {
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
