import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('appelOffre');
    await queryInterface.dropTable('periode');
  },
  down: () => {},
};
