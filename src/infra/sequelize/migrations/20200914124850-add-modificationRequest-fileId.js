'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('modificationRequests', 'fileId', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('modificationRequests', 'fileId')
  },
}
