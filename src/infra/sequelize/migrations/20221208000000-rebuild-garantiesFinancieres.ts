import { QueryInterface } from 'sequelize';
import {
  createProjectorFactory,
  initializeGarantiesFinancièresProjector,
} from '@infra/sequelize/projectionsNext';

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const projectFactory = createProjectorFactory(queryInterface.sequelize);
      await initializeGarantiesFinancièresProjector(projectFactory).rebuild(transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async () => {},
};
