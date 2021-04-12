'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('appelOffres', {
      id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
      },
      data: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })

    await queryInterface.createTable('periodes', {
      periodeId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
      },
      appelOffreId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
      },
      data: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('appelOffres')
    await queryInterface.dropTable('periodes')
  },
}
