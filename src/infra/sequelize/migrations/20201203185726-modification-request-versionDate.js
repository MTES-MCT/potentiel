'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('modificationRequests', 'versionDate', {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
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
