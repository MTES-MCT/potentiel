import { getGarantiesFinancièresProjector } from '@infra/sequelize/projectionsNext';
import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await getGarantiesFinancièresProjector().rebuild(transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async () => {},
};
