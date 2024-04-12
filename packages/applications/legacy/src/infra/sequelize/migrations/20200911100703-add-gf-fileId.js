'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('projects', 'garantiesFinancieresFileId', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('projects', 'garantiesFinancieresFileId');
  },
};
