'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('modificationRequests', 'dateAchèvementAccordée', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('modificationRequests', 'dateAchèvementAccordée')
  },
}
