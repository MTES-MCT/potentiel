'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'fonction', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'fonction')
  },
}
