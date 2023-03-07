import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { UserDreal, userDrealTableName } from './userDreal.model';
import { User } from '../users/users.model';

export const initializeUserDrealModel = () => {
  UserDreal.init(
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
      sequelize: sequelizeInstance,
      tableName: userDrealTableName,
      timestamps: true,
      freezeTableName: true,
    },
  );
};

export const initializeUserDrealModelAssociations = () => {
  UserDreal.belongsTo(User, { foreignKey: 'userId' });
};
