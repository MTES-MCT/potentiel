'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('projects', 'numeroGestionnaire', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('projects', 'numeroGestionnaire')
  },
}
