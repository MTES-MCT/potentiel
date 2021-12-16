'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('project_events', 'valueDate', {
      type: Sequelize.DataTypes.BIGINT,
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
