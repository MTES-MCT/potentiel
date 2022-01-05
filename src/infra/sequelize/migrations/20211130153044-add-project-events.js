'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_events', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      projectId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      payload: {
        type: Sequelize.DataTypes.JSON,
      },
      valueDate: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      eventPublishedAt: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        default: 0,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
