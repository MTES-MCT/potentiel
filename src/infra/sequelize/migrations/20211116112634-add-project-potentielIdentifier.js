'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('projects', 'potentielIdentifier', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('projects', 'potentielIdentifier')
  }
};
