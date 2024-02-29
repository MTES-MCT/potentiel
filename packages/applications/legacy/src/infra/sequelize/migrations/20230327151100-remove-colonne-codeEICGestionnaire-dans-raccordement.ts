import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('raccordements', 'codeEICGestionnaireRéseau');
  },
  down: async (queryInterface: QueryInterface) => {},
};
