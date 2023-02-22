import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('projects', 'garantiesFinancieresDueOn');
    await queryInterface.removeColumn('projects', 'garantiesFinancieresRelanceOn');
    await queryInterface.removeColumn('projects', 'garantiesFinancieresFileId');
  },

  down: async () => {},
};
