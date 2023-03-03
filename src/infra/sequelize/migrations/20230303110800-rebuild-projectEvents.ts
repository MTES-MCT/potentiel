import { QueryInterface } from 'sequelize';
import { ProjectEventProjector } from '../projectionsNext/projectEvents/projectEvent.model';

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
