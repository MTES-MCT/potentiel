import { DataTypes } from 'sequelize';

export const MakeEventStoreModel = (sequelize) => {
  const EventStore = sequelize.define(
    'eventStore',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payload: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      occurredAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      requestId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      aggregateId: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    },
    { paranoid: true, timestamps: true },
  );

  EventStore.associate = (models) => {
    // Add belongsTo etc. statements here
  };

  return EventStore;
};
