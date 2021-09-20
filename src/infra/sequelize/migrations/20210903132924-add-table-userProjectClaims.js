'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userProjectClaims', {
      userId: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      projectId: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      tryCounter: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
