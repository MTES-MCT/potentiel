import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('taches', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gestionnaire: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      état: {
        type: DataTypes.ENUM('en cours', 'terminée'),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('maj-date-mise-en-service'),
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
    })

    queryInterface.addConstraint('taches', {
      fields: ['gestionnaire', 'type', 'dateDeDébut'],
      type: 'unique',
      name: 'tache_unique_gestionnaire_type_dateDeDébut',
    })
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint('taches', 'tache_unique_gestionnaire_type_dateDeDébut')
    await queryInterface.dropTable('taches')
  },
}
