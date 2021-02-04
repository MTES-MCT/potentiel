'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('sessions', 'data', {
      type: Sequelize.DataTypes.TEXT,
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
