'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('projectAdmissionKeys', 'cancelled', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('projectAdmissionKeys', 'cancelled')
  },
}
