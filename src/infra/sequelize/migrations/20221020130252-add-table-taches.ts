import { QueryInterface, DataTypes } from 'sequelize'
;('use strict')

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('taches', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateDeDébut: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateDeFin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nombreDeSucces: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nombreDEchecs: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('taches')
  },
}
