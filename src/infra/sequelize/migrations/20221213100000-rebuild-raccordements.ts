import { QueryInterface } from 'sequelize';
import { RaccordementsProjector } from '../projectionsNext/raccordements/raccordements.projector';

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await RaccordementsProjector.rebuild(transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async () => {},
};
