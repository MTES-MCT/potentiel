'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tacheDeFond', {
      id: { type: Sequelize.DataTypes.UUID, primaryKey: true, allowNull: false },
      typeTache: { type: Sequelize.DataTypes.STRING, allowNull: false },
      utilisateurId: { type: Sequelize.DataTypes.UUID, allowNull: false },
      statut: { type: Sequelize.DataTypes.STRING, allowNull: false },
      dateDebut: { type: Sequelize.DataTypes.DATE, allowNull: false },
      dateFin: { type: Sequelize.DataTypes.DATE, allowNull: true },
      rapport: { type: Sequelize.DataTypes.JSON, allowNull: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tacheDeFond')
  },
}
