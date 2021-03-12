'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('modificationRequests', 'responseFileId', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('modificationRequests', 'responseFileId')
  },
}
