import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.renameColumn('gestionnaireRéseauDétail', 'id', 'codeEIC');
    await queryInterface.renameColumn('gestionnaireRéseauDétail', 'nom', 'raisonSociale');
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.renameColumn('gestionnaireRéseauDétail', 'codeEIC', 'id');
    await queryInterface.renameColumn('gestionnaireRéseauDétail', 'raisonSociale', 'nom');
  },
};
