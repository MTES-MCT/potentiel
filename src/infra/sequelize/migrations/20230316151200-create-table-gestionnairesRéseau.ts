import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('gestionnaireRéseau', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      légende: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });

    await queryInterface.dropTable('gestionnaireRéseauListe');
    await queryInterface.dropTable('gestionnaireRéseauDétail');
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('gestionnaireRéseauDétail');
  },
};
