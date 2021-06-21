'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('projects', 'newRulesOptIn', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('projects', 'newRulesOptIn')
  },
}
