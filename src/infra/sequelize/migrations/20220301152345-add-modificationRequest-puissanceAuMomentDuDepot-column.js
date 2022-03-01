'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('modificationRequests', 'puissanceAuMomentDuDepot', {
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('modificationRequests', 'puissanceAuMomentDuDepot')
  },
}
