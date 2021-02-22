'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_steps', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      projectId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      stepDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      fileId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      submittedOn: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      submittedBy: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      details: {
        type: Sequelize.DataTypes.JSON,
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
