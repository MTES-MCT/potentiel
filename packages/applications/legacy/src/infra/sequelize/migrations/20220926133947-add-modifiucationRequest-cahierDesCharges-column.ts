'use strict';

import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize) => {
    await queryInterface.addColumn('modificationRequests', 'cahierDesCharges', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    queryInterface.removeColumn('modificationRequests', 'cahierDesCharges');
  },
};
