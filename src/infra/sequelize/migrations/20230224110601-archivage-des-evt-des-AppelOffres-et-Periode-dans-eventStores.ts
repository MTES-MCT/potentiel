import { Op, QueryInterface } from 'sequelize';
import models from '../models';

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const { EventStore } = models;

      await EventStore.destroy(
        {
          where: {
            type: {
              [Op.in]: [
                'AppelOffreCreated',
                'AppelOffreRemoved',
                'AppelOffreUpdated',
                'PeriodeCreated',
                'PeriodeUpdated',
              ],
            },
          },
        },
        { transaction },
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  down: () => {},
};
