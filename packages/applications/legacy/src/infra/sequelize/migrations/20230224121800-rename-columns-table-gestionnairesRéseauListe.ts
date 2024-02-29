import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.renameColumn('gestionnairesRéseauListe', 'id', 'codeEIC');
    await queryInterface.renameColumn('gestionnairesRéseauListe', 'nom', 'raisonSociale');
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.renameColumn('gestionnairesRéseauListe', 'codeEIC', 'id');
    await queryInterface.renameColumn('gestionnairesRéseauListe', 'raisonSociale', 'nom');
  },
};
