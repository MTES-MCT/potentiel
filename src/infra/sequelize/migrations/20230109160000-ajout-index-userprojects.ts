import { QueryInterface } from 'sequelize';

export default {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addIndex('UserProjects', ['userId', 'projectId']);
  },

  down: async () => {},
};
