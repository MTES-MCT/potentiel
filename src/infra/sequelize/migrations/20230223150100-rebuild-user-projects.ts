import { QueryInterface } from 'sequelize';
import { UserProjectsProjector } from '../projectionsNext/userProjects/userProjects.model';

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await UserProjectsProjector.rebuild(transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async () => {},
};
