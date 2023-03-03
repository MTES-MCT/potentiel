import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { Notification } from './notification.model';

export const initNotificationModel = () => {
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      context: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      variables: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      error: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
    },
    {
      sequelize: sequelizeInstance,
      tableName: 'notifications',
      timestamps: true,
    },
  );
};
