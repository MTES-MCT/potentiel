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
      dueOn: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      stepDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      fileId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      submittedOn: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      submittedBy: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
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
