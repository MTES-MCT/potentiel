'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('Sequelize.NOW', Sequelize.NOW)
    queryInterface.addColumn('modificationRequests', 'versionDate', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
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
