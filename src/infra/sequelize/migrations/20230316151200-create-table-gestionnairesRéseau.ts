import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('gestionnaireRéseau', {
      codeEIC: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      raisonSociale: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      légende: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    await queryInterface.dropTable('gestionnaireRéseauListe');
    await queryInterface.dropTable('gestionnaireRéseauDétail');
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('gestionnaireRéseau');
  },
};
