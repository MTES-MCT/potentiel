'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_ptfs', {
      projectId: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      ptfDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      fileId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      submittedBy: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
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
