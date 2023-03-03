import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { User, étatsUser, userTableName } from './users.model';

export const initUserModel = () => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      registeredOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      keycloakId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      fonction: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      état: {
        type: DataTypes.ENUM(...étatsUser),
        allowNull: true,
      },

      createdAt: DataTypes.DATE,
    },
    {
      sequelize: sequelizeInstance,
      tableName: userTableName,
      timestamps: true,
      freezeTableName: true,
    },
  );
};
