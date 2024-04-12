import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('projects', 'contratEDF');
    await queryInterface.removeColumn('projects', 'contratEnedis');
  },
};
