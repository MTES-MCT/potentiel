'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('modificationRequests', 'acceptanceParams', {
      type: Sequelize.DataTypes.JSON,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('modificationRequests', 'acceptanceParams')
  },
}
