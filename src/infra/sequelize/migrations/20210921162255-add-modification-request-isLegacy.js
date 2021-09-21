'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('modificationRequests', 'isLegacy', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: true,
      default: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('modificationRequests', 'isLegacy')
  },
}
