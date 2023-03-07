import { DataTypes, Sequelize } from 'sequelize';
import { UserDreal, userDrealTableName } from './userDreal.model';
import { User } from '../users/users.model';

export const initializeUserDrealModel = (sequelize: Sequelize) => {
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
      sequelize,
      tableName: userDrealTableName,
      timestamps: true,
      freezeTableName: true,
    },
  );
};

export const initializeUserDrealModelAssociations = () => {
  UserDreal.belongsTo(User, { foreignKey: 'userId' });
};
