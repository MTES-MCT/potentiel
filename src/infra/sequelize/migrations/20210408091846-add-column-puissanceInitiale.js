'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('projects', 'puissanceInitiale', {
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    })

    await queryInterface.sequelize.query('UPDATE projects SET "puissanceInitiale" = puissance')
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('projects', 'puissanceInitiale')
  },
}
