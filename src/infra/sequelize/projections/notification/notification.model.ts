import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

export class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  id: string;
  type: string;
  message: Record<string, string>;
  context: Record<string, string>;
  variables: Record<string, string>;
  status: string;
  error?: string;
  createdAt: CreationOptional<Date>;
}

export const MakeNotificationModel = (sequelize) => {
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
      sequelize,
      tableName: 'notifications',
      timestamps: true,
    },
  );

  return Notification;
};
