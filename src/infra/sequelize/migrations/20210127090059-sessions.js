'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sessions', {
      sid: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
      },
      data: {
        type: Sequelize.DataTypes.STRING,
      },
      expires: {
        type: Sequelize.DataTypes.DATE,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sessions')
  },
}
