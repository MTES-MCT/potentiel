import { QueryInterface } from 'sequelize';
import { ProjectEventProjector } from '@infra/sequelize/projectionsNext';

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await ProjectEventProjector.rebuild(transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async () => {},
};
