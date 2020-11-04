import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const EventStore = sequelize.define('eventStore', {
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
      type: DataTypes.STRING,
      allowNull: true,
    },
  })

  EventStore.associate = (models) => {
    // Add belongsTo etc. statements here
  }

  return EventStore
}
