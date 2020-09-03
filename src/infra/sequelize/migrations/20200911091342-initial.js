'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('file', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      filename: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      forProject: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      designation: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      storedAt: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
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
