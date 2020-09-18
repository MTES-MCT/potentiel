import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Notification = sequelize.define(
    'notification',
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
    },
    {
      timestamps: true,
    }
  )

  Notification.associate = (models) => {
    // Add belongsTo etc. statements here
  }

  return Notification
}
