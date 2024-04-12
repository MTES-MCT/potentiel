'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('modificationRequests', 'respondedBy', {
      type: Sequelize.DataTypes.UUID,
      allowNull: true,
    });
    queryInterface.addColumn('modificationRequests', 'respondedOn', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
